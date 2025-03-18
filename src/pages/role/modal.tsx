import { Button, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { ModalPropType } from "@types";
import { useApiMutation } from "@hooks";

// Faqat o'zgargan field'larni aniqlash uchun yordamchi funksiya
const getChangedFields = (original: any, updated: any) => {
  const changes: any = {};
  for (const key in updated) {
    if (original[key] !== updated[key]) {
      changes[key] = updated[key];
    }
  }
  return changes;
};

const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { mutateAsync: createItem, isPending: isCreating } = useApiMutation<any>({
    url: "roles",
    method: "POST",
  });
  const { mutateAsync: updateItem, isPending: isUpdating } = useApiMutation<any>({
    url: "roles",
    method: "PATCH",
  });

  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          name: update.name,
          order_priority: update.order_priority,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, update, form]);

  const handleSubmit = async (values: any) => {
    if (update) {
      // Forma qiymatlari bilan original ma'lumotlarni solishtirish
      const updatedValues = {
        ...values,
        order_priority: Number(values.order_priority), // order_priority ni number ga aylantirish
      };
      const changedFields = getChangedFields(update, updatedValues);

      // Agar hech qanday o'zgarish bo'lmasa, so'rov jo'natmaslik
      if (Object.keys(changedFields).length === 0) {
        console.log("Hech qanday o'zgarish yo'q");
        handleCancel();
        return;
      }

      try {
        const res = await updateItem({ id: update.id, data: changedFields });
        if (res.status === 200) {
          handleCancel();
        }
      } catch (error) {
        console.error(error, "ERROR");
      }
    } else {
      try {
        const res = await createItem({ data: values });
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
      title={update ? t("edit_role") : t("create_role")}
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
          rules={[{ required: true, message: t("placeholer_en") }]}
        >
          <Input size="large" placeholder={t("placeholer_en")} />
        </Form.Item>
        <Form.Item
          label={t("order")}
          name="order_priority"
          rules={[{ required: true, message: t("enter_order") }]}
        >
          <Input size="large" type="number" placeholder={t("enter_order")} />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="primary"
            className="btn"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {update ? t("update") : t("create")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;