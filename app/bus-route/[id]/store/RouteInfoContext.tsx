import { createContext } from "react";

const RouteInfoContext = createContext<{
  routeCode?: string;
  routeType?: string;
  routeName?: string;
  dir?: string;
  busColor?: string;
}>({});
export default RouteInfoContext;
