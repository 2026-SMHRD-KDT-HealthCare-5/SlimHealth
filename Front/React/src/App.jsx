import React, { useContext } from "react";
import Main from "./pages/Main";
import { Route, Routes } from "react-router-dom";
import ContextProvider from "./provider/ContextProvider";
import { Dialog } from "./components/Dialog";
import Context from "./context/context";
import Login from "./pages/Login";
import Join from "./pages/Join";
import DataInput from "./pages/DataInput";
import Prediction from "./pages/Prediction";
import MainLayout from "./pages/layout/MainLayout";
import CommonLayout from "./pages/layout/CommonLayout";
import DataInputHistory from "./pages/DataInputHistory";

export const loginPath = "/login";
export const joinPath = "/join";
export const dataInputPath = "/dataInput";
export const dataUpdatePath = "/dataUpdate";
export const predictionPath = "/prediction";
export const dataInputHistoryPath = "/dataInputHistory";

const AppContent = () => {
  const { isDialogOpen, dialogInfo } = useContext(Context);

  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          {/* 메인 페이지 */}
          <Route path="/" element={<Main />} />
        </Route>

        <Route element={<CommonLayout />}>
          {/* 로그인 페이지 */}
          <Route path={loginPath} element={<Login />} />
          {/* 회원가입 페이지 */}
          <Route path={joinPath} element={<Join />} />
          {/* 건강 데이터 입력 페이지 */}
          <Route path={dataInputPath} element={<DataInput />} />
          {/* 건강 데이터 수정 페이지 */}
          <Route path={dataUpdatePath} element={<DataInput />} />
          {/* 예측 페이지 */}
          <Route path={predictionPath} element={<Prediction />} />
          {/* 데이터 입력 내역 조회 페이지 */}
          <Route path={dataInputHistoryPath} element={<DataInputHistory />} />
        </Route>
      </Routes>

      {isDialogOpen && (
        <Dialog
          content={dialogInfo.content}
          isCancelButton={dialogInfo.isCancelButton}
          onConfirmClick={dialogInfo.onConfirmClick}
          title={dialogInfo.title}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <AppContent />
    </ContextProvider>
  );
};

export default App;
