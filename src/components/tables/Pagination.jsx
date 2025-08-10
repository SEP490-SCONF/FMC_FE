import { Pagination } from "antd";

export default function CustomPagination({ current, total, pageSize, onChange }) {
  return (
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      showSizeChanger
    />
  );
}