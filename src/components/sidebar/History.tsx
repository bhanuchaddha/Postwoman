import React from 'react';
import { List, Typography, Empty, Space, Tag } from 'antd';
import { ApiOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { RequestHistory } from '../../types';
import { useAppContext } from '../../store/AppContext';

const { Text } = Typography;

interface HistoryProps {
  history: RequestHistory[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const { updateActiveRequest } = useAppContext();

  // Load request from history
  const handleItemClick = (item: RequestHistory) => {
    updateActiveRequest(item.request);
  };

  // Format timestamp to human-readable format
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get status color based on response status code
  const getStatusColor = (statusCode: number | undefined) => {
    if (!statusCode) return 'default';
    
    if (statusCode >= 200 && statusCode < 300) {
      return 'success';
    } else if (statusCode >= 300 && statusCode < 400) {
      return 'processing';
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'warning';
    } else if (statusCode >= 500) {
      return 'error';
    }
    
    return 'default';
  };

  if (history.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No request history"
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div className="history">
      <List
        itemLayout="horizontal"
        dataSource={history}
        renderItem={item => (
          <List.Item 
            onClick={() => handleItemClick(item)}
            style={{ cursor: 'pointer', padding: '8px 16px' }}
          >
            <List.Item.Meta
              avatar={<ApiOutlined style={{ fontSize: 16 }} />}
              title={
                <Space>
                  <Tag color={item.request.method === 'GET' ? 'blue' : 
                         item.request.method === 'POST' ? 'green' :
                         item.request.method === 'PUT' ? 'orange' :
                         item.request.method === 'DELETE' ? 'red' : 'default'}>
                    {item.request.method}
                  </Tag>
                  <Text ellipsis style={{ maxWidth: 180 }}>
                    {item.request.url}
                  </Text>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <ClockCircleOutlined /> {formatTimestamp(item.timestamp)}
                  </Text>
                  {item.response && (
                    <Tag color={getStatusColor(item.response.status)}>
                      {item.response.status} {item.response.statusText}
                    </Tag>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default History;