import { Button } from "@headlessui/react";
import clsx from "clsx";
import { useState, useCallback, useEffect, useActionState } from "react";
import StationInfoBlock from "./StationInfoBlock";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { NearestStationsData } from "../types/data";
import { APIInstance } from "../instances/axios";

const getNearestStations = async (data: {
  position: { latitude: number; longitude: number };
}) => {
  return new Promise<NearestStationsData>((resolve, reject) => {
    APIInstance.request<NearestStationsData>({
      url: "get-nearest-stations",
      data,
    }).then((res) => resolve(res.data));
  });
};

export default function NearbyStationInfoList() {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [gettingPosition, setGettingPosition] = useState<boolean>(false);
  const [nearestStations, setNearestStations] =
    useState<NearestStationsData | null>(null);
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
    getNearestStations({
      position: { latitude: position.latitude, longitude: position.longitude },
    }).then((data) => {
      setNearestStations(data);
      setPending(false);
    });
  }, [position]);
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
          : !position
            ? "尋找附近站點"
            : "更新附近站點"}
      </Button>
      {position ? (
        <div className="flex flex-col gap-3">
          {pending ? (
            <LoadingPlaceholder lines={5} lineHeight="3.5rem" gap="0" />
          ) : nearestStations?.data ? (
            nearestStations.data.map((station) => {
              return (
                <StationInfoBlock staCode={station.code} key={station.id} />
              );
            })
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
