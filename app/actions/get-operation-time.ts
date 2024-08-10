"use server";

import DSATInstance from "../instance";

export async function getOperationTime({
  routeName,
  dir,
}: {
  routeName: string;
  dir: string;
}) {
  const data = new URLSearchParams({
    action: "opstime",
    routeName,
    dir,
    lang: "zh_tw",
    BypassToken: "HuatuTesting0307",
  });
  const result = await DSATInstance.request({
    url: "ddbus/route/operationtime",
    data,
  });
  return result.data;
}
