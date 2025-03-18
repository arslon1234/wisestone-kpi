import { Button, Space, Tooltip } from "antd";
import { Checkbox } from 'antd';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete, Search } from "@components";
import Modal from "./modal";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    multi_search: "",
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "team-members",
    method: "GET",
    params,
    id
  });
  const queryClient = useQueryClient();
  const { mutate: deleteItem } = useApiMutation({
    url: "user-teams",
    method: "DELETE",
  });
  const { mutate: handleCheck } = useApiMutation({
    url: "teams",
    method: "PUT",
  });
  const handleDelete = (id: any) => {
    deleteItem({ id });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  const handleChecked =(user_id: string | number)=>{
    handleCheck(
        { id, data: { leader_id: user_id } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
          },
        }
    );
  }
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
      title: t("full_name"),
      dataIndex: "member",
      render: (member: any) => member.full_name
    },
    {
      title: t("username"),
      dataIndex: "member",
      render: (member: any) => member.username
    },
    {
      title: t("role"),
      dataIndex: "member",
      render: (member: any) => member.role.name
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
            <Tooltip title={t("select_leader")}>
          <Checkbox checked={record.is_team_leader} disabled={record.is_team_leader} style={{width: "30px"}} onChange={()=>handleChecked(record.id)}/>
            </Tooltip>
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
      {modalVisible && (
        <Modal
          open={modalVisible}
          update={update}
          handleCancel={handleCancel}
        />
      )}
      <div className="wrapper">
        <h1>{t("team_members")}</h1>
        <div className="search_btn">
          <Search params={params} setParams={setParams} />
          <Button
            type="primary"
            className="btn"
            onClick={() => setModalVisible(true)}
          >
            {t("create_team_member")}
          </Button>
        </div>
      </div>
      <Table
        data={data?.result[0]?.members}
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
