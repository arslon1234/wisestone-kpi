import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSingleItem } from "@hooks";
import { Table } from "@components";
import { Card, Collapse } from "antd";

const { Panel } = Collapse;

const Index = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const lang = localStorage.getItem("lang");
  const { data, isLoading } = useSingleItem<any>("kpi-parents", id);
  
  console.log(data?.data?.divisions);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("division"),
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
            title={criterion?.name_en}
            style={{ marginBottom: 8 }}
            extra={<p>{criterion.total_ratio}%</p>}
          >
            <Collapse>
              {criterion.factors?.map((factor: any) => (
                <Panel extra={<p>{factor.ratio}%</p>} header={factor.name_en} key={factor.id} style={{paddingLeft: "10px"}}>
                  <ol>
                    {factor.factor_indicators
                      ?.sort((a: any, b: any) => a.order - b.order) 
                      .map((indicator: any, index: number) => (
                        <li key={indicator.id} style={{display: "flex", justifyContent: "space-between"}}>
                            <span>{index + 1}. {indicator.name_en}</span>
                            <span>{indicator.progress_range}%</span>
                        </li>
                      ))}
                  </ol>
                </Panel>
              ))}
            </Collapse>
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
