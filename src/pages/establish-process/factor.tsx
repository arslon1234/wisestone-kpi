import { Button, Collapse, Spin, Tooltip } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useApiQuery } from "@hooks";

const Index = ({ id }: { id: string | number }) => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang");
  const { data, isLoading } = useApiQuery<{ message: string; data: any }>({
    url: "kpi-factors",
    method: "GET",
    params: { criterion_id: id },
  });

  if (isLoading) return <Spin />;

  const collapseItems = data?.data.items?.map((item: any) => ({
    key: item.id,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{lang == "en" ? item.name_en : item.name_kr}</span>
        <span>{item.ratio}%</span>
      </div>
    ),
    children: (
      <div>
        <div className="indicator-actions">
          <Tooltip title={t("add_indicator")}>
            <Button type="default" icon={<PlusCircleOutlined />}></Button>
          </Tooltip>
          <Tooltip title={t("update_indicator")}>
            <Button
              type="default"
            //   onClick={() => handleUpdate(criterion)}
              icon={<EditOutlined />}
            ></Button>
          </Tooltip>
        </div>
      </div>
    ),
  }));

  return <Collapse items={collapseItems} />;
};

export default Index;
