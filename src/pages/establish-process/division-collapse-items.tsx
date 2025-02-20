import { useCallback, useEffect, useState } from "react";
import { Button, Collapse, Card, Spin, Empty, Tooltip } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { useTranslation } from "react-i18next";
import { ConfirmDelete } from "@components";
import { useApiMutation, useApiQuery } from "@hooks";
import CriteriaModal from "./criteria-modal";
import FactorModal from "./factor-modal";
import Factors from './factor'
interface DivisionCollapseItemsProps {
  divisions: any[];
  updateItem: (item: any) => void;
}
const DivisionCollapseItems = ({
  divisions,
  updateItem,
}: DivisionCollapseItemsProps) => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang");
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [factor_modal, setFactorModal] = useState(false);
  const [update, setUpdate] = useState(null);
  const [criteria_id, setCriteriaId] = useState();
  const [division_id, setDivisionId] = useState();
  const [criteriaParams, setCriteriaParams] = useState<{
    division_id?: string;
  }>({});

  const {
    data: criteriaData,
    isLoading: isCriteriaLoading,
    refetch: refetchCriteria,
  } = useApiQuery<{ message: string; data: any }>({
    url: "kpi-criterions",
    method: "GET",
    params: criteriaParams,
    enabled: false,
  });
  useEffect(() => {
    if (activeKeys.length > 0) {
      const lastOpenedDivisionId = activeKeys[activeKeys.length - 1];
      setCriteriaParams({ division_id: lastOpenedDivisionId });
      refetchCriteria();
    }
  }, [activeKeys, refetchCriteria]);
  const { mutate: deleteDivision } = useApiMutation({
    url: "kpi-divisions",
    method: "DELETE",
  });
  const { mutate: deleteCriteria } = useApiMutation({
    url: "kpi-criterions",
    method: "DELETE",
  });
  const handleCollapseChange = useCallback((keys: string | string[]) => {
    const newActiveKeys = Array.isArray(keys) ? keys : [keys];
    setActiveKeys(newActiveKeys);
  }, []);
  const handleCancel = () => {
    setModal(false);
    setUpdate(null);
  };
  const handleOpen = (id: any) => {
    setModal(true);
    setDivisionId(id);
  };
  const handleOpenFactor =(id:any)=>{
    setCriteriaId(id)
    setFactorModal(true)
  }
  const handleUpdate = (item: any) => {
    setUpdate(item);
    setModal(true);
  };
  const handleCancelFactorModal =()=>{
    setFactorModal(false)
  }
  const collapseItems: CollapseProps["items"] = divisions.map(
    (division: any) => ({
      key: String(division.id),
      label: lang == "en" ? division.name_en : division.name_kr,
      children: (
        <div className="division-content">
          <div className="collapse-actions">
            <Tooltip title={t("update_division")}>
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => updateItem(division)}
              />
            </Tooltip>
            <ConfirmDelete
              id={division.id}
              deleteItem={(id: any) => deleteDivision({ id })}
              title="delete_division"
            />
            <Tooltip
              title={
                lang == "en"
                  ? division?.description_en
                  : division?.description_kr
              }
              placement="bottom"
            >
              <Button type="default" icon={<InfoCircleOutlined />} />
            </Tooltip>
          </div>
          <h3>{t("criteria")}</h3>
          {isCriteriaLoading ? (
            <Spin tip={t("loading_criteria")}>
              <div className="content" />
            </Spin>
          ) : criteriaData?.data?.items?.length ? (
            criteriaData.data.items.map((criterion: any) => (
              <Card
                hoverable
                key={criterion.id}
                extra={
                  <div className="ratio_actions">
                    <p>
                      Total ratio:{" "}
                      <span style={{ fontSize: "20px" }}>
                        {criterion.total_ratio + "%"}
                      </span>
                    </p>
                  </div>
                }
                actions={[
                  <Tooltip title={t("add_factor")}>
                    <Button
                      type="default"
                      onClick={() => handleOpenFactor(criterion.id)}
                      icon={<PlusCircleOutlined />}
                    ></Button>
                  </Tooltip>,
                  <ConfirmDelete
                    id={criterion.id}
                    deleteItem={(id: any) => deleteCriteria({ id })}
                    title="delete_criteria"
                  />,
                  <Tooltip title={t("update_criteria")}>
                    <Button
                      type="default"
                      onClick={() => handleUpdate(criterion)}
                      icon={<EditOutlined />}
                    ></Button>
                  </Tooltip>,
                  <Tooltip
                    title={
                      lang == "en"
                        ? criterion?.description_en
                        : criterion?.description_kr
                    }
                    placement="bottom"
                  >
                    <Button type="default" icon={<InfoCircleOutlined />} />
                  </Tooltip>,
                ]}
                title={lang == "en" ? criterion.name_en : criterion.name_kr}
                className="criterion-card"
              >
                <h3>{t('factors')}</h3>
                {criterion.id && <Factors id={criterion.id}/>}
              </Card>
            ))
          ) : (
            <Empty description={t("no_criteria_found")} />
          )}
          <Button
            onClick={() => handleOpen(division?.id)}
            icon={<PlusCircleOutlined />}
            className="add-button"
          >
            {t("add_criteria")}
          </Button>
        </div>
      ),
    })
  );

  return (
    <>
      {modal && (
        <CriteriaModal
          open={modal}
          id={division_id}
          update={update}
          handleCancel={handleCancel}
        />
      )}
      {factor_modal && (
        <FactorModal
          open={factor_modal}
          id={criteria_id}
          update={update}
          handleCancel={handleCancelFactorModal}
        />
      )}
      <Collapse items={collapseItems} onChange={handleCollapseChange} />
    </>
  );
};

export default DivisionCollapseItems;
