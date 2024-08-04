import { createContext, ReactNode } from "react";

const RouteInfoContext = createContext<
  | { routeCode?: string; routeName: string; dir: string; busColor?: string }
  | undefined
>(undefined);
export default RouteInfoContext;
