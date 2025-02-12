import type React from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useApiMutation } from "@hooks";
import { setItem } from "@utils/storage-service";
import { useNavigate } from "react-router-dom"
import logo from "../../assets/wisestone.png";
import "./style.css";
interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const loginMutation = useApiMutation<{ token: string }>({
    url: "auth/login",
    method: "POST",
  });
  const onFinish = async (values: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync(values);
      if(result.token){
        setItem('access_token', result.token)
        navigate('/layout')
      }
      console.log(result)
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div
      className="wrapper-item"
      >
        <img src={logo} alt="wisestone-logo" />
        <Card style={{ width: "100%" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "30px",
            }}
          >
            Login
          </h2>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" },
                {
                  min: 3,
                  message: "Username must be at least 3 characters long!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                style={{ fontSize: "16px" }}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter the password!" },
                {
                  min: 6,
                  message: "The password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                style={{ fontSize: "16px" }}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
