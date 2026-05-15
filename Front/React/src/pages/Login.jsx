import React, { useContext, useState } from "react";
import { TopNavigation } from "../components/TopNavigation";
import { Text } from "../components/Text/Text";
import { Input } from "../components/Input/Input";
import "../index.css";
import { OutlinedButton } from "../components/OutlinedButton/OutlinedButton";
import { Button } from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import Context from "../context/context";
import { loginApi } from "../api/userApi";

const Login = () => {
  const { setUserInfo, processLogin, openDialog, closeDialog } =
    useContext(Context);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginApi({ account, password });
      if (data.result) {
        processLogin(data.userInfo);
        nav("/");
      } else {
        openDialog(
          "로그인 오류", //title
          "아이디 또는 비밀번호를 확인해주세요", //content
          false, //isCancelButton
          closeDialog, //onConfirmClick
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mainContainer">
      <TopNavigation isBackButton menuList={[]} />
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
              nav("/join");
            }}
          >
            회원가입
          </OutlinedButton>
          <Button isDisabled={!(account && password)} onClick={handleLogin}>
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
