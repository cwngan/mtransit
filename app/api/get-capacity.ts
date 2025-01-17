import { DSATInstance } from "../instances/axios";
import getRequestToken from "../utils/getRequestToken";

export default async function getCapactiy(params: {
  routeName: string;
  dir: string;
}) {
  const {
    routeName,
    dir,
  }: {
    routeName: string;
    dir: string;
  } = params;
  const reqParams = {
    device: "web",
    routeName,
    dir,
  };
  const result = await DSATInstance.request({
    url: "macauweb/routestation/bus",
    data: reqParams,
    headers: {
      token: getRequestToken("macauweb/routestation/bus", reqParams),
    },
  });
  return result.data;
}
