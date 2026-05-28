import React, { useContext, useEffect, useState } from "react";
import { TopNavigation } from "../components/TopNavigation";
import { Text } from "../components/Text/Text";
import { Input } from "../components/Input/Input";
import "../index.css";
import { OutlinedButton } from "../components/OutlinedButton/OutlinedButton";
import { Button } from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import Context from "../context/context";
import { loginApi } from "../api/userApi";
import { joinPath } from "../App";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const { processLogin, processLogout, openDialog, closeDialog } =
    useContext(Context);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      if (data.success) {
        processLogin({
          ...data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        nav("/");
      } else {
        openDialog(
          "로그인 오류", //title
          "아이디 또는 비밀번호를 확인해주세요", //content
          false, //isCancelButton
          closeDialog, //onConfirmClick
        );
      }
    },
    onError: () => {
      openDialog(
        "로그인 오류", //title
        "아이디 또는 비밀번호를 확인해주세요", //content
        false, //isCancelButton
        closeDialog, //onConfirmClick
      );
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ account, password });
  };

  useEffect(() => {
    processLogout();
  }, [processLogout]);

  return (
    <div className="contentContainer" style={{ gap: 30 }}>
      <Text textStyle={"bold"}>로그인</Text>
      <Input
        fixWidth={30}
        maxLength={30}
        onChange={(e) => {
          setAccount(e.target.value);
        }}
        placeholder="아이디"
        title="ID"
        type="text"
        value={account}
      />
      <Input
        fixWidth={30}
        maxLength={30}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="비밀번호"
        title="PW"
        type="password"
        value={password}
      />
      <div className="horizontal-flex">
        <OutlinedButton
          onClick={() => {
            nav(joinPath);
          }}
        >
          회원가입
        </OutlinedButton>
        <Button
          isDisabled={!(account && password) || loginMutation.isPending}
          onClick={handleLogin}
        >
          로그인
        </Button>
      </div>
    </div>
  );
};

export default Login;
