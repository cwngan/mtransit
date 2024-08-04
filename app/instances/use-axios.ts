import { makeUseAxios } from "axios-hooks";
import APIInstance from "./axios";

const useAxios = makeUseAxios({
  cache: false,
  axios: APIInstance,
  defaultOptions: { manual: true },
});

export default useAxios;
