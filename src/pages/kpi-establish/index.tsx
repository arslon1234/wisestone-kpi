import { Button, DatePicker, Space, Tooltip } from "antd";
import { EditOutlined, ArrowRightOutlined,MoreOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete, Search } from "@components";
import Modal from "./modal";
import dayjs from "dayjs";

const Index = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang");
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    multi_search: "",
    year: "",
  });
  const { data, isLoading } = useApiQuery<{ message: string; data: any }>({
    url: "kpi-parents",
    method: "GET",
    params,
  });
  const { mutate: deleteItem } = useApiMutation({
    url: "kpi-parents",
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
  const editData = (item: any) => {
    console.log(item);
    setUpdate(item);
    setModalVisible(true);
  };
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("name"),
      dataIndex: lang == "en" ? "name_en" : "name_kr",
    },
    {
      title: t("year"),
      dataIndex: "year",
    },
    {
      title: t("description"),
      dataIndex: lang == "en" ? "description_en" : "description_kr",
      render: (text: string) => (
        <Tooltip title={text}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              maxWidth: 200,
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title={t("update")}>
            <Button
              type="default"
              onClick={() => editData(record)}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <ConfirmDelete
            id={record.id}
            deleteItem={(id: any) => handleDelete(id)}
          />
          <Tooltip title={t("single_page")}>
            <Button
              type="default"
              onClick={() => navigate(`/layout/yearly-kpi/${record.id}`)}
              icon={<ArrowRightOutlined />}
            />
          </Tooltip>
          <Tooltip title={t("more")}>
            <Button
              type="default"
              onClick={() => navigate(`/layout/yearly-kpis/${record.id}`)}
              icon={<MoreOutlined />}
            />
          </Tooltip>
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
  const handleYearChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const year = dayjs(date).format("YYYY");
      setParams((prev) => ({
        ...prev,
        year,
      }));
      setSearchParams((prev) => {
        prev.set("year", year);
        return prev;
      });
    } else {
      setParams((prev) => ({
        ...prev,
        year: "", 
      }));
      setSearchParams((prev) => {
        prev.delete("year");
        return prev;
      });
    }
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
        <h1>{t("yearly_kpi")}</h1>
        <div className="search_btn">
          <DatePicker
            picker="year"
            onChange={handleYearChange}
            value={params.year ? dayjs(params.year, "YYYY") : null}
            placeholder={t("select_year")}
          />
          <Search params={params} setParams={setParams} />
          <Button
            type="primary"
            className="btn"
            onClick={() => setModalVisible(true)}
          >
            {t("create_new_kpi")}
          </Button>
        </div>
      </div>
      <Table
        data={data?.data?.items}
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
