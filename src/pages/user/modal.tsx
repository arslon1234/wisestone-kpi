import { Button, Form, Input, Modal, Checkbox, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useApiMutation, useApiQuery } from "@hooks";
import { ModalPropType } from "@types";

const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { data: roles, isLoading } = useApiQuery<any>({
    url: "roles",
    method: "GET",
  });
  const { mutateAsync: createItem, isPending: isCreating } =
    useApiMutation<any>({ url: "users", method: "POST" });
  const { mutateAsync: updateItem, isPending: isUpdating } =
    useApiMutation<any>({ url: "users", method: "PATCH" });
  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          full_name: update.full_name,
          username: update.username,
          is_leader: update.is_leader || false,
          role: update.role?.id,
          superuser: update.superuser || false,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, update, form]);

  const handleSubmit = async (values: any) => {
    if (update) {
      try {
        const res = await updateItem({ id: update.id, data: values });
        if (res.status === 200) {
          handleCancel();
        }
      } catch (error) {
        console.error(error, "ERROR");
      }
    } else {
      try {
        const payload = {...values, superuser: values.superuser || false}
        const res = await createItem({ data: payload });
        console.log(res, "res");
        if (res.status === 200) {
          handleCancel();
        }
      } catch (error) {
        console.error(error, "ERROR");
      }
    }
  };

  return (
    <Modal
      open={open}
      title={update ? t("edit_user") : t("create_user")}
      onCancel={handleCancel}
      footer={false}
    >
      <Form
        form={form}
        name="userForm"
        style={{ width: "100%", marginTop: "20px" }}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label={t("full_name")}
          name="full_name"
          rules={[{ required: true, message: t("placeholder_full_name") }]}
        >
          <Input size="large" placeholder={t("placeholder_full_name")} />
        </Form.Item>
        <Form.Item
          label="User ID"
          name="username"
          rules={[{ required: true, message: t("enter_username") }]}
        >
          <Input size="large" placeholder={t("enter_username")} />
        </Form.Item>
        {!update && (
          <Form.Item
            label={t("password")}
            name="password"
            rules={[{ required: true, message: t("enter_password") }]}
          >
            <Input.Password size="large" placeholder={t("enter_password")} />
          </Form.Item>
        )}
        <Form.Item
          label={t("role")}
          name="role"
          rules={[{ required: true, message: t("select_role") }]}
        >
          <Select
            size="large"
            placeholder={t("select_role")}
            loading={isLoading}
            disabled={isLoading}
          >
            {roles?.result?.map((role: any) => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="superuser"
          valuePropName="checked"
        >
          <Checkbox>Super user</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {update ? t("update") : t("add")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
