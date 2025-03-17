import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useApiMutation } from "@hooks";
import { ModalPropType } from "@types";
const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const {t} = useTranslation()
  const [form] = useForm();
  const { mutateAsync: createItem, isPending:isCreating } = useApiMutation<any>({ url: "teams", method: "POST" });
  const { mutateAsync: updateItem, isPending:isUpdating } = useApiMutation<any>({ url: "teams", method: "PATCH" });
  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          name: update.name,
          description: update.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, update, form]);
  const handleSubmit = async (values: any) => {
    if(update){
      try {
        const res = await updateItem({id: update.id, data: values });
        if(res.status == 200){
         handleCancel()
        }
      } catch (error) {
        console.error(error, "ERROR");
      }
    }else{
      try {
        const res = await createItem({ data: values });
        if(res.status == 201){
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
        title={update ? t("update_team") : t("create_team")}
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
            label={t('desc')}
            name="description"
            rules={[{ required: true, message: t('placeholder_desc_en') }]}
          >
            <TextArea size="large" placeholder={t('placeholder_desc_en')}/>
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
