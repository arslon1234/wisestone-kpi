import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
import { useSingleItem } from "@hooks";
import { Table } from "@components";
import { Card, Collapse, Checkbox } from "antd";
import { useState } from "react";

const Index = () => {
  const { t } = useTranslation();
  // const { id } = useParams();
  const lang = localStorage.getItem("lang");
  const { data, isLoading } = useSingleItem<any>("kpi-parents/single", { type: "team" });

  const [selectedIndicators, setSelectedIndicators] = useState<
    { factorId: string; indicatorId: string }[]
  >([]);

  console.log(data?.data?.divisions);
  console.log("Selected Indicators:", selectedIndicators);

  const handleCheckboxChange = (factorId: string, indicatorId: string, checked: boolean) => {
    setSelectedIndicators((prev) => {
      const filtered = prev.filter((item) => item.factorId !== factorId);
      if (checked) {
        return [...filtered, { factorId, indicatorId }];
      }
      return filtered;
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("divisions"),
      dataIndex: lang === "en" ? "name_en" : "name_kr",
    },
    {
      title: t("criteria"),
      dataIndex: "criterions",
      key: "criteria",
      render: (criterions: any[]) =>
        criterions?.map((criterion) => (
          <Card
            key={criterion.id}
            title={lang === "en" ? criterion?.name_en : criterion?.name_kr}
            style={{ marginBottom: 8 }}
            extra={<p>{criterion.total_ratio}%</p>}
          >
            <Collapse
              defaultActiveKey={criterion.factors?.map((factor: any) => factor.id)}
              items={criterion.factors?.map((factor: any) => ({
                key: factor.id,
                label: lang === "en" ? factor.name_en : factor.name_kr,
                extra: <p>{factor.ratio}%</p>,
                children: (
                  <ol>
                    {factor.factor_indicators
                      ?.sort((a: any, b: any) => a.order - b.order)
                      .map((indicator: any, index: number) => (
                        <li
                          key={indicator.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              onChange={(e) =>
                                handleCheckboxChange(factor.id, indicator.id, e.target.checked)
                              }
                              checked={selectedIndicators.some(
                                (item) =>
                                  item.factorId === factor.id && item.indicatorId === indicator.id
                              )}
                            />
                            <span style={{ marginLeft: 8 }}>
                              {index + 1}. {lang === "en" ? indicator.name_en : indicator.name_kr}
                            </span>
                          </span>
                          <span>{indicator.progress_range}%</span>
                        </li>
                      ))}
                  </ol>
                ),
              }))}
            />
          </Card>
        )),
    },
  ];

  const handleTableChange = (pagination: any) => {
    console.log(pagination);
  };

  return (
    <>
      <div className="wrapper">
        <h1>{t("yearly_kpi")}</h1>
      </div>
      <Table
        data={data?.data.divisions}
        columns={columns}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Index;