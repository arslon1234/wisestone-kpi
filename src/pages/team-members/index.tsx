import { Button, Space, Tooltip } from "antd";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete } from "@components";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "./modal";

const Index = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState<any>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    multi_search: "",
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "team-members",
    method: "GET",
    params,
    id,
  });
  const queryClient = useQueryClient();
  const { mutateAsync: deleteItem } = useApiMutation({
    url: `team-members/${id}`,
    method: "DELETE",
  });
  const { mutateAsync: handleCheck } = useApiMutation<any>({
    url: "team-members",
    method: "PATCH",
  });

  const handleDelete = async (userId: any) => {
    try {
      const res: any = await deleteItem({ id: userId });
      if (res.status === 204) {
        queryClient.invalidateQueries({ queryKey: ["team-members", id, params] });
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleChecked = (user_id: string | number, isCurrentlyLeader: boolean) => {
    const newTeamLeadStatus = !isCurrentlyLeader;
    handleCheck(
      { data: { user_id: user_id, team_id: id, team_lead: newTeamLeadStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["team-members", id, params] });
        },
        onError: (error) => {
          console.error("Handle check error:", error);
        },
      }
    );
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

  // Ma'lumotlarni team_lead bo'yicha saralash
  const sortedMembers = useMemo(() => {
    if (!data?.result[0]?.members) return [];
    return [...data.result[0].members].sort((a, b) => b.team_lead - a.team_lead);
  }, [data]);

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
      render: (member: any) => member.full_name,
    },
    {
      title: t("username"),
      dataIndex: "member",
      render: (member: any) => member.username,
    },
    {
      title: t("role"),
      dataIndex: "member",
      render: (member: any) => member.role.name,
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title={t("select_leader")}>
            <Checkbox
              checked={record.team_lead}
              style={{ width: "35px" }}
              onChange={() => handleChecked(record.member.id, record.team_lead)}
            />
          </Tooltip>
          <ConfirmDelete
            id={record.member.id}
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

  const getRowClassName = (record: any) => {
    return record.team_lead ? "team-lead-row" : "";
  };
  return (
    <>
      {modalVisible && (
        <Modal open={modalVisible} update={update} handleCancel={handleCancel} />
      )}
      <div className="wrapper">
        <div>
        <h2>{data?.result[0]?.team?.name} {t("members")}</h2>
        </div>
        <div className="search_btn">
          {/* <Search params={params} setParams={setParams} /> */}
          <Button type="primary" className="btn" onClick={() => setModalVisible(true)}>
            {t("create_team_member")}
          </Button>
        </div>
      </div>
      <Table
        data={sortedMembers}
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
        rowClassName={getRowClassName} 
      />
    </>
  );
};

export default Index;