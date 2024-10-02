import { useCallback, useContext, useEffect, useState } from "react";
import LoadingPlaceholder from "./LoadingPlaceholder";
import RouteBlock from "./RouteBlock";
import CurrentTabContext from "../store/CurrentTabContext";
import { APIInstance } from "../instances/axios";
import { StationInfoData } from "../types/data";

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
}
export default function StationInfoBlock({
  staCode,
  fromTab,
  staName,
}: StationInfoBlock) {
  const [stationInfo, setStationInfo] = useState<StationInfoData | null>(null);
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
  }, [updateData, currentTab]);
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
      <div className="flex items-end gap-2">
        <div className="text-xl leading-none">
          {staName || stationInfo?.data?.station?.name_zh || (
            <LoadingPlaceholder blocks={1} width="6rem" lineHeight="1.5rem" />
          )}
        </div>
        <div className="rounded bg-gray-200 p-1 text-xs leading-none text-gray-600">
          {staCode}
        </div>
      </div>
      {stationInfo ? (
        <div className="flex flex-col gap-2">
          {stationInfo.data
            ? stationInfo.data.routes.map((route) => {
                if (!route || !route.code) return;
                const { key, ...rest } = route;
                return (
                  <div key={key} className="flex items-center justify-between">
                    {/** @ts-ignore */}
                    <RouteBlock {...rest} mode="to" />
                    {route.busInfo[0] ? (
                      <div className="flex gap-1 text-sm">
                        <div className="ml-2 flex items-end font-mono leading-none">
                          <div className="text-lg leading-none">
                            {route.busInfo[0].staRemaining === 0
                              ? "到站"
                              : route.busInfo[0].staRemaining}
                          </div>
                          {route.busInfo[0].staRemaining !== 0 ? (
                            <div>站</div>
                          ) : null}
                        </div>
                        <div className="flex items-end font-mono leading-none">
                          {route.busInfo[0].distance > 0.95 ? (
                            <>
                              <span className="text-lg leading-none">
                                {Math.round(route.busInfo[0].distance * 10) /
                                  10}
                              </span>
                              <span>km</span>
                            </>
                          ) : route.busInfo[0].distance > 0 ? (
                            <>
                              <span className="text-lg leading-none">
                                {Math.ceil(route.busInfo[0].distance * 20) * 50}
                              </span>
                              <span>m</span>
                            </>
                          ) : route.busInfo[0].staRemaining > 0 ? (
                            <>
                              <span className="text-lg leading-none">0</span>
                              <span>m</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg">未發車</div>
                    )}
                  </div>
                );
              })
            : null}
        </div>
      ) : null}
    </div>
  );
}
