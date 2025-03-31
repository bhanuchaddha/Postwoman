import React from 'react';
import { Input, Select, Button, Space } from 'antd';
import { SendOutlined, RocketOutlined } from '@ant-design/icons';
import { HttpMethod } from '../../types';

const { Option } = Select;

interface RequestUrlBarProps {
  url: string;
  method: HttpMethod;
  onUrlChange: (url: string) => void;
  onMethodChange: (method: HttpMethod) => void;
  onSend: () => void;
  isLoading: boolean;
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

// Method to emoji mapping
const methodEmojis: Record<HttpMethod, string> = {
  GET: '🔍',
  POST: '📝',
  PUT: '✏️',
  DELETE: '🗑️',
  PATCH: '🩹',
  OPTIONS: '⚙️',
  HEAD: '👀'
};

const RequestUrlBar: React.FC<RequestUrlBarProps> = ({
  url,
  method,
  onUrlChange,
  onMethodChange,
  onSend,
  isLoading
}) => {
  return (
    <div className="request-url-bar">
      <Space.Compact style={{ width: '100%' }}>
        <Select
          value={method}
          onChange={value => onMethodChange(value as HttpMethod)}
          style={{ 
            width: 130,
            borderTopLeftRadius: 'var(--border-radius)',
            borderBottomLeftRadius: 'var(--border-radius)'
          }}
          data-testid="method-select"
          dropdownStyle={{ borderRadius: 'var(--border-radius)' }}
        >
          {HTTP_METHODS.map(httpMethod => (
            <Option 
              key={httpMethod} 
              value={httpMethod} 
              data-testid={`method-option-${httpMethod}`}
            >
              <span style={{ marginRight: 6 }}>{methodEmojis[httpMethod]}</span>
              {httpMethod}
            </Option>
          ))}
        </Select>

        <Input
          placeholder="✨ Enter request URL"
          value={url}
          onChange={e => onUrlChange(e.target.value)}
          onPressEnter={onSend}
          data-testid="url-input"
          style={{ borderColor: 'var(--pink-medium)' }}
        />

        <Button
          type="primary"
          icon={<RocketOutlined />}
          onClick={onSend}
          loading={isLoading}
          data-testid="send-button"
          className="send-button"
          style={{ 
            borderTopRightRadius: 'var(--border-radius)',
            borderBottomRightRadius: 'var(--border-radius)'
          }}
        >
          {isLoading ? 'Sending...' : 'Send ✨'}
        </Button>
      </Space.Compact>
    </div>
  );
};

export default RequestUrlBar;