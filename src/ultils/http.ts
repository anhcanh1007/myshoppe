import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import {
  clearAccessTokenFromLS,
  getAccessTokenToLS,
  setAccessTokenFromLS,
  setProfileToLS,
} from "./auth";
import { path } from "../constants/path";
import type { AuthResponse } from "../types/auth.type";

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
          response.config.url === path.login ||
          response.config.url === path.register
        ) {
          const data = response.data as AuthResponse;
          this.access_token = data.data.access_token;
          setAccessTokenFromLS(this.access_token);
          setProfileToLS(data.data.user);
        } else if (response.config.url === path.logout) {
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
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearAccessTokenFromLS();
        }
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;

export default http;
