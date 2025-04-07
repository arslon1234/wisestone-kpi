import { Button, Space, DatePicker, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete } from "@components";
import Modal from "./modal";
import { getItem } from "@utils/storage-service";
import moment from "moment";

const Index = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    year: String(currentYear),
    month_num: currentMonth,
  });
  const super_user = getItem("super");
  const navigate = useNavigate();

  const { data, isLoading } = useApiQuery<any>({
    url: "monthly-goals",
    method: "GET",
    params,
  });

  console.log(data?.result, "data");

  const { mutate: deleteItem } = useApiMutation({
    url: "monthly-goals",
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

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("team_name"),
      dataIndex: "name",
      // render: (item: any) => item?.name,
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space
          size="middle"
          onClick={(e) => e.stopPropagation()} // Navigatsiyani bloklash
        >
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

  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      const newYear = date.format("YYYY");
      const newMonth = parseInt(date.format("MM"));
      setParams((prev) => ({
        ...prev,
        year: newYear,
        month_num: newMonth,
        page: 1,
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        year: String(currentYear),
        month_num: currentMonth,
        page: 1,
      }));
    }
  };

  return (
    <>
      {modalVisible && (
        <Modal open={modalVisible} update={update} handleCancel={handleCancel} />
      )}
      <div className="wrapper">
        <h1>{t("monthly_kpi")}</h1>
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <DatePicker
              picker="month"
              format="YYYY-MM"
              onChange={handleDateChange}
              placeholder={t("select_month")}
              style={{ width: 150 }}
              allowClear
            />
          </Col>
          {super_user === "true" && (
            <Col>
              <Button
                type="primary"
                className="btn"
                onClick={() => setModalVisible(true)}
              >
                {t("create")}
              </Button>
            </Col>
          )}
        </Row>
      </div>
      <Table
        data={data?.result}
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
        rowClassName="clickable-row"
        onRow={(record: any) => ({
          onClick: () =>
            navigate(`/layout/monthly-kpi/${record.id}/${params.year}/${params.month_num}`),
        })}
      />
    </>
  );
};

export default Index;