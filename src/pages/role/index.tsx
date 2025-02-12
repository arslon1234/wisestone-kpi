import { Button } from "antd"
import { useTranslation } from "react-i18next";
import { useState } from "react"
import Modal from './modal'
import './style.css'
const Index = () => {
  const {t} = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <>
    <Modal open={modalVisible} handleCancel={()=>setModalVisible(false)}/>
    <div className="wrapper">
        <h1>{t('role')}</h1>
        <Button type="primary" className="btn" onClick={()=>setModalVisible(true)}>
          {t('create_role')}
        </Button>
    </div>
    </>
  )
}

export default Index
