import range from "../utils/range";

interface LoadingPlaceholderProps {
  lines?: number;
  width?: string;
  lineHeight?: string;
  gap?: string;
  random?: boolean;
}
export default function LoadingPlaceholder({
  lines = 1,
  width,
  lineHeight = "1.5em",
  gap = "0.5rem",
  random = false,
}: LoadingPlaceholderProps) {
  return (
    <>
      {range(0, lines).map((a, i) => {
        return (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-gray-200"
            style={{
              width: width
                ? width
                : random
                  ? `${50 * Math.random() + 50}%`
                  : "100%",
              height: lineHeight,
              marginBottom: i < lines - 1 ? gap : "0",
            }}
          ></div>
        );
      })}
    </>
  );
}
