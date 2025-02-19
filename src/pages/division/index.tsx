import { useState } from "react"
import { Button, Spin, Empty } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import DivisionModal from "./division-modal"
import DivisionCollapseItems from "./division-collapse-items"
import { useApiQuery } from "@hooks"
import "./style.css"

const ManageYearlyKPI = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [modal_d, setModal_d] = useState<boolean>(false)
  const [update, setUpdate] = useState(null)
  const [divisionParams] = useState({
    parent_id: id,
  })
  const { data: divisionData, isLoading: isDivisionsLoading } = useApiQuery<{
    message: string
    data: any
  }>({
    url: "kpi-divisions",
    method: "GET",
    params: divisionParams,
  })

  const updateItem = (item: any) => {
    setUpdate(item)
    setModal_d(true)
  }
  const handleCancel = () => {
    setModal_d(false)
    setUpdate(null)
  }

  return (
    <div className="container">
      {modal_d && <DivisionModal open={modal_d} update={update} handleCancel={handleCancel} />}
      <div className="section">
        <div className="header">
          <h2>{t('divisions')}</h2>
          <Button onClick={() => setModal_d(true)} icon={<PlusCircleOutlined />} className="add-button">
            {t('add_divisions')}
          </Button>
        </div>
        {isDivisionsLoading ? (
          <Spin tip={t('loading_divisions')}>
            <div className="content" />
          </Spin>
        ) : divisionData?.data?.items?.length ? (
          <DivisionCollapseItems
            divisions={divisionData.data.items}
            updateItem={updateItem}
          />
        ) : (
          <Empty description={t('no_divisions_found')} />
        )}
      </div>
    </div>
  )
}

export default ManageYearlyKPI

