import axios from "axios";

const DSATInstance = axios.create({
  method: "POST",
  baseURL: process.env.DSAT_BASE,
});

export default DSATInstance;
