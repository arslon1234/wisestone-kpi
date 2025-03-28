import { Button, Space, Tooltip, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiQuery, useApiMutation } from "@hooks";
import { Table, ConfirmDelete } from "@components";
import Modal from "./modal";
import { getItem } from "@utils/storage-service";
import { TableOutlined, TagsOutlined } from "@ant-design/icons";

const Index = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [update, setUpdate] = useState(null);
  const currentYear = new Date().getFullYear(); // Joriy yil (masalan, 2025)
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    year__eq: String(currentYear), // Default holatda joriy yil
  });
  const navigate = useNavigate();
  const super_user = getItem("super");

  const { data, isLoading } = useApiQuery<any>({
    url: "yearly-goals",
    method: "GET",
    params,
  });

  const { mutate: deleteItem } = useApiMutation({
    url: "yearly-goals",
    method: "DELETE",
  });

  const handleDelete = (id: any) => {
    deleteItem({ id });
  };

  useEffect(() => {
    const pageFromParams = searchParams.get("page") || "1";
    const limitFromParams = searchParams.get("limit") || "5";
    const yearFromParams = searchParams.get("year__eq") || String(currentYear);
    setParams((prev) => ({
      ...prev,
      page: Number(pageFromParams),
      limit: Number(limitFromParams),
      year__eq: yearFromParams,
    }));
    if (!searchParams.get("year__eq")) {
      setSearchParams({
        page: String(pageFromParams),
        limit: String(limitFromParams),
        year__eq: String(currentYear),
      });
    }
  }, [searchParams, currentYear]);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("year"),
      dataIndex: "year",
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <ConfirmDelete
            id={record.id}
            deleteItem={(id: any) => handleDelete(id)}
          />
          <Tooltip title={t("process")}>
            <Button
              type="default"
              onClick={() => navigate(`/layout/yearly-kpi/${record.id}`)}
              icon={<TagsOutlined />}
            />
          </Tooltip>
          <Tooltip title={t("kpi_establishment")}>
            <Button
              type="default"
              onClick={() => navigate(`/layout/yearly-kpis/${record.year}`)}
              icon={<TableOutlined />}
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
      year__eq: params.year__eq,
    });
  };

  const handleYearChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      year__eq: value,
    }));
    setSearchParams({
      page: "1",
      limit: String(params.limit),
      year__eq: value,
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
    setUpdate(null);
  };

  // Yillar ro‘yxati (2020 dan 2030 yilgacha)
  const years = Array.from({ length: 2030 - 2019 + 1 }, (_, i) => ({
    value: String(2020 + i),
    label: String(2020 + i),
  }));

  return (
    <>
      <Modal open={modalVisible} update={update} handleCancel={handleCancel} />
      <div className="wrapper">
        <h1>{t("yearly_kpi")}</h1>
        <Space>
          {super_user === "true" && (
            <Button
              type="primary"
              className="btn"
              onClick={() => setModalVisible(true)}
            >
              {t("create")}
            </Button>
          )}
          <Select
            placeholder={t("select_year")}
            style={{ width: 120 }}
            onChange={handleYearChange}
            value={params.year__eq || undefined}
          >
            {years.map((year) => (
              <Select.Option key={year.value} value={year.value}>
                {year.label}
              </Select.Option>
            ))}
          </Select>
        </Space>
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
      />
    </>
  );
};

export default Index;