import { useState, useEffect } from "react";
import { Card, Tabs, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useApiMutation, useApiQuery } from "@hooks";
import { useNavigate } from "react-router-dom";
import { removeItem } from "@utils/storage-service";
const ProfilePage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm(); // Form instance
  const navigate = useNavigate()
  const [user, setUser] = useState({
    username: "",
    role: "Manager",
    full_name: "",
    email: "john@example.com",
  });

  const { data } = useApiQuery<any>({
    url: "users/me",
    method: "GET",
  });

  useEffect(() => {
    if (data?.result[0]?.username) {
      setUser((prev) => ({
        ...prev,
        username: data.result[0].username,
        full_name: data.result[0].full_name
      }));
      form.setFieldsValue({ username: data.result[0].username, full_name: data.result[0].full_name }); // Formani yangilash
    }
  }, [data, form]);

  const { mutateAsync: updateProfile } = useApiMutation<any>({
    url: "users/me",
    method: "PATCH",
  });

  const onFinishProfile = async (values: any) => {
    console.log("Profile update values:", values);
    await updateProfile({ data: values });
    // message.success("Profile updated successfully");
  };

  const onFinishPassword = async (values: any) => {
    const payload = { password: values.new_password };
    const res = await updateProfile({ data: payload });
    if(res.status === 200){
      navigate('/')
      removeItem('access_token')
    }
  };

  const items = [
    {
      key: "1",
      label: t("profile_info"),
      children: (
        <Form
          form={form} // Form instance
          name="profile_form"
          initialValues={user}
          onFinish={onFinishProfile}
          layout="vertical"
        >
          <Form.Item name="username" label={t("user_id")}>
            <Input prefix={<UserOutlined />} disabled/>
          </Form.Item>
          {/* <Form.Item name="role" label={t("role")}>
            <Input disabled />
          </Form.Item> */}
          <Form.Item
            name="full_name"
            label={t("full_name")}
            rules={[{ required: true, message: "Please input your full name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("update_profile")}
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: t("change_password"),
      children: (
        <Form name="password_form" onFinish={onFinishPassword} layout="vertical">
          <Form.Item
            name="new_password"
            label={t("new_password")}
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 4, message: "Password must be at least 4 characters long!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label={t("confirm_password")}
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("update_password")}
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        {t("profile_settings")}
      </h1>
      <Card>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default ProfilePage;
