from datetime import datetime
from hashlib import md5
import os
import sys
from uuid import uuid4
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from tqdm import tqdm

location_updated_stations = set()


def get_request_token(url: str, data: dict[str, str] | None = None):
    n: str
    if data is not None:
        n = "&".join([f"{item[0]}={item[1]}" for item in data.items()])
    else:
        n = url.split("?")[1] if len(url.split("?")) > 1 else ""
    r = md5(n.encode())
    o = datetime.now().strftime("%Y%m%d%H%M")
    rr = r.hexdigest()
    return rr[0:4] + o[0:4] + rr[4:12] + o[4:8] + rr[12:24] + o[8:] + rr[24:]


def fetch_from_dsat(url: str, method: str, data: dict | None = None):
    res = requests.request(
        method,
        f"https://bis.dsat.gov.mo:37812/{url}",
        data=data,
        headers={
            "token": get_request_token(url, data),
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
        },
        timeout=5,
    )
    return res


def get_route_list():
    return fetch_from_dsat(
        "macauweb/getRouteAndCompanyList.html", "post"
    ).json()


def get_route_data(route_name: str, direction: str, lang: str = "zh_tw"):
    return fetch_from_dsat(
        "macauweb/getRouteData.html",
        "post",
        {
            "action": "sd",
            "routeName": route_name,
            "dir": direction,
            "lang": lang,
        },
    ).json()


def get_detailed_route_data(
    route_code: str, direction: str, lang: str = "zh_tw"
):
    return fetch_from_dsat(
        "ddbus/app/routestation/station",
        "post",
        {
            "routecode": route_code,
            "dir": direction,
            "device": "web",
            "lang": lang,
            "BypassToken": "HuatuTesting0307",
            "HUID": str(uuid4()),
        },
    ).json()


def get_location_data(route_name, direction, route_code, lang: str = "zh-tw"):
    data = {
        "routeName": route_name,
        "dir": direction,
        "lang": lang,
        "routeCode": route_code,
        "device": "web",
    }
    res = fetch_from_dsat("macauweb/routestation/location", "post", data)
    return res.json()


def update_one_route_data(route_name: str, direction: str, supabase: Client):
    route_data = get_route_data(route_name, direction)["data"]
    route_code = route_data["routeCode"]

    actual_stations_of_route = [
        sta["staCode"] for sta in route_data["routeInfo"]
    ]

    print(f"Updating stations of {route_name}, dir {direction}...")
    detailed_route_data = get_detailed_route_data(route_code, direction)[
        "data"
    ][0]

    values_to_upsert = list(
        {
            station["stationcode"]: {
                "name_zh": station["staname"],
                "code": station["stationcode"],
                "dsat_id": station["stacode"],
                "dsat_label": station["stalabel"],
                "image_url": station["stationurl"],
            }
            for station in detailed_route_data["routeinfo"]
        }.values()
    )
    supabase.from_("stations").upsert(
        values_to_upsert,
        on_conflict="dsat_id",
    ).execute()

    print(
        f"Updating origin and destination of {route_name}, dir {direction}..."
    )
    supabase.from_("route_info").update(
        {
            "origin": route_data["routeInfo"][0]["staCode"],
            "destination": route_data["routeInfo"][-1]["staCode"],
            "code": route_data["routeCode"],
            "stations": actual_stations_of_route,
        }
    ).eq("key", f"{route_name}_{direction}").execute()

    # print(f"Appending route to its stations {route_name}, dir {direction}...")
    # for station in tqdm(detailed_route_data["routeinfo"], leave=False):
    #     supabase.rpc(
    #         "append_routes",
    #         {
    #             "station_id": station["stationcode"],
    #             "route_name": f"{route_name}_{direction}",
    #         },
    #     ).execute()

    print(
        "Counting connection of non-existing previous stations of the route to the route..."
    )
    current_stations = (
        supabase.from_("stations")
        .select("*")
        .contains("routes", [f"{route_name}_{direction}"])
        .execute()
    )
    actual_stations_of_route_set = set(actual_stations_of_route)
    extra_stations = [
        sta
        for sta in current_stations.data
        if sta["code"] not in actual_stations_of_route_set
    ]
    key = f"{route_name}_{direction}"
    for i, station in enumerate(extra_stations):
        extra_stations[i]["routes"] = [
            route for route in station["routes"] if route != key
        ]
    if len(extra_stations) > 0:
        print(
            f"Removing {len(extra_stations)} connection(s) of non-existing previous stations of the route to the route..."
        )
        supabase.from_("stations").upsert(
            extra_stations, on_conflict="id"
        ).execute()

    print(f"Updating locations of stations of {route_name}, dir {direction}...")
    update_one_location_data(route_name, direction, route_code, supabase)


def update_one_location_data(
    route_name: str, direction: str, route_code: str, supabase: Client
):
    location_data = get_location_data(route_name, direction, route_code)["data"]
    for station in tqdm(location_data["stationInfoList"], leave=False):
        if station["stationCode"] in location_updated_stations:
            continue
        supabase.from_("stations").upsert(
            [
                {
                    "code": station["stationCode"],
                    "lat": float(station["latitude"]),
                    "lon": float(station["longitude"]),
                    "lane_name": (
                        station["laneName"] if "laneName" in station else None
                    ),
                }
            ],
            on_conflict="code",
        ).execute()
        location_updated_stations.add(station["stationCode"])


def update_route_data(route_list, supabase: Client):
    rows_to_add = []
    print("Generating data for update...")
    for route in route_list["routeList"]:
        company = "transmac" if route["color"].lower() == "blue" else "tcm"
        rows_to_add.append(
            {
                "company": company,
                "color": route["color"].lower(),
                "type": int(route["direction"]),
                "direction": 0,
                "change": route["routeChange"] == "1",
                "name": route["routeName"],
                "key": f"{route["routeName"]}_0",
            }
        )
        if route["direction"] == "0":
            rows_to_add.append(
                {
                    "company": company,
                    "color": route["color"].lower(),
                    "type": int(route["direction"]),
                    "direction": 1,
                    "change": route["routeChange"] == "1",
                    "name": route["routeName"],
                    "key": f"{route["routeName"]}_1",
                }
            )
    print("Updating route_info table...")
    supabase.from_("route_info").upsert(
        rows_to_add, on_conflict="key"
    ).execute()
    for row in rows_to_add:
        route_name = row["name"]
        direction = row["direction"]
        update_one_route_data(route_name, direction, supabase)


def main():
    """
    Fetches and updates the database with the latest data from the API.
    """
    load_dotenv()
    url: str | None = os.environ.get("SUPABASE_URL")
    key: str | None = os.environ.get("SUPABASE_KEY")
    if url is None or key is None:
        print("URL or KEY not found!")
        sys.exit(1)
    supabase: Client = create_client(url, key)

    print("Fetching route list...")
    route_list = get_route_list()["data"]
    update_route_data(route_list, supabase)


if __name__ == "__main__":
    main()
