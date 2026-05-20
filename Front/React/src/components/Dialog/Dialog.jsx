import "./Dialog.css";
import "../../index.css";
import { useContext } from "react";
import Context from "../../context/context";
import { Text } from "../Text/Text";
import { Button } from "../Button/Button";
import { OutlinedButton } from "../OutlinedButton/OutlinedButton";

export const Dialog = ({ title, content, isCancelButton, onConfirmClick }) => {
  const { closeDialog } = useContext(Context);

  return (
    <div className="modal-backdrop" onClick={closeDialog}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Text textStyle={"bold"}>{title}</Text>
        <Text align={"center"}>{content}</Text>
        <div className="horizontal-flex">
          {isCancelButton && (
            <OutlinedButton onClick={closeDialog}>취소</OutlinedButton>
          )}
          <Button onClick={onConfirmClick || closeDialog}>확인</Button>
        </div>
      </div>
    </div>
  );
};
