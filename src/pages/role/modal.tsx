import { Button, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { ModalPropType } from "@types";
import { useApiMutation } from "@hooks";
const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const {t} = useTranslation()
  const [form] = useForm();
  const { mutateAsync: createItem, isPending } = useApiMutation<any>({ url: "roles", method: "POST" });
  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          name: update.name,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, update, form]);
  const handleSubmit = async (values: any) => {
    try {
      const res = await createItem({ data: values });
      if(res.status == 201){
       handleCancel()
      }
     
    } catch (error) {
      console.error(error, "Xatolik");
    }
  };

  return (
    <>
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
            label={t('role_name_en')}
            name="name_en"
            rules={[{ required: true, message: t('role_placeholer_en') }]}
          >
            <Input size="large" placeholder={t('role_placeholer_en')}/>
          </Form.Item>
          <Form.Item
            label={t('role_name_kr')}
            name="name_kr"
            rules={[{ required: true, message: t('role_placeholer_kr') }]}
          >
            <Input size="large" placeholder={t('role_placeholer_kr')}/>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              style={{ width: "100%" }}
              type="primary"
              className="btn"
              htmlType="submit"
              loading={isPending}
            >
              {update ? t('update') : t('create')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
