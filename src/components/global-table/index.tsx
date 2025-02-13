import { Table as AntdTable } from 'antd';
import type { TablePaginationConfig } from 'antd';
interface CustomTableProps {
  data: any[];
  pagination: TablePaginationConfig;
  onChange: (pagination: TablePaginationConfig) => void;
  columns: any[];
  loading?: boolean
}

const Index = ({ data, pagination, onChange, columns, loading }: CustomTableProps) => {
  return (
    <AntdTable
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pagination) => onChange(pagination)}
      rowKey={(record) => record.id || `${record.name}_${Math.random()}`}  // Ensure a unique key
      bordered
      loading={loading}
    />
  );
};

export default Index;
