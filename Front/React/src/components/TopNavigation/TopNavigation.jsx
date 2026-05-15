import "./TopNavigation.css";
import "../../index.css";
import { Logo } from "../Logo/Logo";
import { LinkButton } from "../LinkButton/LinkButton";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Context from "../../context/context";
import backButton from "../../assets/backButton.png";

export const TopNavigation = ({ isBackButton, menuList }) => {
  const nav = useNavigate();
  const { setUserInfo, processLogout } = useContext(Context);

  const navMenuList = [
    {
      key: "login",
      title: "로그인",
      path: "/login",
      onClick: () => {
        nav("/login");
      },
    },
    {
      key: "join",
      title: "회원가입",
      path: "/join",
      onClick: () => {
        nav("/join");
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
      key: "dataInput",
      title: "건강 데이터 입력",
      path: "/dataInput",
      onClick: () => {
        nav("/dataInput");
      },
    },
    {
      key: "prediction",
      title: "데이터 예측",
      path: "/prediction",
      onClick: () => {
        nav("/prediction");
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
