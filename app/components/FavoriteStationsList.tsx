import { useState, useCallback, useEffect, useActionState } from "react";
import StationInfoBlock from "./StationInfoBlock";

export default function FavoriteStationsList() {
  const [favoriteStations, setFavoriteStations] = useState<string[] | null>(
    null,
  );

  useEffect(() => {
    if (!window?.localStorage) return;
    const dataString: string | null =
      window.localStorage.getItem("favoriteStations");
    if (dataString !== null) {
      const data = JSON.parse(dataString);
      console.log(data);
      setFavoriteStations(data);
    } else {
      setFavoriteStations([]);
    }
  }, []);

  useEffect(() => {
    if (!favoriteStations) return;
    window.localStorage.setItem(
      "favoriteStations",
      JSON.stringify(favoriteStations),
    );
  }, [favoriteStations]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {favoriteStations ? (
        <div className="flex flex-col gap-3">
          {favoriteStations.length > 0 ? (
            favoriteStations.map((station) => {
              return (
                <StationInfoBlock staCode={station} key={station} fromTab={1} />
              );
            })
          ) : (
            <div className="text-white">無喜愛車站</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
