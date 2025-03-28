
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useApiQuery } from "@hooks";
import { Table } from "@components";
import { useParams } from "react-router-dom";
import { CheckCircleOutlined } from '@ant-design/icons';
const Index = () => {
  const { year } = useParams()
  const { t } = useTranslation();
  const [params] = useState({
    page: 1,
    limit: 5,
    year__eq: year
  });
  const { data, isLoading } = useApiQuery<any>({
    url: "yearly-goals",
    method: "GET",
    params,
  });
  const columns = [
    {
      title: t("divisions"),
      dataIndex: "category",
      render: (item: any) => {
        return <span>{item.name}</span>;
      },
    },
    {
      title: `${t("performance_goals")} ${year}`,
      dataIndex: "goal_groups",
      render: (item: any) => {
        return (
          <div>
            {item && item.length > 0 ? (
              item.map((goal: any, index: number) => (
                <div key={index} className="performance_result">
                  <div>
                    <p className="performance_head">
                      <CheckCircleOutlined />
                      <span>{goal.header}</span>
                    </p>
                    <div>
                      {goal.description ? (
                        goal.description.split("\n").map((line: string, i: number) => (
                          <p key={i}>{line}</p>
                        ))
                      ) : (
                        <p>{t("no_description")}</p>
                      )}
                    </div>
                  </div>
                  <p>
                    ({t("total_ratio")} {goal.percent}%)
                  </p>
                </div>
              ))
            ) : (
              <span>{t("no_goals")}</span>
            )}
          </div>
        );
      },
    },
  ];
  const handleTableChange = (pagination: any) => {
   console.log(pagination)
  };
  return (
    <>
      <div className="wrapper">
        <h1>{t("kpi_establishment")} {year}</h1>
      </div>
      <Table
        data={data?.result[0]?.year_goal_categories}
        columns={columns}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Index;
