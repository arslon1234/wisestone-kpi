import type React from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useApiMutation } from "@hooks";
import { setItem } from "@utils/storage-service";
import { useNavigate } from "react-router-dom";
import "./style.css";

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending: isLoginPending } = useApiMutation<any>({
    url: "auth/login",
    method: "POST",
  });
  const { mutateAsync: fetchUser, isPending: isUserPending } = useApiMutation<any>({
    url: "users/me",
    method: "GET",
  });

  const onFinish = async (values: LoginFormValues) => {
    try {
      const loginResult = await login({ data: values });
      if (loginResult?.access_token) {
        setItem("access_token", loginResult.access_token);
        setItem("user_id", values.username);

        // Login muvaffaqiyatli bo'lgandan keyin users/me so'rovini jo'natamiz
        const userData = await fetchUser({});
        setItem('super', userData.result[0].superuser)
        navigate("/layout");
      }
      console.log("Login result:", loginResult);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="wrapper-item">
        <Card style={{ width: "100%" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "30px",
            }}
          >
            Sign In
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
                placeholder="User ID"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter the password!" },
                {
                  min: 4,
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
                loading={isLoginPending || isUserPending} // Login va users/me so'rovlari uchun loading
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