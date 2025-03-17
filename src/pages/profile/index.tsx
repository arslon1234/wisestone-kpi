import { useState } from "react"
import { Card, Tabs, Form, Input, Button, message } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
const { TabPane } = Tabs

interface User {
  username: string
  role: string
  full_name: string
  email: string
}

const ProfilePage = () => {
  const { t } = useTranslation()
  const [user, setUser] = useState<User>({
    username: "johndoe",
    role: "Manager",
    full_name: "John Doe",
    email: "john@example.com",
  })

  const onFinishProfile = (values: any) => {
    console.log("Profile update values:", values)
    setUser({ ...user, ...values })
    message.success("Profile updated successfully")
  }

  const onFinishPassword = (values: any) => {
    console.log("Password update values:", values)
    message.success("Password updated successfully")
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>{t('profile_settings')}</h1>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab={t('profile_info')} key="1">
            <Form name="profile_form" initialValues={user} onFinish={onFinishProfile} layout="vertical">
              <Form.Item name="username" label={t('user_id')}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item name="role" label={t('role')}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="full_name"
                label={t('full_name')}
                rules={[{ required: true, message: "Please input your full name!" }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {t('update_profile')}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab={t('change_password')} key="2">
            <Form name="password_form" onFinish={onFinishPassword} layout="vertical">
              <Form.Item
                name="current_password"
                label={t('current_password')}
                rules={[{ required: true, message: "Please input your current password!" }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                name="new_password"
                label={t('new_password')}
                rules={[
                  { required: true, message: "Please input your new password!" },
                  { min: 6, message: "Password must be at least 6 characters long!" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                label={t('confirm_password')}
                dependencies={["new_password"]}
                rules={[
                  { required: true, message: "Please confirm your new password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("The two passwords do not match!"))
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default ProfilePage

