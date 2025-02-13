import { Button, Space, Tooltip } from "antd"
import { EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete } from "@components";
import Modal from './modal'
import './style.css'

const Index = () => {
  const {t} = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [update,setUpdate] = useState(null)
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
  });
  const { data, isLoading } = useApiQuery<{ message: string; data: any }>({
    url: "users",
    method: "GET",
    params,
  });
  console.log(data, 'users')
  const { mutate: deleteItem } = useApiMutation({ url: "users", method: "DELETE"});
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
  const editData =(item: any)=>{
    setUpdate(item)
    setModalVisible(true)
  }
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t('full_name_en'),
      dataIndex: "full_name_en",
    },
    {
      title: t('full_name_kr'),
      dataIndex: "full_name_kr",
    },
    {
      title: t("username"),
      dataIndex: "username",
    },
    {
      title: t("email"),
      dataIndex: "email",
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title={t('update')}>
            <Button
              type="default"
              onClick={() => editData(record)}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <ConfirmDelete id={record.id} deleteItem={(id: any)=>handleDelete(id)} />
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
  const handleCancel =()=>{
    setModalVisible(false)
    setUpdate(null)
  }
  return (
    <>
    {modalVisible && <Modal open={modalVisible} update={update} handleCancel={handleCancel}/>}
    <div className="wrapper">
        <h1>{t('user')}</h1>
        <Button type="primary" className="btn" onClick={()=>setModalVisible(true)}>
          {t('create_user')}
        </Button>
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
