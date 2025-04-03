import { Table } from "@components";
import { useApiQuery } from "@hooks";
import { useState } from "react";
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";
const Index = () => {
  const {id, year, month} = useParams()
  const { t } = useTranslation()
  const [params] = useState({
    year: year,
    month_num: month,
    team_id: id
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "monthly-goals",
    method: "GET",
    params,
  });
  console.log(data?.result[0]?.team_monthly_kpi_goals)
  const columns = [
    {
      title: t("category"),
      dataIndex: "yearly_group",
      render: (item: any) => item?.header,
    },
    {
      title: t("ratio"),
      dataIndex: "yearly_group",
      render: (item: any) => item?.percent,
    },
    {
      title: t("task_value"),
      dataIndex: "target_values",
      render: (item: any) => {
        return item.map((task:any) => (
          <div>
            <p style={{display: "flex", gap: "5px"}}>
            <span>{task.value_type}</span>
            <span>{task.value}</span>
            <span>{task.value_num_type}</span>
          </p>
          </div>
        ))
      },
    },
  ];
  const handleTableChange =()=>{

  }
  return (
    <div>
      <h1>{data?.result[0]?.name}</h1>
      <Table
        data={data?.result[0].team_monthly_kpi_goals}
        columns={columns}
        // pagination={{
        //   current: params.page,
        //   pageSize: params.limit,
        //   total: data?.data?.count,
        //   showSizeChanger: true,
        //   pageSizeOptions: ["2", "5", "7", "10", "12"],
        // }}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default Index
