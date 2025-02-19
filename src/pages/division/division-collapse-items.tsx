import type React from "react"
import { Button, Collapse, Card, Spin, Empty, Tooltip } from "antd"
import { PlusCircleOutlined, EditOutlined, InfoCircleOutlined } from "@ant-design/icons"
import type { CollapseProps } from "antd"
import { useTranslation } from "react-i18next"
import { ConfirmDelete } from "@components"
import { useApiMutation, useApiQuery } from "@hooks"
import { useCallback, useEffect, useState } from "react"

interface DivisionCollapseItemsProps {
  divisions: any[]
  updateItem: (item: any) => void
}

const DivisionCollapseItems: React.FC<DivisionCollapseItemsProps> = ({
  divisions,
  updateItem,
}) => {
  const { t } = useTranslation()
  const [activeKeys, setActiveKeys] = useState<string[]>([])
  const [criteriaParams, setCriteriaParams] = useState<{
    division_id?: string
  }>({})
 
  const {
    data: criteriaData,
    isLoading: isCriteriaLoading,
    refetch: refetchCriteria,
  } = useApiQuery<{ message: string; data: any }>({
    url: "kpi-criterions",
    method: "GET",
    params: criteriaParams,
    enabled: false,
  })
  useEffect(() => {
    if (activeKeys.length > 0) {
      const lastOpenedDivisionId = activeKeys[activeKeys.length - 1]
      setCriteriaParams({ division_id: lastOpenedDivisionId })
      refetchCriteria()
    }
  }, [activeKeys, refetchCriteria])
  const { mutate: deleteDivision } = useApiMutation({
    url: "kpi-divisions",
    method: "DELETE",
  })
  const handleCollapseChange = useCallback((keys: string | string[]) => {
    const newActiveKeys = Array.isArray(keys) ? keys : [keys]
    setActiveKeys(newActiveKeys)
  }, [])
  const collapseItems: CollapseProps["items"] = divisions.map((division: any) => ({
    key: String(division.id),
    label: division.name_en,
    children: (
      <div className="division-content">
        <div className="collapse-actions">
          <Tooltip title={t("update")}>
            <Button type="default" icon={<EditOutlined />} onClick={() => updateItem(division)} />
          </Tooltip>
          <ConfirmDelete id={division.id} deleteItem={(id: any) => deleteDivision({ id })} />
          <Tooltip title={division.description_en} placement="bottom">
            <Button type="default" icon={<InfoCircleOutlined />} />
          </Tooltip>
        </div>
        <p className="mb-4">{division.description}</p>
        <h3>Criteria</h3>
        {isCriteriaLoading ? (
          <Spin tip="Loading criteria...">
            <div className="content" />
          </Spin>
        ) : criteriaData?.data?.items?.length ? (
          criteriaData.data.items.map((criterion: any) => (
            <Card key={criterion.id} className="criterion-card">
              <h4>{criterion.name}</h4>
              {/* Render other criterion details */}
            </Card>
          ))
        ) : (
          <Empty description="No criteria found" />
        )}
        <Button icon={<PlusCircleOutlined />} className="add-button">
          Add Criterion
        </Button>
      </div>
    ),
  }))

  return <Collapse items={collapseItems} onChange={handleCollapseChange}/>
}

export default DivisionCollapseItems

