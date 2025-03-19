import { Button, Space, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete, Search } from "@components";
import Modal from "./modal";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState<any>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    multi_search: "",
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "teams",
    method: "GET",
    params,
  });
  const { mutate: deleteItem } = useApiMutation({ url: "teams", method: "DELETE" });

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
      multi_search: searchFromParams,
    }));
  }, [searchParams]);

  const editData = (item: any) => {
    setUpdate(item);
    setModalVisible(true);
  };

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
      title: t("desc"),
      dataIndex: "description",
      render: (text: string) => (
        <Tooltip title={text}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              maxWidth: 200,
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          <Tooltip title={t("update")}>
            <Button
              type="default"
              onClick={() => editData(record)}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <ConfirmDelete id={record.id} deleteItem={(id: any) => handleDelete(id)} />
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
      {modalVisible && <Modal open={modalVisible} update={update} handleCancel={handleCancel} />}
      <div className="wrapper">
        <h1>{t("team")}</h1>
        <div className="search_btn">
          <Search params={params} setParams={setParams} />
          <Button type="primary" className="btn" onClick={() => setModalVisible(true)}>
            {t("create_team")}
          </Button>
        </div>
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
        rowClassName="clickable-row"
        onRow={
          (record: any) => ({
            onClick: () => navigate(`/layout/team/${record.id}`),
          })
        }
      />
    </>
  );
};

export default Index;