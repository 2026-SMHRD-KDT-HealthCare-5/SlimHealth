import client, { loginClient } from "./axios";

const userBasePath = "/api/user";
export const authBasePath = "/api/auth";

//아이디 중복확인 api
export const checkDuplicateAccountApi = async (account) => {
  const result = await loginClient.post(`${userBasePath}/check`, { account });
  return result.data;
};

//회원가입 api
export const joinApi = async (body) => {
  const result = await loginClient.post(`${userBasePath}/create`, body);
  return result.data;
};

//로그인 api
export const loginApi = async (body) => {
  const result = await loginClient.post(`${authBasePath}/login`, body);
  return result.data;
};
