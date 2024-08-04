import axios from "axios";

const APIInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  method: "POST",
});

export default APIInstance;
