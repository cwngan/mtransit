import { Button } from "@headlessui/react";
import clsx from "clsx";
import { useState, useCallback, useEffect, useActionState } from "react";
import StationInfoBlock from "./StationInfoBlock";
import _getNearestStations from "../actions/get-nearest-stations";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { useFormState } from "react-dom";

export default function NearbyStationInfoList() {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [gettingPosition, setGettingPosition] = useState<boolean>(false);
  const [nearestStations, getNearestStations, pending] = useFormState(
    _getNearestStations,
    null,
  );
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
    getNearestStations({
      position: { latitude: position.latitude, longitude: position.longitude },
    });
  }, [getNearestStations, position]);
  return (
    <div className="flex flex-col gap-3 p-3">
      {!position ? (
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
          disabled={gettingPosition}
        >
          {gettingPosition ? "定位中..." : "尋找附近站點"}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          {pending ? (
            <LoadingPlaceholder />
          ) : nearestStations?.data ? (
            nearestStations.data.map((station) => {
              return (
                <StationInfoBlock staCode={station.code} key={station.id} />
              );
            })
          ) : null}
        </div>
      )}
    </div>
  );
}
