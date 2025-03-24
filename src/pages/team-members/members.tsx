import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiQuery } from "@hooks";
import { Table } from "@components";
const Index = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    multi_search: "",
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "team-members/my",
    method: "GET",
    params,
  });
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
    // {
    //   title: t("action"),
    //   key: "action",
    //   render: (_: any, record: any) => (
    //     <Space size="middle">
    //       <ConfirmDelete
    //         id={record.member.id}
    //         deleteItem={(id: any) => handleDelete(id)}
    //       />
    //     </Space>
    //   ),
    // },
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

  const getRowClassName = (record: any) => {
    return record.team_lead ? "team-lead-row" : "";
  };
  return (
    <>
      <div className="wrapper">
        <div>
        <h2>{data?.result[0]?.team?.name} {t("members")}</h2>
        </div>
        <div className="search_btn">
          {/* <Search params={params} setParams={setParams} /> */}
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