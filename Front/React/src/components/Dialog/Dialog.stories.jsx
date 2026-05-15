import { Dialog } from "./Dialog";
export default {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};
export const Default = {
  args: {
    title: "로그인 오류",
    content: "아이디 또는 비밀번호를 확인해주세요.",
    isCancelButton: true,
    onConfirmClick: () => {},
  },
};
