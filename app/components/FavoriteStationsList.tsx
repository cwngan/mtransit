import { useState, useCallback, useEffect, useActionState } from "react";
import StationInfoBlock from "./StationInfoBlock";

export default function FavoriteStationsList() {
  const [favoriteStations, setFavoriteStations] = useState<string[] | null>(
    null,
  );

  const unsetFavorite = useCallback((code: string) => {
    setFavoriteStations((prev) => {
      if (prev === null) return null;
      const idx = prev.findIndex((s) => s == code);
      if (idx === -1) return prev;
      prev.splice(idx);
      return [...prev];
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
    <div className="flex flex-col gap-3 p-3">
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
  );
}
