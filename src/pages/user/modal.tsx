import { Button, Form, Input, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { ModalPropType } from "@types";
import { useApiMutation, useApiQuery } from "@hooks";
const { Option } = Select;
const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const {t} = useTranslation()
  const [form] = useForm();
  const { data } = useApiQuery<{ message: string; data: any }>({
    url: "roles",
    method: "GET",
  });
  console.log(data?.data?.items, 'modal-data')
  const { mutateAsync: createItem, isPending:isCreating } = useApiMutation<any>({ url: "users", method: "POST" });
  const { mutateAsync: updateItem, isPending:isUpdating } = useApiMutation<any>({ url: "users", method: "PUT" });
  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          name_en: update.name_en,
          name_kr: update.name_kr,
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
        title={update ? t("edit_user") : t("create_user")}
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
            label={t('select_role')}
            name="role_id"
            rules={[{ required: false, message: t('select_role') }]}
          >
            <Select placeholder={t('select_role')} size="large">
              {data?.data?.items?.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('username')}
            name="username"
            rules={[{ required: true, message: t('enter_username') }]}
          >
            <Input size="large" placeholder={t('enter_username')}/>
          </Form.Item>
          <Form.Item
            label={t('password')}
            name="password"
            rules={[{ required: true, message: t('enter_password') }]}
          >
            <Input size="large" placeholder={t('enter_password')}/>
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
