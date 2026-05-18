import React, { useContext, useState } from "react";
import { TopNavigation } from "../components/TopNavigation";
import "../index.css";
import { Text } from "../components/Text/Text";
import { Input } from "../components/Input/Input";
import { OutlinedButton } from "../components/OutlinedButton/OutlinedButton";
import Context from "../context/context";
import { Button } from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { checkDuplicateAccountApi, joinApi } from "../api/userApi";
import { inputFixWidth } from "../utils/utils";

const Join = () => {
  const nav = useNavigate();
  const { openDialog, closeDialog } = useContext(Context);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  //비밀번호 확인 input
  const [confirmPassword, setConfirmPassword] = useState("");

  //이메일
  const [email, setEmail] = useState("");
  //연락처
  const [phoneNumber, setPhoneNumber] = useState("");

  //중복확인 여부
  const [isCheckedAccount, setIsCheckedAccount] = useState(false);

  //중복확인 함수
  const handleCheckDuplicate = async () => {
    try {
      const data = await checkDuplicateAccountApi(account);

      //아이디 중복여부 검증
      let content;
      if (data.isDuplicate) {
        content = "중복된 아이디입니다.";
      } else {
        content = "사용할 수 있는 아이디입니다.";
      }
      setIsCheckedAccount(!data.isDuplicate);

      //결과에 맞는 대화창 열기
      openDialog(
        "아이디 중복확인", //title
        content, //content
        false, //isCancelButton
        closeDialog, //onConfirmClick
      );
    } catch (e) {
      console.log(e);
    }
  };

  //회원가입 함수
  const handleJoin = async () => {
    try {
      await joinApi({
        account,
        password,
        name,
        email,
        phoneNumber,
      });

      openDialog(
        "회원가입 성공", //title
        "회원가입이 성공하였습니다.", //content
        false, //isCancelButton
        closeDialog, //onConfirmClick
      );

      //회원가입 성공 시 메인으로 돌아가기
      nav("/");
    } catch (e) {
      console.log(e);
    }
  };

  //회원가입 인풋 체크
  const checkJoinAble = () => {
    return (
      isCheckedAccount &&
      password &&
      password === confirmPassword &&
      name &&
      email &&
      phoneNumber
    );
  };

  return (
    <div className="contentContainer" style={{ gap: 30 }}>
      <Text textStyle={"bold"}>회원가입</Text>
      <div className="vertical-flex" style={{ gap: 30 }}>
        <div className="horizontal-flex">
          <Input
            fixWidth={inputFixWidth}
            maxLength={30}
            onChange={(e) => {
              setIsCheckedAccount(false);
              setAccount(e.target.value);
            }}
            placeholder="아이디 입력"
            title="ID"
            type="text"
            value={account}
          />
          <OutlinedButton isDisabled={!account} onClick={handleCheckDuplicate}>
            중복확인
          </OutlinedButton>
        </div>
        <Input
          fixWidth={inputFixWidth}
          maxLength={30}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="비밀번호 입력"
          title="비밀번호"
          type="password"
          value={password}
        />
        <Input
          fixWidth={inputFixWidth}
          maxLength={30}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          placeholder="비밀번호 재입력"
          title="비밀번호 확인"
          type="password"
          value={confirmPassword}
        />
        <Input
          fixWidth={inputFixWidth}
          maxLength={30}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="이름 입력"
          title="이름"
          type="text"
          value={name}
        />
        <Input
          fixWidth={inputFixWidth}
          maxLength={30}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="이메일 입력"
          title="이메일"
          type="email"
          value={email}
        />
        <Input
          fixWidth={inputFixWidth}
          maxLength={11}
          onChange={(e) => {
            const input = e.target.value.replace(/\D/g, "");
            setPhoneNumber(input);
          }}
          placeholder="연락처 입력"
          title="연락처"
          type="tel"
          value={phoneNumber}
        />
      </div>
      <Button isDisabled={!checkJoinAble()} onClick={handleJoin}>
        회원가입 완료
      </Button>
    </div>
  );
};

export default Join;
