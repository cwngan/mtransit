import range from "../utils/range";

interface LoadingPlaceholderProps {
  lines?: number;
  width?: string;
  lineHeight?: string;
  gap?: string;
}
export default function LoadingPlaceholder({
  lines = 1,
  width,
  lineHeight = "1.5em",
  gap = "0.5rem",
}: LoadingPlaceholderProps) {
  return (
    <>
      {range(0, lines).map((a, i) => {
        return (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-gray-200"
            style={{
              width: width ? width : "100%",
              height: lineHeight,
              marginBottom: i < lines - 1 ? gap : "0",
            }}
          ></div>
        );
      })}
    </>
  );
}
