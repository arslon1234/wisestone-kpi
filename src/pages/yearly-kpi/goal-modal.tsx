import { Button, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { useApiMutation } from "@hooks";

const GoalModal = ({ open, categoryId, handleCancel }: any) => {
  const { t } = useTranslation();
  const [form] = useForm();

  const { mutateAsync: addGoal, isPending } = useApiMutation<any>({
    url: "yearly-goals/categories/groups",
    method: "POST",
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
    try {
      const res = await addGoal({
        data: {
          category_id: categoryId,
          ...values
        },
      });
      if (res.status === 201) {
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.error(error, "ERROR");
    }
  };

  return (
    <Modal
      open={open}
      title={t("add_goal")}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      footer={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label={t("goal_title")}
          name="header"
          rules={[{ required: true, message: t("enter_goal") }]}
        >
          <Input size="large" placeholder={t("goal_title_placeholder")} />
        </Form.Item>

        <Form.Item
          label={t("ratio")}
          name="percent"
          rules={[{ required: true, message: t("enter_ratio") }]}
        >
          <Input size="large" placeholder={t("ratio_placeholder")} type="number" />
        </Form.Item>

        <Form.Item
          label={t("comment")}
          name="description"
          rules={[{ required: false }]}
        >
          <Input.TextArea size="large" placeholder={t("description_placeholder")} />
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isPending}
            style={{ width: "100%" }}
          >
            {t("add")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GoalModal;
