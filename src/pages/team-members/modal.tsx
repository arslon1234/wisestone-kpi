import { Button, Form, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "@hooks";
import { ModalPropType } from "@types";
import { useQueryClient } from "@tanstack/react-query";

// `result` uchun interfeys
interface User {
  id: number | string;
  username: string;
  full_name?: string | null;
  role: {
    name: string
  }
}

// `useApiQuery` dan qaytadigan ma'lumotlar uchun interfeys
interface ApiResponse {
  message: string;
    result: User[];
}

const Index = ({ open, handleCancel }: ModalPropType) => {
  const [params, setParams] = useState({
    multi_search: "",
  });
  const { t } = useTranslation();
  const [form] = useForm();
  const { id } = useParams<{ id: string }>();
  const { data } = useApiQuery<ApiResponse>({
    url: "team-members/no-team-users",
    method: "GET",
    params,
  });
  const { mutateAsync: createItem, isPending: isCreating } = useApiMutation<any>(
    { url: "team-members", method: "POST" }
  );
  const queryClient = useQueryClient();
  const handleSubmit = async (values: any) => {
    const users = values.user_id.map((userId: number | string) => ({
      user_id: userId,
      team_lead: false,
    }));

    const payload = {
      team_id: Number(id),
      users: users,
    };
    try {
      const res = await createItem({ data: payload });
      console.log(res.status)
      if (res.status === 201) {
        handleCancel();
        queryClient.invalidateQueries({ queryKey: ["team-members"] });
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
            mode="multiple" // Bir nechta tanlash uchun
            showSearch
            placeholder={t("select_user")}
            optionFilterProp="label"
            onSearch={handleChange}
            maxTagCount="responsive"
          >
            {data?.result?.map((item: User) => (
              <Select.Option
                key={item.id}
                label={`${item.full_name}`}
                value={item.id}
              >
                {item.full_name} - {item?.role?.name}
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