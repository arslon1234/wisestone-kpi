import { Button, Space } from "antd"
// import { EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete,} from "@components";
import { exportToExcel } from "@utils/exel-export";
import Modal from './modal'
import Upload from './upload'

const Index = () => {
  const {t} = useTranslation()
  const [upload, setUpload] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [update,setUpdate] = useState(null)
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "users",
    method: "GET",
    params,
  });
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
      title: t('full_name'),
      dataIndex: "full_name",
    },
    {
      title: t("username"),
      dataIndex: "username",
    },
    {
      title: "Super user",
      dataIndex: "superuser",
      render: (item: any)=> item == true ? "yes" : "no"
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* <Tooltip title={t('update')}>
            <Button
              type="default"
              onClick={() => editData(record)}
              icon={<EditOutlined />}
            />
          </Tooltip> */}
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
  const handleCancelUpload =()=>{
    setUpload(false)
  }
  const handleDownload =()=>{
    if (!data.result || data.result === 0) {
      return console.warn("No data to export!");
    }
    exportToExcel(data.result, "Users_List"); // Excelga o‘girish
  }
  return (
    <>
    {modalVisible && <Modal open={modalVisible} update={update} handleCancel={handleCancel}/>}
    {upload && <Upload isOpen={upload} handleCancel={handleCancelUpload}/>}
    <div className="wrapper">
        <h1>{t('user')}</h1>
       <div className="wrapper-btn">
       <Button type="default" onClick={handleDownload} className="btn" disabled={isLoading}>
          Download
        </Button>
       <Button type="default" className="btn" onClick={()=>setUpload(true)}>
          {t('upload')}
        </Button>
        <Button type="primary" className="btn" onClick={()=>setModalVisible(true)}>
          {t('create_user')}
        </Button>
       </div>
    </div>
    <Table data={data?.result}
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
