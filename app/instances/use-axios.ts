import { makeUseAxios } from "axios-hooks";
import APIInstance from "./axios";

const useAxios = makeUseAxios({
  cache: false,
  axios: APIInstance,
  defaultOptions: { manual: true, autoCancel: true },
});

export default useAxios;
