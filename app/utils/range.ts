export default function range(start: number, end: number) {
  let a = [];
  for (let i = start; i < end; i++) a.push(i);
  return [...a];
}
