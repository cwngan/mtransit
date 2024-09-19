"use client";
import SearchBar from "./components/SearchBar";
import NearbyStationInfoList from "./components/NearbyStationInfoList";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import CurrentTabContext from "./store/CurrentTabContext";

export default function Page() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  return (
    <CurrentTabContext.Provider value={currentTab}>
      <div className="container mx-auto flex h-full max-h-full flex-col">
        <SearchBar />
        <div className={clsx("grid w-full grid-cols-2")}>
          <div
            className={clsx(
              "rounded-t-xl p-4 pb-2 text-center leading-none",
              currentTab === 0
                ? "bg-cyan-600 text-white"
                : "bg-white text-black",
            )}
            onClick={() => {
              setCurrentTab(0);
            }}
          >
            附近站點
          </div>
          <div
            className={clsx(
              "rounded-t-xl p-4 pb-2 text-center leading-none",
              currentTab === 1
                ? "bg-orange-600 text-white"
                : "bg-white text-black",
            )}
            onClick={() => {
              setCurrentTab(1);
            }}
          >
            收藏站點
          </div>
        </div>
        <div className="flex-grow">
          <div
            className={clsx(
              currentTab === 0 ? "block" : "hidden",
              "h-full rounded-tr-xl bg-cyan-600",
            )}
          >
            <NearbyStationInfoList />
          </div>
          <div className={clsx(currentTab === 1 ? "block" : "hidden")}>hi</div>
        </div>
      </div>
    </CurrentTabContext.Provider>
  );
}
