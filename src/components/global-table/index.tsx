import { Table as AntdTable } from 'antd';
import type { TablePaginationConfig,TableProps } from 'antd';
interface CustomTableProps {
  data: any[];
  pagination?: TablePaginationConfig;
  onChange: (pagination: TablePaginationConfig) => void;
  columns: any[];
  loading?: boolean,
  onRow?: TableProps<any>["onRow"]; 
  rowClassName?: string | ((record: any, index: number) => string);
}

const Index = ({ data, pagination, onChange, columns, loading,onRow,rowClassName }: CustomTableProps) => {
  return (
    <AntdTable
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pagination) => onChange(pagination)}
      rowKey={(record) => record.id || `${record.name}_${Math.random()}`}  // Ensure a unique key
      bordered
      loading={loading}
      onRow={onRow}
      rowClassName={rowClassName}
    />
  );
};

export default Index;
