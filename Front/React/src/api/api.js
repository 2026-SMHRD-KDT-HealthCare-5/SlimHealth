import client from "./axios";

//여기는 프로젝트에 사용되는 api를 모아놓는 곳입니다
//api분류별로 다른 파일에 놓아야 하기 때문에 파일명을 맞는 분류로 바꿔주시기 바랍니다.

//api 함수 예시

export const getApiExample = (param1, param2) => {
  return client.get(
    "/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
    {
      params: {
        param1,
        param2,
        key: "e692e7235c36a33ee8dcfcd905d6a222",
        targetDt: "20260414",
      },
    },
  );
};

export const postApiExample = (param1, param2) => {
  return client.post("/postApiExample", { param1, param2 });
};
