import { Button, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { ModalPropType } from "@types";
import { useApiMutation } from "@hooks";
const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const {t} = useTranslation()
  const [form] = useForm();
  const { mutateAsync: createItem, isPending:isCreating } = useApiMutation<any>({ url: "roles", method: "POST" });
  const { mutateAsync: updateItem, isPending:isUpdating } = useApiMutation<any>({ url: "roles", method: "PATCH" });
  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          name: update.name,
          order_priority: update.order_priority
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, update, form]);
  const handleSubmit = async (values: any) => {
    if(update){
      const payload = {...values, order_priority: Number(values.order_priority)}
      try {
        const res = await updateItem({id: update.id, data: payload });
        if(res.status == 200){
         handleCancel()
        }
      } catch (error) {
        console.error(error, "ERROR");
      }
    }else{
      try {
        const res = await createItem({ data: values });
        console.log(res)
        if(res.status == 200){
         handleCancel()
        }
      } catch (error) {
        console.error(error, "ERROR");
      }
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
            label={t('name')}
            name="name"
            rules={[{ required: true, message: t('placeholer_en') }]}
          >
            <Input size="large" placeholder={t('placeholer_en')}/>
          </Form.Item>
          <Form.Item
            label={t('order')}
            name="order_priority"
            rules={[{ required: true, message: t('enter_order') }]}
          >
            <Input size="large" type="number" placeholder={t('enter_order')}/>
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
              {update ? t('update') : t('create')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
