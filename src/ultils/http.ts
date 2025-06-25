import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import {
  clearAccessTokenFromLS,
  getAccessTokenToLS,
  setAccessTokenFromLS,
} from "./auth";

class Http {
  instance: AxiosInstance;
  private access_token: string;
  constructor() {
    this.access_token = getAccessTokenToLS();
    this.instance = axios.create({
      baseURL: "https://api-ecom.duthanhduoc.com/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.access_token && config.headers) {
          config.headers.authorization = this.access_token;
          return config;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        if (
          response.config.url === "/login" ||
          response.config.url === "/register"
        ) {
          this.access_token = response.data.data.access_token;
          setAccessTokenFromLS(this.access_token);
        } else if (response.config.url === "/logout") {
          this.access_token = "";
          clearAccessTokenFromLS();
        }
        return response;
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data.message || error.message;
          toast.error(message);
        }
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;

export default http;
