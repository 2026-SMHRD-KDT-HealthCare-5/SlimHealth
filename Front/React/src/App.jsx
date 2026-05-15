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

const AppContent = () => {
  const { isDialogOpen, dialogInfo } = useContext(Context);

  return (
    <div>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Main />} />
        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
        {/* 회원가입 페이지 */}
        <Route path="/join" element={<Join />} />
        {/* 건강 데이터 입력 페이지 */}
        <Route path="/dataInput" element={<DataInput />} />
        {/* 예측 페이지 */}
        <Route path="/prediction" element={<Prediction />} />
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
