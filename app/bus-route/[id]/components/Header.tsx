import { ArrowsRightLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import OperationTime from "./OperationTime";
import { forwardRef, useContext } from "react";
import RouteInfoContext from "../store/RouteInfoContext";
import { useRouter } from "next/navigation";
import LoadingPlaceholder from "@/app/components/LoadingPlaceholder";
import clsx from "clsx";

interface HeaderProps {
  routeName: string;
  from: string | undefined;
  to: string | undefined;
  dir: string;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(function Header(
  { routeName, from, to, dir },
  ref,
) {
  const router = useRouter();
  const routeInfo = useContext(RouteInfoContext);
  return (
    <div className="fixed z-50 w-full" ref={ref}>
      <div
        className={clsx(
          `${routeInfo?.busColor === "Orange" ? "bg-tcm-orange" : routeInfo?.busColor === "Blue" ? "bg-transmac-yellow" : ""}`,
          "grid grid-cols-12 items-center gap-2 p-2",
        )}
      >
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex cursor-pointer justify-center"
        >
          <HomeIcon
            className={clsx(
              "h-6 w-6",
              routeInfo?.busColor === "Orange"
                ? "stroke-tcm-brown"
                : routeInfo?.busColor === "Blue"
                  ? "stroke-transmac-blue"
                  : "",
            )}
          />
        </div>
        <div className="col-span-10 grid grid-cols-11 items-center justify-start gap-2">
          <div
            className={clsx(
              "col-span-2 rounded-lg text-center font-bold",
              routeInfo?.busColor === "Orange"
                ? "bg-tcm-brown"
                : routeInfo?.busColor === "Blue"
                  ? "bg-transmac-blue"
                  : "",
            )}
          >
            <div
              className={`${!routeInfo?.busColor ? "text-black" : "text-white"}`}
            >
              {routeName}
            </div>
          </div>
          <div className="col-span-9">
            {from && to ? (
              <div className="flex w-fit max-w-full items-center gap-1 rounded-lg bg-white px-2">
                <div className="whitespace-nowrap">{from}</div>
                <div className="col-span-1">⇨</div>
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {to}
                </div>
              </div>
            ) : (
              <LoadingPlaceholder />
            )}
          </div>
        </div>
        {routeInfo?.routeType === "0" ? (
          <div className="flex cursor-pointer justify-center">
            <ArrowsRightLeftIcon
              className="h-6 w-6 stroke-white"
              onClick={() => {
                router.push(`?dir=${dir === "0" ? "1" : "0"}`);
              }}
            />
          </div>
        ) : null}
      </div>
      <OperationTime routeName={routeName} dir={dir} />
    </div>
  );
});

export default Header;
