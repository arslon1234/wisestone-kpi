import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete } from "@components";
import Modal from "./modal";
import { getItem } from "@utils/storage-service";

const Index = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
  });
  const super_user = getItem("super");
  console.log(super_user, 'user')
  const { data, isLoading } = useApiQuery<any>({
    url: "goal-categories",
    method: "GET",
    params,
  });
  const { mutate: deleteItem } = useApiMutation({
    url: "goal-categories",
    method: "DELETE",
  });
  const handleDelete = (id: any) => {
    deleteItem({ id });
  };
  useEffect(() => {
    const pageFromParams = searchParams.get("page") || "1";
    const limitFromParams = searchParams.get("limit") || "5";
    const searchFromParams = searchParams.get("search") || "";
    setParams((prev) => ({
      ...prev,
      page: Number(pageFromParams),
      limit: Number(limitFromParams),
      search: searchFromParams,
    }));
  }, [searchParams]);
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("name"),
      dataIndex: "name",
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <ConfirmDelete
            id={record.id}
            deleteItem={(id: any) => handleDelete(id)}
          />
        </Space>
        
      ),
    },
  ];
  const handleTableChange = (pagination: any) => {
    const { current = 1, pageSize = 5 } = pagination;
    setParams((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));
    setSearchParams({
      page: String(current),
      limit: String(pageSize),
    });
  };
  const handleCancel = () => {
    setModalVisible(false);
    setUpdate(null);
  };
  return (
    <>
      <Modal open={modalVisible} update={update} handleCancel={handleCancel} />
      <div className="wrapper">
        <h1>{t("divisions")}</h1>
        {super_user == 'true' && (
          <Button
            type="primary"
            className="btn"
            onClick={() => setModalVisible(true)}
          >
            {t("create")}
          </Button>
        )}
      </div>
      <Table
        data={data?.result}
        columns={columns}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: data?.data?.count,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "7", "10", "12"],
        }}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Index;
