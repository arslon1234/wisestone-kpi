import { Button, Form, Input, Modal, Slider } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useApiMutation } from "@hooks";
import { ModalPropType } from "@types";

const Index = ({ open, handleCancel, update, id }: ModalPropType) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { mutateAsync: createItem, isPending: isCreating } =
    useApiMutation<any>({ url: "kpi-factor-indicators", method: "POST" });
  const { mutateAsync: updateItem, isPending: isUpdating } =
    useApiMutation<any>({ url: "kpi-factor-indicators", method: "PUT" });

  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          name_en: update?.name_en,
          name_kr: update?.name_kr,
          description_en: update?.description_en,
          description_kr: update?.description_kr,
          progress_range: update?.progress_range || 0
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, update, form]);

  const handleSubmit = async (values: any) => {
    const requestData = {
      ...values,
      factor_id:id,
    };
    if (update) {
      try {
        const res = await updateItem({ id: update.id, data: requestData });
        if (res.status === 200) {
          handleCancel();
        }
      } catch (error) {
        console.error(error, "ERROR");
      }
    } else {
      try {
        const res = await createItem({ data: requestData });
        if (res.status === 201) {
          handleCancel();
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
        title={update ? t("update_indicator") : t("add_indicator")}
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
            label={t("name_en")}
            name="name_en"
            rules={[{ required: true, message: t("placeholer_en") }]}
          >
            <Input size="large" placeholder={t("placeholer_en")} />
          </Form.Item>
          <Form.Item
            label={t("name_kr")}
            name="name_kr"
            rules={[{ required: true, message: t("placeholer_kr") }]}
          >
            <Input size="large" placeholder={t("placeholer_kr")} />
          </Form.Item>
          <Form.Item label={t("ratio")} name="progress_range">
            <Slider min={0} max={100} tooltip={{ open: true }} />
          </Form.Item>
          <Form.Item
            label={t("desc_en")}
            name="description_en"
            rules={[{ required: true, message: t("placeholder_desc_en") }]}
          >
            <TextArea size="large" placeholder={t("placeholder_desc_en")} />
          </Form.Item>
          <Form.Item
            label={t("desc_kr")}
            name="description_kr"
            rules={[{ required: true, message: t("placeholder_desc_kr") }]}
          >
            <TextArea size="large" placeholder={t("placeholder_desc_kr")} />
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
    </>
  );
};

export default Index;
