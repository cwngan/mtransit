import { HomeIcon } from "@heroicons/react/24/outline";
import OperationTime from "./OperationTime";
import { forwardRef, RefObject, useContext } from "react";
import RouteInfoContext from "../store/RouteInfoContext";

interface HeaderProps {
  routeName: string;
  from: string | undefined;
  to: string | undefined;
  dir: 0 | 1 | 2;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(function Header(
  { routeName, from, to, dir },
  ref,
) {
  const routeInfo = useContext(RouteInfoContext);
  return (
    <div className="fixed z-50 w-full" ref={ref}>
      <div
        className={`${routeInfo?.busColor === "Orange" ? "bg-tcm-orange" : routeInfo?.busColor === "Blue" ? "bg-transmac-yellow" : ""} grid grid-cols-12 items-center gap-2 p-2`}
      >
        <div>
          <HomeIcon
            className={`${routeInfo?.busColor === "Orange" ? "stroke-tcm-brown" : routeInfo?.busColor === "Blue" ? "stroke-transmac-blue" : ""}`}
          />
        </div>
        <div className="col-span-10 grid grid-cols-11 items-center justify-start gap-2">
          <div
            className={`col-span-2 ${routeInfo?.busColor === "Orange" ? "bg-tcm-brown" : routeInfo?.busColor === "Blue" ? "bg-transmac-blue" : ""} rounded-lg text-center font-bold`}
          >
            <div
              className={`${!routeInfo?.busColor ? "text-black" : "text-white"}`}
            >
              {routeName}
            </div>
          </div>
          <div className="col-span-9">
            <div className="flex w-fit max-w-full items-center gap-1 rounded-lg bg-white px-2">
              <div className="whitespace-nowrap">
                {from ? from : "Loading..."}
              </div>
              <div className="col-span-1">⇨</div>
              <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {to ? to : "Loading..."}
              </div>
            </div>
          </div>
        </div>
      </div>
      <OperationTime routeName={routeName} dir={dir} />
    </div>
  );
});

export default Header;
