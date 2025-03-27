import { Button, Form, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { ModalPropType } from "@types";
import { useApiMutation, useApiQuery } from "@hooks";
import { useParams } from "react-router-dom";

const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = useForm();

  const { data, isLoading } = useApiQuery<any>({
    url: "goal-categories",
    method: "GET",
  });
  const { mutateAsync: createItem, isPending: isCreating } = useApiMutation<any>({
    url: "yearly-goals/categories",
    method: "POST",
  });

  const handleSubmit = async (values: any) => {
    try {
      const res = await createItem({
        data: {
          year_id: id,
          category_id: values.category_id,
        },
      });
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
      title={t("add_goal")}
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
          label={t("category")}
          name="category_id"
          rules={[{ required: true, message: t("select_category") }]}
        >
          <Select
            placeholder={t("select_category")}
            size="large"
            loading={isLoading}
            style={{ width: "100%" }}
            options={data?.result?.map((cat:any) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
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
