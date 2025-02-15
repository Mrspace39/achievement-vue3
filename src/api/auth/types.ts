/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  /**
   * userid
   */
  id: string;
  /**
   * 访问token
   */
  token: string;
}
