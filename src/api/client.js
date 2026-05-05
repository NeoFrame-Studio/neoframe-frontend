export default client;

import axios from "axios";

export const client = axios.create({
  baseURL: "https://neoframe-backend-production.up.railway.app/"
});