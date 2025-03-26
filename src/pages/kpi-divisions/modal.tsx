import { Button, Form, Modal, Input } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { ModalPropType } from "@types";
import { useApiMutation } from "@hooks";

const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { mutateAsync: createItem, isPending: isCreating } = useApiMutation<any>({
    url: "goal-categories",
    method: "POST",
  });

  const handleSubmit = async (values: any) => {
    try {
      const res = await createItem({ data: values });
      console.log(res)
      if (res.status === 201) {
        handleCancel();
      }
    } catch (error) {
      console.error(error, "ERROR");
    }
  };

  return (
    <Modal
      open={open}
      title={update ? t("edit_role") : t("add_divisions")}
      onCancel={handleCancel}
      footer={false}
    >
      <Form
        form={form}
        name="roleForm"
        style={{ width: "100%", marginTop: "20px" }}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label={t("name")}
          name="name"
          rules={[{ required: true, message: t("placeholer") }]}
        >
          <Input size="large" placeholder={t("placeholer")} />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="primary"
            className="btn"
            htmlType="submit"
            loading={isCreating}
          >
            {update ? t("update") : t("create")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
