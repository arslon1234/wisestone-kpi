import { Button, Form, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { ModalPropType } from "@types";
import { useApiMutation } from "@hooks";
import TextArea from "antd/lib/input/TextArea";
import { useParams } from "react-router-dom";

const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const {year, month, id} = useParams()
  console.log(year, month, id)
  const { mutateAsync: createItem, isPending: isCreating } = useApiMutation<any>({
    url: "requests",
    method: "POST",
  });
//   const { mutateAsync: updateItem, isPending: isUpdating } = useApiMutation<any>({
//     url: "roles",
//     method: "PATCH",
//   });

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
    //   try {
    //     const res = await updateItem({ id: update.id, data: changedFields });
    //     if (res.status === 200) {
    //       handleCancel();
    //     }
    //   } catch (error) {
    //     console.error(error, "ERROR");
    //   }
    } else {
        const payload = {
            ...values,
            year,
            month_num: month,
            team_id: id,
            status: "created"
        }
      try {
        const res = await createItem({ data: payload });
        if (res.status === 201) {
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
          label={t("comment")}
          name="comment"
          rules={[{ required: true, message: t("comment") }]}
        >
          <TextArea size="large" placeholder={t("comment")} />
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