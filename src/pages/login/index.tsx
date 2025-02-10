"use client"

import type React from "react"
import { Form, Input, Button, Card } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
// import { useNavigate } from "react-router-dom"

interface LoginFormValues {
  username: string
  password: string
}

const LoginPage: React.FC = () => {
  // const navigate = useNavigate()

  const onFinish = async (values: LoginFormValues) => {
   console.log(values)
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: "40%" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px", fontSize: "30px" }}>Login</h2>
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please enter your username!" },
              { min: 3, message: "Username must be at least 3 characters long!" },
            ]}
          >
            <Input prefix={<UserOutlined />} style={{fontSize: "16px"}} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter the password!" },
              { min: 6, message: "The password must be at least 6 characters long!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} style={{fontSize: "16px"}} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage

