import { DSATInstance } from "../instances/axios";
import getRequestToken from "../utils/getRequestToken";

export default async function getOperationTime(params: {
  routeName: string;
  dir: string;
}) {
  const { routeName, dir } = params;
  const data = {
    action: "opstime",
    routeName,
    dir: routeName === "25B" ? "0" : dir,
    lang: "zh_tw",
    BypassToken: "HuatuTesting0307",
  };
  const result = await DSATInstance.request({
    url: "ddbus/route/operationtime",
    data: new URLSearchParams(data),
    headers: {
      token: getRequestToken("ddbus/route/operationtime", data),
    },
  });
  // console.log(data);
  return result.data;
}
