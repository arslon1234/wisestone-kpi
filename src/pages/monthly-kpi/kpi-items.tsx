import { Table } from "@components";
import { useApiQuery } from "@hooks";
import { useState } from "react";
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import Modal from './approve'
const Index = () => {
  const {id, year, month} = useParams()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
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
      render: (item: any) => item?.percent + "%",
    },
    {
      title: t("goal_content"),
      dataIndex: "goal_content",
    },
    {
      title: t("task_value"),
      dataIndex: "target_values",
      render: (item: any) => {
        return item.map((task:any) => (
          <div>
            <p style={{display: "flex", gap: "5px"}}>
            <span>{task.content}</span>
            <span>{task.value}{task.value_type == 'ratio' ? '%' : 'times' }</span>
            <span>or</span>
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
      {open && <Modal open={open} handleCancel={()=> setOpen(false)}/>}
      <div className="wrapper">
      <h1>{data?.result[0]?.name}  {month}-{year}</h1>
      <Button
            type="primary"
            className="btn"
            onClick={()=>setOpen(true)}
          >
            {t("approve")}
          </Button>
      </div>
      <Table
        data={data?.result[0].team_monthly_kpi_goals}
        columns={columns}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default Index
