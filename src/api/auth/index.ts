import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", btoa(encodeURIComponent(data.password)));
  return request({
    url: "/api/user/login",
    method: "post",
    data: formData,
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/api/user/logout",
    method: "delete",
  });
}
