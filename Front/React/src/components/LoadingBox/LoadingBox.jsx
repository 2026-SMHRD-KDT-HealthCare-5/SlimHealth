import "./LoadingBox.css";
import "../../index.css";
import loading from "../../assets/loading.gif";
export const LoadingBox = () => {
  return (
    <div className="loadingBox">
      <img src={loading} />
    </div>
  );
};
