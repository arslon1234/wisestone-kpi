import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
interface ConfirmDelete {
  id: number | string;
  deleteItem: (id: string | number) => void;
  title?: string
}
const Index = ({ id, deleteItem, title = "delete"}: ConfirmDelete) => {
  const { t } = useTranslation()
  const handleDelete = () => {
    deleteItem(id);
  };
  return (
    <>
      <Popconfirm
        title={t('delete_task')}
        description={t('delete_desc')}
        okText={t('yes')}
        cancelText={t('no')}
        onConfirm={handleDelete}
      >
        <Tooltip title={t(title)}>
          <Button danger icon={<DeleteOutlined />}></Button>
        </Tooltip>
      </Popconfirm>
    </>
  );
};
export default Index;
