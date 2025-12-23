import { Button } from "@headlessui/react";
import clsx from "clsx";
import {
  useState,
  useCallback,
  useEffect,
  useActionState,
  SetStateAction,
  Dispatch,
  useContext,
} from "react";
import StationInfoBlock from "./StationInfoBlock";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { Station, StationsNearbyData } from "../types/data";
import { APIInstance } from "../instances/axios";
import CurrentTabContext from "../store/CurrentTabContext";

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

interface StationsNearbyListProps {
  location: { latitude: number; longitude: number } | null;
  stationsNearby: StationsNearbyData | null;
  setStationsNearby: Dispatch<SetStateAction<StationsNearbyData | null>>;
  updateStations: Dispatch<
    | {
        type: "nearby";
        payload: StationsNearbyData;
      }
    | {
        type: "favorite";
        payload: Station[];
      }
  >;
}

export default function StationsNearbyList({
  location,
  stationsNearby,
  setStationsNearby,
  updateStations,
}: StationsNearbyListProps) {
  const [pending, setPending] = useState(false);
  const currentTab = useContext(CurrentTabContext);

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;
    if (currentTab !== 0) return;
    setPending(true);
    getStationsNearby({
      position: { latitude: location.latitude, longitude: location.longitude },
    }).then((data) => {
      setStationsNearby(data);
      setPending(false);
      updateStations({ type: "nearby", payload: data });
    });
  }, [currentTab, location, setStationsNearby, updateStations]);

  useEffect(() => {
    if (!window?.localStorage) return;
    const dataString: string | null =
      window.localStorage.getItem("stationsNearby");
    if (dataString !== null) {
      const data = JSON.parse(dataString);
      setStationsNearby({ data, status: 200 });
      setPending(false);
    }
  }, [setStationsNearby]);

  useEffect(() => {
    if (!stationsNearby?.data) return;
    window.localStorage.setItem(
      "stationsNearby",
      JSON.stringify(stationsNearby.data),
    );
  }, [stationsNearby]);

  return (
    <div className="h-full overflow-hidden rounded-md">
      <div className="flex h-full flex-col gap-3 overflow-auto">
        <div className="flex flex-col gap-3">
          {pending ? (
            <LoadingPlaceholder lines={5} lineHeight="7.5rem" gap="0" />
          ) : stationsNearby?.data ? (
            stationsNearby.data.map((station) => {
              return (
                <StationInfoBlock
                  staCode={station.code}
                  key={station.id}
                  fromTab={0}
                  distance={station.distance}
                />
              );
            })
          ) : null}
        </div>
      </div>
    </div>
  );
}
