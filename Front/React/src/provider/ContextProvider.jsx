import React from "react";
import { useState } from "react";
import Context from "../context/context";
import { userInfoKey } from "../utils/utils";

//유저 정보를 저장하는 contextapi
const ContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(localStorage.getItem(userInfoKey));
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({
    title: "",
    content: "",
    isCancelButton: false,
    onConfirmClick: null,
  });

  const openDialog = (title, content, isCancelButton, onConfirmClick) => {
    setDialogInfo({ title, content, isCancelButton, onConfirmClick });
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  const processLogin = (info) => {
    setUserInfo(info);
    localStorage.setItem(
      userInfoKey,
      JSON.stringify({
        info,
      }),
    );
  };

  const processLogout = () => {
    setUserInfo(null);
    localStorage.removeItem(userInfoKey);
  };

  return (
    <Context.Provider
      value={{
        userInfo,
        setUserInfo,
        openDialog,
        closeDialog,
        isDialogOpen,
        dialogInfo,
        processLogin,
        processLogout,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
