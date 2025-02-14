import { Button, Form, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "@hooks";
import { ModalPropType } from "@types";
import { useQueryClient } from "@tanstack/react-query";

const Index = ({ open, handleCancel }: ModalPropType) => {
  const [params, setParams] = useState({
    multi_search: "",
  });
  const { t } = useTranslation();
  const [form] = useForm();
  const { id } = useParams();
  const { data } = useApiQuery<{ message: string; data: any }>({
    url: "users",
    method: "GET",
    params,
  });
  const { mutateAsync: createItem, isPending: isCreating } =
    useApiMutation<any>({ url: "user-teams", method: "PUT" });
    const queryClient = useQueryClient();
    const handleSubmit = async (values: any) => {
    try {
      const res = await createItem({ data: { ...values, team_id: id } });
      if (res.status == 200) {
        handleCancel();
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    } catch (error) {
      console.error(error, "ERROR");
    }
  };
  const handleChange = (str: string) => {
    console.log(str, "val");
    setParams((prev) => ({
      ...prev,
      multi_search: str,
    }));
  };
  return (
    <Modal
      open={open}
      title={t("create_team_member")}
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
          label={t("select_user")}
          name="user_id"
          rules={[{ required: true, message: t("select_user") }]}
        >
          <Select
            showSearch
            placeholder={t("select_user")}
            optionFilterProp="label"
            onSearch={handleChange}
          >
            {data?.data?.items?.map((item: any) => (
              <Select.Option
                key={item.id}
                label={item.username}
                value={item.id}
              >
                {item.username}
              </Select.Option>
            ))}
          </Select>
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
            {t("create")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
