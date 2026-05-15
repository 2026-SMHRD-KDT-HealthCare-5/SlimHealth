import client from "./axios";

//아이디 중복확인 api
export const checkDuplicateAccountApi = (account) => {
  return new Promise((resolve) => {
    resolve({ isDuplicate: account === "bcy" });
  });
};

//회원가입 api
export const joinApi = (body) => {
  return new Promise((resolve) => {
    resolve("회원가입 성공!");
  });
};

//로그인 api
export const loginApi = (body) => {
  return new Promise((resolve) => {
    const { account, password } = body;
    if (account === "bcy" && password === "bcy1111") {
      resolve({
        message: "로그인 성공",
        result: true,
        userInfo: { userId: "1" },
      });
    } else {
      resolve({
        message: "아이디 또는 비밀번호를 확인해주세요.",
        result: false,
      });
    }
  });
};
