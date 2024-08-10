"use server";

import DSATInstance from "../instance";

export default async function getCapactiy({
  routeName,
  dir,
}: {
  routeName: string;
  dir: string;
}) {
  const reqParams = {
    device: "web",
    routeName,
    dir,
  };
  const result = await DSATInstance.request({
    method: "GET",
    url: "ddbus/common/station/capacity",
    params: reqParams,
  });
  return result.data;
}
