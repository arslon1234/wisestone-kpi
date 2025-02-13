import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
interface ConfirmDelete {
  id: number | string;
  deleteItem: (id: string | number) => void;
}
const Index = ({ id, deleteItem }: ConfirmDelete) => {
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
        <Tooltip title={t('delete')}>
          <Button danger icon={<DeleteOutlined />}></Button>
        </Tooltip>
      </Popconfirm>
    </>
  );
};
export default Index;
