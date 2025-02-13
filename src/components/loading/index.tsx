import { Spin } from "antd";
import './style.css'
const Index = () => {
  return (
    <div className="loading-container">
      <Spin className="custom-spin" size="large" />
    </div>
  );
};

export default Index;
