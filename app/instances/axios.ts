import axios from "axios";

const APIInstance = axios.create({ baseURL: "/api", method: "POST" });

export default APIInstance;
