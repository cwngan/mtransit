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
  staIndex,
}: RouteListData & { mode?: "to" | "from"; staIndex?: number }) {
  const router = useRouter();
  return (
    <div
      className="flex cursor-pointer items-center overflow-hidden rounded-lg leading-none"
      onClick={() => {
        router.push(
          `/bus-route/${name}?dir=${direction}${staIndex !== undefined ? `&idx=${staIndex}` : ""}`,
        );
      }}
    >
      <div
        className={clsx(
          "flex min-h-full min-w-8 items-center justify-center p-2 font-bold leading-none",
          color.toLowerCase() === "orange" && "bg-tcm-orange",
          color.toLowerCase() === "blue" && "bg-transmac-blue",
        )}
      >
        <div className="text-white">{name}</div>
      </div>
      <div
        className={clsx(
          "flex h-full items-end p-2 leading-none",
          color.toLowerCase() === "orange" && "bg-tcm-brown text-white",
          color.toLowerCase() === "blue" && "bg-transmac-yellow",
        )}
      >
        {mode === "from" ? (
          <>
            <div className="mr-[1.5px] leading-none">{origin.sta_name}</div>
            <div className="text-xs leading-none">開出</div>
          </>
        ) : (
          <>
            <div className="mr-[1.5px] text-xs leading-none">往</div>
            <div className="leading-none">{destination.sta_name}</div>
          </>
        )}
      </div>
    </div>
  );
}
