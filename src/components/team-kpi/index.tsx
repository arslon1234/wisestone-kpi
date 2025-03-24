import { Button, Space, Tooltip } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete } from "@components";

const Index = ({type}: {type: string}) => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  // const [, setModalVisible] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  // const [update,setUpdate] = useState(null)
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    multi_search: "",
    type
  });
  const { data, isLoading } = useApiQuery<{ message: string; data: any }>({
    url: "kpi-progress-status",
    method: "GET",
    params,
  });
  const { mutate: deleteItem } = useApiMutation({ url: "teams", method: "DELETE"});
  const handleDelete =(id: any)=>{
    deleteItem({id})
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
  // const editData =(item: any)=>{
  //   setUpdate(item)
  //   setModalVisible(true)
  // }
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t('name_en'),
      dataIndex: "name_en",
    },
    {
      title: t('name_kr'),
      dataIndex: "name_kr",
    },
    {
      title: t('desc_en'),
      dataIndex: "description_en",
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", maxWidth: 200 }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: t('desc_kr'),
      dataIndex: "description_kr",
      ellipsis: true,
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title={t('update')}>
            {/* <Button
              type="default"
              onClick={() => editData(record)}
              icon={<EditOutlined />}
            /> */}
          </Tooltip>
          <ConfirmDelete id={record.id} deleteItem={(id: any)=>handleDelete(id)} />
          <Tooltip title={t('single_page')}>
            <Button
              type="default"
              onClick={()=>navigate(`/layout/team/${record.id}`)}
              icon={<ArrowRightOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const handleTableChange =(pagination: any)=>{
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
  }
  // const handleCancel =()=>{
  //   setModalVisible(false)
  //   setUpdate(null)
  // }
  return (
    <>
    <div className="wrapper">
        <h1>{t('team')}</h1>
       <div className="search_btn">
       {/* <Search params={params} setParams={setParams} /> */}
        {/* <Button type="primary" className="btn" onClick={()=>setModalVisible(true)}>
          {t('create_team')}
        </Button> */}
       </div>
    </div>
    <Table data={data?.data?.items}
        columns={columns} pagination={{
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
  )
}

export default Index
