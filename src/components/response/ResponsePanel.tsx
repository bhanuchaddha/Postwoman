import React from 'react';
import { Tabs, Badge, Typography, Card, Divider } from 'antd';
import ResponseBody from './ResponseBody';
import ResponseHeaders from './ResponseHeaders';
import { Response } from '../../types';

const { Text } = Typography;

interface ResponsePanelProps {
  response: Response | null;
  isLoading: boolean;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, isLoading }) => {
  if (isLoading) {
    return (
      <div className="response-panel loading">
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="loader"></div>
            <p style={{ color: 'var(--pink-dark)', marginTop: 16 }}>
              <span className="emoji-badge">⏳</span>
              Waiting for response... sending sparkles ✨
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="response-panel empty">
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, color: 'var(--pink-medium)', marginBottom: 16 }}>
              💌
            </div>
            <p style={{ color: 'var(--pink-dark)' }}>
              Send a request to see the response ✨
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Determine status icon and color based on status code
  const getStatusDisplay = () => {
    const statusCode = response.status;
    
    if (statusCode >= 200 && statusCode < 300) {
      return {
        icon: '✅',
        color: 'success',
        text: 'Success'
      };
    } else if (statusCode >= 300 && statusCode < 400) {
      return {
        icon: '↪️',
        color: 'processing',
        text: 'Redirection'
      };
    } else if (statusCode >= 400 && statusCode < 500) {
      return {
        icon: '⚠️',
        color: 'warning',
        text: 'Client Error'
      };
    } else if (statusCode >= 500) {
      return {
        icon: '❌',
        color: 'error',
        text: 'Server Error'
      };
    } else {
      return {
        icon: '❓',
        color: 'default',
        text: 'Unknown'
      };
    }
  };

  const statusDisplay = getStatusDisplay();

  const tabItems = [
    {
      key: 'body',
      label: (
        <span>
          <span className="emoji-badge">📄</span>
          Body
        </span>
      ),
      children: <ResponseBody body={response.body} />
    },
    {
      key: 'headers',
      label: (
        <span>
          <span className="emoji-badge">📝</span>
          Headers
        </span>
      ),
      children: <ResponseHeaders headers={response.headers} />
    }
  ];

  return (
    <div className="response-panel">
      <Card>
        <div className="response-summary" style={{ marginBottom: 16 }}>
          <Badge 
            status={statusDisplay.color as any}
            text={
              <Text strong style={{ fontSize: 16, color: 'var(--pink-dark)' }}>
                <span style={{ marginRight: 8 }}>{statusDisplay.icon}</span>
                {response.status} {response.statusText}
              </Text>
            }
          />
          
          <Divider type="vertical" />
          
          <Text type="secondary">
            <span className="emoji-badge">⏱️</span>
            {response.time} ms
          </Text>
          
          <Divider type="vertical" />
          
          <Text type="secondary">
            <span className="emoji-badge">📏</span>
            Size: {(response.size / 1024).toFixed(2)} KB
          </Text>
        </div>
        
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default ResponsePanel;