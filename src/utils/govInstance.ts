import axios from "axios";
import { govKey, govUrl } from "../constants";
const instance = axios.create({ baseURL: govUrl, params: { Key: govKey } });

export default instance;
