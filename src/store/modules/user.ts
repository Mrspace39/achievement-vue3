import { loginApi, logoutApi } from "@/api/auth";
import { getUserInfoApi } from "@/api/system/user";
import { resetRouter } from "@/router";
import { store } from "@/store";

import { LoginData } from "@/api/auth/types";
import { UserInfo } from "@/api/system/user/types";

export const useUserStore = defineStore("user", () => {
  const user: UserInfo = {
    roleId: "",
    perms: [],
  };

  /**
   * 登录
   *
   */
  function login(loginData: LoginData) {
    // Promiss 异步执行请求, resolve 成功, reject 失败
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then(({ data }) => {
          // 将获取到的data对象封装一个对象
          const { id, token } = data;
          // 将token存储在本地缓存中
          localStorage.setItem("accessToken", btoa(encodeURIComponent(token)));
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfoApi()
        .then(({ data }) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          Object.assign(user, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          localStorage.setItem("accessToken", "");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    return new Promise<void>((resolve) => {
      localStorage.setItem("accessToken", "");
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
