import "./TopNavigation.css";
import "../../index.css";
import { Logo } from "../Logo/Logo";
import { LinkButton } from "../LinkButton/LinkButton";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Context from "../../context/context";
import backButton from "../../assets/backButton.png";
import {
  dataInputHistoryPath,
  dataInputPath,
  joinPath,
  loginPath,
  predictionPath,
} from "../../App";

export const TopNavigation = ({ isBackButton, menuList }) => {
  const nav = useNavigate();
  const { setUserInfo, processLogout } = useContext(Context);

  const navMenuList = [
    {
      key: "login",
      title: "로그인",
      path: loginPath,
      onClick: () => {
        nav(loginPath);
      },
    },
    {
      key: "join",
      title: "회원가입",
      path: joinPath,
      onClick: () => {
        nav(joinPath);
      },
    },
    {
      key: "main",
      title: "메인으로",
      path: "/",
      onClick: () => {
        nav("/");
      },
    },
    {
      key: "dataInputHistory",
      title: "건강 데이터 조회",
      path: dataInputHistoryPath,
      onClick: () => {
        nav(dataInputHistoryPath);
      },
    },
    {
      key: "dataInput",
      title: "건강 데이터 입력",
      path: dataInputPath,
      onClick: () => {
        nav(dataInputPath);
      },
    },
    {
      key: "prediction",
      title: "데이터 예측",
      path: predictionPath,
      onClick: () => {
        nav(predictionPath);
      },
    },
    {
      key: "logout",
      title: "로그아웃",
      path: "/",
      onClick: () => {
        processLogout();
        nav("/");
      },
    },
  ];

  const finalMenuList = menuList.map((item) => {
    return navMenuList.find((menu) => {
      return menu.key == item;
    });
  });

  return (
    <div className="topNavigation">
      {isBackButton ? (
        <img
          className="naviBackBtn"
          src={backButton}
          onClick={() => {
            nav(-1);
          }}
        />
      ) : (
        <Logo isTitle />
      )}
      <div className="menuList horizontal-flex flex-align-end">
        {finalMenuList.map((item) => {
          return (
            <LinkButton key={item.key} onClick={item.onClick}>
              {item.title}
            </LinkButton>
          );
        })}
      </div>
    </div>
  );
};
