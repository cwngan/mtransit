import { Button } from "@headlessui/react";
import clsx from "clsx";
import { useState, useCallback, useEffect, useActionState } from "react";
import StationInfoBlock from "./StationInfoBlock";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { StationsNearbyData } from "../types/data";
import { APIInstance } from "../instances/axios";

const getStationsNearby = async (data: {
  position: { latitude: number; longitude: number };
}) => {
  return new Promise<StationsNearbyData>((resolve, reject) => {
    APIInstance.request<StationsNearbyData>({
      url: "get-stations-nearby",
      data,
    }).then((res) => resolve(res.data));
  });
};

export default function StationsNearbyList() {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [gettingPosition, setGettingPosition] = useState<boolean>(false);
  const [stationsNearby, setStationsNearby] =
    useState<StationsNearbyData | null>(null);
  const [pending, setPending] = useState(false);
  const getPosition = useCallback(() => {
    if (window.navigator.geolocation) {
      setGettingPosition(true);
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition(position.coords);
          setGettingPosition(false);
        },
        (error) => console.log(error),
        {
          timeout: 5000,
        },
      );
    }
  }, []);
  useEffect(() => {
    if (!position?.latitude || !position?.longitude) return;
    setPending(true);
    getStationsNearby({
      position: { latitude: position.latitude, longitude: position.longitude },
    }).then((data) => {
      setStationsNearby(data);
      setPending(false);
    });
  }, [position]);

  useEffect(() => {
    if (!window?.localStorage) return;
    const dataString: string | null =
      window.localStorage.getItem("stationsNearby");
    if (dataString !== null) {
      const data = JSON.parse(dataString);
      setStationsNearby({ data, status: 200 });
    }
  }, []);

  useEffect(() => {
    if (!stationsNearby?.data) return;
    window.localStorage.setItem(
      "stationsNearby",
      JSON.stringify(stationsNearby.data),
    );
  }, [stationsNearby]);

  return (
    <div className="flex flex-col gap-3 p-3">
      <Button
        onClick={() => {
          getPosition();
        }}
        type="button"
        className={clsx(
          "rounded-lg p-3 leading-none text-white shadow-inner",
          "bg-gray-600 data-[active]:bg-gray-700",
          "disabled:opacity-50",
        )}
        disabled={gettingPosition || pending}
      >
        {gettingPosition
          ? "定位中..."
          : !stationsNearby?.data
            ? "尋找附近站點"
            : "更新附近站點"}
      </Button>
      {stationsNearby?.data ? (
        <div className="flex flex-col gap-3">
          {pending ? (
            <LoadingPlaceholder lines={5} lineHeight="3.5rem" gap="0" />
          ) : stationsNearby?.data ? (
            stationsNearby.data.map((station) => {
              return (
                <StationInfoBlock
                  staCode={station.code}
                  key={station.id}
                  fromTab={0}
                />
              );
            })
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
