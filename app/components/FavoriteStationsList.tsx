import { useState, useCallback, useEffect, Dispatch, useContext } from "react";
import StationInfoBlock from "./StationInfoBlock";
import { Station, StationsNearbyData } from "../types/data";
import CurrentTabContext from "../store/CurrentTabContext";
import { APIInstance } from "../instances/axios";

interface FavoriteStationsListProps {
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

export default function FavoriteStationsList({
  updateStations,
}: FavoriteStationsListProps) {
  const currentTab = useContext(CurrentTabContext);
  const [favoriteStations, setFavoriteStations] = useState<string[] | null>(
    null,
  );

  useEffect(() => {
    if (currentTab === 1 && favoriteStations !== null) {
      APIInstance.request<{ code: string; lat: number; lon: number }[]>({
        url: "get-station-location",
        data: { codes: favoriteStations },
      }).then((res) => {
        if (!res.data) return;
        console.log(res.data);
        updateStations({
          type: "favorite",
          payload: res.data.map(({ code, lat, lon }) => {
            return { code, latitude: lat || 0, longitude: lon || 0 };
          }),
        });
      });
    }
  }, [currentTab, updateStations, favoriteStations]);

  const unsetFavorite = useCallback((code: string) => {
    setFavoriteStations((prev) => {
      if (prev === null) return null;
      const arr = [...prev];
      const idx = arr.findIndex((s) => s === code);
      if (idx === -1) return arr;
      arr.splice(idx, 1);
      return arr;
    });
  }, []);

  useEffect(() => {
    if (!window?.localStorage) return;
    const dataString: string | null =
      window.localStorage.getItem("favoriteStations");
    if (dataString !== null) {
      const data = JSON.parse(dataString);
      setFavoriteStations(data);
    } else {
      setFavoriteStations([]);
    }
  }, []);

  useEffect(() => {
    if (favoriteStations === null) return;
    window.localStorage.setItem(
      "favoriteStations",
      JSON.stringify(favoriteStations),
    );
  }, [favoriteStations]);

  return (
    <div className="h-full overflow-hidden rounded-md">
      <div className="flex h-full flex-col gap-3 overflow-auto">
        {favoriteStations ? (
          <div className="flex flex-col gap-3">
            {favoriteStations.length > 0 ? (
              favoriteStations.map((station) => {
                return (
                  <StationInfoBlock
                    staCode={station}
                    key={station}
                    fromTab={1}
                    unsetFavorite={unsetFavorite}
                  />
                );
              })
            ) : (
              <div className="text-white">無喜愛車站</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
