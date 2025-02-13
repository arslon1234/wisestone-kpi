import { Button } from "antd"
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { useApiQuery } from "@hooks";
import { Table } from "@components";
import Modal from './modal'
import './style.css'

const Index = () => {
  const {t} = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
  });
  const { data, isLoading } = useApiQuery<{ message: string; data: any }>({
    url: "roles",
    method: "GET",
    params,
    withAuth: true, // If authentication is required
  });
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
  console.log(data?.data?.teams, 'roles')
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name english",
      dataIndex: "name_en",
    },
    {
      title: "Name korean",
      dataIndex: "name_kr",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_: any, record: any) => (
    //     <Space size="middle">
    //       <Tooltip title="Edit">
    //         <Button
    //           type="default"
    //           onClick={() => editData(record)}
    //           icon={<EditOutlined />}
    //         />
    //       </Tooltip>
    //       <ConfirmDelete id={record.id} deleteItem={(id:string | number)=>mutate(id)} />
    //       <Tooltip title="product-detail">
    //         <Button
    //           type="default"
    //           onClick={() => navigate(`/layout/product/${record.id}`)}
    //           icon={<ArrowsAltOutlined />}
    //         />
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
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
  return (
    <>
    <Modal open={modalVisible} handleCancel={()=>setModalVisible(false)}/>
    <div className="wrapper">
        <h1>{t('role')}</h1>
        <Button type="primary" className="btn" onClick={()=>setModalVisible(true)}>
          {t('create_role')}
        </Button>
    </div>
    <Table data={data?.data?.teams}
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
