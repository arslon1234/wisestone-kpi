import { useCallback, useEffect, useState } from "react";
import { Button, Card, Collapse, Empty, Spin, Tooltip } from "antd";
import {
  EditOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useApiMutation, useApiQuery } from "@hooks";
import { ConfirmDelete } from "@components";
import IndicatorModal from "./indicator-modal";
import FactorModal from './factor-modal'
const Index = ({ id }: { id: string | number }) => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang");
  const [modalVisible, setModalVisible] = useState(false);
  const [update, setUpdate] = useState(null);
  const [factorId, setFactorId] = useState();
  const [factor_modal, setFactorModal] = useState(false);
  const [factor_update, setFactorUpdate] = useState(null);
  const [params, setParams] = useState<{ factor_id?: string | number } | null>(
    null
  );

  const { data, isLoading } = useApiQuery<{ message: string; data: any }>({
    url: "kpi-factors",
    method: "GET",
    params: { criterion_id: id },
  });

  const {
    data: indicatorData,
    isLoading: isIndicatorLoading,
    refetch: refetchFactorIndicator,
  } = useApiQuery<{ message: string; data: any }>({
    url: "kpi-factor-indicators",
    method: "GET",
    params: params || {},
    enabled: params !== null,
  });
  const { mutate: deleteIndicator } = useApiMutation({
    url: "kpi-factor-indicators",
    method: "DELETE",
  });
  const { mutate: deleteFactor } = useApiMutation({
    url: "kpi-factors",
    method: "DELETE",
  });
  useEffect(() => {
    if (params !== null) {
      refetchFactorIndicator();
    }
  }, [params, refetchFactorIndicator]);

  const handleCollapseChange = useCallback((keys: string | string[]) => {
    const newActiveKeys = Array.isArray(keys) ? keys : [keys];

    if (newActiveKeys.length > 0) {
      const lastOpenedDivisionId = newActiveKeys[newActiveKeys.length - 1];
      setParams({ factor_id: lastOpenedDivisionId });
    } else {
      setParams(null);
    }
  }, []);

  const handleCancel = () => {
    setModalVisible(false);
    setUpdate(null);
  };
  const handleUpdateFactor =(item: any)=>{
    setFactorUpdate(item)
    setFactorModal(true)
  }
  const handleUpdateIndicator =(item: any)=>{
    setUpdate(item)
    setModalVisible(true)
  }
  const handleCancelFactorModal =()=>{
    setFactorModal(false)
  }
  const handleOpen = (id: any) => {
    setFactorId(id);
    setModalVisible(true);
  };

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
            <Button
              onClick={() => handleOpen(item.id)}
              type="default"
              icon={<PlusCircleOutlined />}
            ></Button>
          </Tooltip>
          <Tooltip title={t("update_factor")}>
            <Button type="default" onClick={()=>handleUpdateFactor(item)} icon={<EditOutlined />}></Button>
          </Tooltip>
          <ConfirmDelete
            id={item.id}
            deleteItem={(id: any) => deleteFactor({ id })}
            title="delete_factor"
          />
        </div>
        {isIndicatorLoading ? (
          <Spin />
        ) : (
          <div className="factor-indicator-actions">
            <h3>{t('factor_indicator')}</h3>
            {indicatorData?.data.items?.length ? (
              indicatorData.data.items.map((item: any) => (
                <Card hoverable key={item.id}>
                  <div className="indicator-card">
                    <p>{lang == "en" ? item.name_en : item.name_kr}</p>
                    <h3>{item.progress_range}%</h3>
                    <div className="indicator-action">
                      <Tooltip title={t("update_indicator")}>
                        <Button onClick={()=>handleUpdateIndicator(item)} type="default" icon={<EditOutlined />}></Button>
                      </Tooltip>
                      <ConfirmDelete
                        id={item.id}
                        deleteItem={(id: any) => deleteIndicator({ id })}
                        title="delete_indicator"
                      />
                      <Tooltip
                        title={
                          lang == "en"
                            ? item?.description_en
                            : item?.description_kr
                        }
                        placement="bottom"
                      >
                        <Button type="default" icon={<InfoCircleOutlined />} />
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
                <Empty description={t("no_factor_indicator_found")} />
            )}
          </div>
        )}
      </div>
    ),
  }));

  return (
    <>
     {modalVisible && (
      <IndicatorModal
        update={update}
        id={factorId}
        open={modalVisible}
        handleCancel={handleCancel}
      />
    )}
     {factor_modal && (
      <FactorModal
        update={factor_update}
        id={id}
        open={factor_modal}
        handleCancel={handleCancelFactorModal}
      />
    )}
    {data?.data.items?.length ? (
      <Collapse
        items={collapseItems}
        onChange={handleCollapseChange}
        defaultActiveKey={[]}
      />
    ) : (
      <Empty description={t("no_factors_found")} />
    )}
    </>
  );
};

export default Index;
