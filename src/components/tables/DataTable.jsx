import { Table } from "antd";

export default function DataTable({ columns, data, loading, pagination, onChange }) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={onChange} // Nhận event sort/filter
      rowKey="id"
    />
  );
}
