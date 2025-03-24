import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete, Search } from "@components";
import { exportToExcel } from "@utils/exel-export";
import Modal from "./modal";
import Upload from "./upload";
import { getItem } from "@utils/storage-service";

const Index = () => {
  const { t } = useTranslation();
  const super_user = getItem("super");
  const user_id = localStorage.getItem("user_id");
  const [upload, setUpload] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    username__q: ""
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "users",
    method: "GET",
    params,
  });
  console.log(data, 'data')
  const users = data?.result.filter((item: any) => item.username !== user_id);
  const { mutate: deleteItem } = useApiMutation({
    url: "users",
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
      title: t("user_id"),
      dataIndex: "username",
    },
    {
      title: t("full_name"),
      dataIndex: "full_name",
    },
    {
      title: t("role"),
      dataIndex: "role",
      render: (role: any) => {
        if (role) return <span>{role.name}</span>;
        return <span>no</span>;
      },
    },
    {
      title: t("team"),
      dataIndex: "my_team",
      render: (my_team: any) => {
        if (my_team) return <span>{my_team?.name}</span>;
        return <span>---</span>;
      },
    },
    {
      title: "Super user",
      dataIndex: "superuser",
      render: (item: any) => (item == true ? "yes" : "no"),
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
  const handleCancelUpload = () => {
    setUpload(false);
  };
  const handleDownload = () => {
    if (!data.result || data.result === 0) {
      return console.warn("No data to export!");
    }
    exportToExcel(data.result, "Users_List"); // Excelga o‘girish
  };
  return (
    <>
      {modalVisible && (
        <Modal
          open={modalVisible}
          update={update}
          handleCancel={handleCancel}
        />
      )}
      {upload && <Upload isOpen={upload} handleCancel={handleCancelUpload} />}
      <div className="wrapper">
        <h1>{t("user")}</h1>
        <div className="search_btn">
        <Search searchKey="username__q" params={params} setParams={setParams} />
        {super_user == "true" && (
          <div className="wrapper-btn">
            <Button
              type="default"
              onClick={handleDownload}
              className="btn"
              disabled={isLoading}
            >
              {t("download")}
            </Button>
            <Button
              type="default"
              className="btn"
              onClick={() => setUpload(true)}
            >
              {t("upload")}
            </Button>
            <Button
              type="primary"
              className="btn"
              onClick={() => setModalVisible(true)}
            >
              {t("create_user")}
            </Button>
          </div>
        )}
        </div>
      </div>
      <Table
        data={users}
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
