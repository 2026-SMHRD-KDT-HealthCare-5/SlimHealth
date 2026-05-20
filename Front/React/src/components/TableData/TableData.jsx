import "./TableData.css";
import "../../index.css";
export const TableData = ({ children, isThick }) => {
  return (
    <td
      className="tableData"
      style={isThick ? { border: "3px solid black" } : {}}
    >
      {children}
    </td>
  );
};
