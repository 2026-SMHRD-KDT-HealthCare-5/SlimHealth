import client from "./axios";

const healthBasePath = "/api/health";
const ocrBasePath = "/api/ocr";

//건강 데이터 저장 api
export const saveHealthDataApi = async (body) => {
  let result;
  if (body.id) {
    result = await client.post(`${healthBasePath}/update/${body.id}`, body);
  } else {
    result = await client.post(`${healthBasePath}/create`, body);
  }
  return result.data;
};

//건강 데이터 가져오기 및 예측 api
export const getHealthDataApi = async (id) => {
  const result = await client.get(`${healthBasePath}/predict/${id}`, {});
  return result.data;
};

//건강 조언 생성 api
export const getHealthAdviceApi = async (id) => {
  const result = await client.get(`${healthBasePath}/advice/${id}`, {});
  return result.data;
};

//ocr 데이터 입력 api
export const ocrInputApi = async (files) => {
  const formData = new FormData();
  files.map((file) => {
    formData.append("files", file);
  });
  const result = await client.post(`${ocrBasePath}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
};

//건강 데이터 저장 내역 조회 api
export const getHealthDataHistories = async (page) => {
  const result = await client.post(`${healthBasePath}/list`, { page });
  return result.data;
};

export const deleteDataHistory = async (id) => {
  const result = await client.delete(`${healthBasePath}/delete/${id}`, {});
  return result.data;
};
