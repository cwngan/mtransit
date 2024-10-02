import axios from "axios";
import axiosRetry from "axios-retry";

const APIInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  method: "POST",
});

// APIInstance.interceptors.response.use(undefined, (error) => {});

const DSATInstance = axios.create({
  method: "POST",
  baseURL: process.env.DSAT_BASE,
  headers: {
    Origin: "https://bis.dsat.gov.mo:37812",
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    "X-Requested-With": "XMLHttpRequest",
  },
});
DSATInstance.defaults.timeout = 750;
axiosRetry(DSATInstance, {
  retries: 10,
  shouldResetTimeout: true,
  retryCondition: (_error) => true,
});
export { APIInstance, DSATInstance };
