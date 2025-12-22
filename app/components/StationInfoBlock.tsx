import { useCallback, useContext, useEffect, useState } from "react";
import LoadingPlaceholder from "./LoadingPlaceholder";
import RouteBlock from "./RouteBlock";
import CurrentTabContext from "../store/CurrentTabContext";
import { APIInstance } from "../instances/axios";
import { StationInfoData } from "../types/data";
import {
  ChevronDoubleRightIcon,
  StarIcon as SolidStarIcon,
} from "@heroicons/react/20/solid";

const getStationInfo = async (data: { staCode: string }) => {
  return new Promise<StationInfoData>((resolve, reject) => {
    APIInstance.request({
      url: "get-station-info",
      data,
    }).then((res) => resolve(res.data));
  });
};

interface StationInfoBlock {
  staCode: string;
  fromTab: number;
  staName?: string;
  distance?: number;
  laneName?: string;
  unsetFavorite?: (code: string) => void;
}
export default function StationInfoBlock({
  staCode,
  fromTab,
  staName,
  distance,
  laneName,
  unsetFavorite,
}: StationInfoBlock) {
  const [stationInfo, setStationInfo] = useState<StationInfoData | null>(null);
  const [showNotOperatingRoutes, setShowNotOperatingRoutes] =
    useState<boolean>(false);
  const currentTab = useContext(CurrentTabContext);
  const updateData = useCallback(() => {
    getStationInfo({ staCode }).then((data) => {
      setStationInfo(data);
    });
  }, [staCode]);
  useEffect(() => {
    if (currentTab !== fromTab) return;
    updateData();
    const n = window.setInterval(updateData, 15000);
    return () => {
      window.clearInterval(n);
    };
  }, [updateData, currentTab, fromTab]);
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
      <div className="flex items-end gap-2">
        <div className="text-xl leading-none">
          {staName || stationInfo?.data?.station?.name_zh || (
            <LoadingPlaceholder blocks={1} width="6rem" lineHeight="1.5rem" />
          )}
        </div>
        {(laneName || stationInfo?.data?.station?.lane_name) && (
          <div className="rounded bg-gray-200 p-1 text-xs leading-none text-gray-600">
            {laneName || stationInfo?.data?.station?.lane_name}
          </div>
        )}
        <div className="rounded bg-gray-200 p-1 text-xs leading-none text-gray-600">
          {staCode}
        </div>
        {unsetFavorite && (
          <SolidStarIcon
            className="ml-auto h-6 text-yellow-500"
            onClick={() => {
              unsetFavorite(staCode);
            }}
          />
        )}
        {distance !== undefined && (
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <ChevronDoubleRightIcon className="h-4 w-4" />
            {distance > 0.95 ? (
              <>
                <span>{Math.round(distance * 10) / 10}</span>
                <span>km</span>
              </>
            ) : distance > 0 ? (
              <>
                <span>{Math.floor(distance * 200) * 5}</span>
                <span>m</span>
              </>
            ) : null}
          </div>
        )}
      </div>
      {stationInfo ? (
        <div className="flex flex-col gap-2">
          {stationInfo.data ? (
            <>
              {stationInfo.data.routes.map((route) => {
                if (
                  !route ||
                  !route.code ||
                  (!showNotOperatingRoutes && !route.busInfo.operating)
                )
                  return;
                const { key, ...rest } = route;
                return (
                  <div key={key} className="flex items-center justify-between">
                    {/** @ts-ignore */}
                    <RouteBlock {...rest} mode="to" />
                    {route.busInfo.staRemaining >= 999 ? (
                      route.busInfo.operating ? (
                        <div className="text-lg">未出發</div>
                      ) : (
                        <div className="text-sm text-gray-500">服務時間外</div>
                      )
                    ) : (
                      <div className="flex gap-1 text-sm">
                        <div className="mb-px ml-2 flex items-end font-mono leading-none">
                          <div className="leading-none">
                            {route.busInfo.staRemaining === 0 ? (
                              <span className="text-lg">到站</span>
                            ) : (
                              route.busInfo.staRemaining
                            )}
                          </div>
                          {route.busInfo.staRemaining !== 0 ? (
                            <div>站</div>
                          ) : null}
                        </div>
                        <div className="flex items-end font-mono leading-none">
                          {route.busInfo.distance > 0.95 ? (
                            <>
                              <span className="text-lg leading-none">
                                {Math.round(route.busInfo.distance * 10) / 10}
                              </span>
                              <span>km</span>
                            </>
                          ) : route.busInfo.distance > 0 ? (
                            <>
                              <span className="text-lg leading-none">
                                {Math.ceil(route.busInfo.distance * 20) * 50}
                              </span>
                              <span>m</span>
                            </>
                          ) : route.busInfo.staRemaining > 0 ? (
                            <>
                              <span className="text-lg leading-none">0</span>
                              <span>m</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {stationInfo.data.routes.filter((r) => r && !r.busInfo.operating)
                .length > 0 &&
                !showNotOperatingRoutes && (
                  <div className="flex w-full justify-center">
                    <div
                      className="cursor-pointer text-sm text-gray-500 underline underline-offset-2"
                      onClick={() => setShowNotOperatingRoutes(true)}
                    >
                      顯示服務時間外路線
                    </div>
                  </div>
                )}
            </>
          ) : null}
        </div>
      ) : (
        <LoadingPlaceholder blocks={3} random gap="0" />
      )}
    </div>
  );
}
