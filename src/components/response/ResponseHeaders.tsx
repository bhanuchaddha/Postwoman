import React from 'react';
import { Table } from 'antd';

interface ResponseHeadersProps {
  headers: Record<string, string>;
}

const ResponseHeaders: React.FC<ResponseHeadersProps> = ({ headers }) => {
  const columns = [
    {
      title: 'Header',
      dataIndex: 'headerKey',
      key: 'headerKey',
      width: '40%',
    },
    {
      title: 'Value',
      dataIndex: 'headerValue',
      key: 'headerValue',
      width: '60%',
    },
  ];
  
  const dataSource = Object.entries(headers).map(([key, value], index) => ({
    key: index,
    headerKey: key,
    headerValue: value,
  }));

  return (
    <div className="response-headers">
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        pagination={false} 
        size="small"
        bordered
      />
    </div>
  );
};

export default ResponseHeaders;