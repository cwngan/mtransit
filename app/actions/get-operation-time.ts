"use server";

import DSATInstance from "../instance";
import getRequestToken from "../utils/getRequestToken";

export async function getOperationTime({
  routeName,
  dir,
}: {
  routeName: string;
  dir: string;
}) {
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
