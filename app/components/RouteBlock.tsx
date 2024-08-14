import { useRouter } from "next/navigation";
import { RouteListData } from "../types/route-list";
import clsx from "clsx";

export default function RouteBlock({
  name,
  direction,
  color,
  origin,
  destination,
  mode = "from",
}: RouteListData & { mode?: "to" | "from" }) {
  const router = useRouter();
  return (
    <div
      className="flex cursor-pointer items-center overflow-hidden rounded-lg leading-none"
      onClick={() => {
        router.push(`/bus-route/${name}?dir=${direction}`);
      }}
    >
      <div
        className={clsx(
          "flex min-h-full min-w-8 items-center justify-center p-2 font-bold",
          color === "Orange"
            ? "bg-tcm-orange"
            : color === "Blue"
              ? "bg-transmac-blue"
              : "",
        )}
      >
        <div className="text-white">{name}</div>
      </div>
      <div
        className={clsx(
          "flex h-full items-end p-2 leading-none",
          color === "Orange"
            ? "bg-tcm-brown text-white"
            : color === "Blue"
              ? "bg-transmac-yellow"
              : "",
        )}
      >
        {mode === "from" ? (
          <>
            <div className="mr-1 leading-none">{origin.sta_name}</div>
            <div className="text-xs leading-none">開出</div>
          </>
        ) : (
          <>
            <div className="mr-1 text-xs leading-none">往</div>
            <div className="leading-none">{destination.sta_name}</div>
          </>
        )}
        {/* {type === 2 ? (
                      <div className="mx-1">↺</div>
                    ) : (
                      <div className="mx-1">⇨</div>
                    )} */}
      </div>
    </div>
  );
}
