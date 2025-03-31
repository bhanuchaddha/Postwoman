import React from 'react';
import { Select, Form, Input, Space } from 'antd';
import { Auth } from '../../types';

const { Option } = Select;

interface RequestAuthProps {
  auth: Auth;
  onChange: (auth: Auth) => void;
}

const RequestAuth: React.FC<RequestAuthProps> = ({ auth, onChange }) => {
  const handleTypeChange = (type: string) => {
    // Create a new auth object with the selected type
    const newAuth: Auth = { type: type as Auth['type'] };
    
    // Add default fields based on the auth type
    if (type === 'basic') {
      newAuth.basic = { username: '', password: '' };
    } else if (type === 'bearer') {
      newAuth.bearer = { token: '' };
    } else if (type === 'api-key') {
      newAuth.apiKey = { key: '', value: '', addTo: 'header' };
    }
    
    onChange(newAuth);
  };

  const handleFieldChange = (key: string, value: string) => {
    const newAuth = { ...auth };
    
    if (auth.type === 'basic' && newAuth.basic) {
      newAuth.basic = { ...newAuth.basic, [key]: value };
    } else if (auth.type === 'bearer' && newAuth.bearer) {
      newAuth.bearer = { ...newAuth.bearer, [key]: value };
    } else if (auth.type === 'api-key' && newAuth.apiKey) {
      if (key === 'addTo') {
        newAuth.apiKey = { ...newAuth.apiKey, addTo: value as 'header' | 'queryParam' };
      } else {
        newAuth.apiKey = { ...newAuth.apiKey, [key]: value };
      }
    }
    
    onChange(newAuth);
  };

  // Render fields based on the selected auth type
  const renderAuthFields = () => {
    switch (auth.type) {
      case 'basic':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="Username">
              <Input
                value={auth.basic?.username || ''}
                onChange={e => handleFieldChange('username', e.target.value)}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                value={auth.basic?.password || ''}
                onChange={e => handleFieldChange('password', e.target.value)}
                placeholder="Password"
              />
            </Form.Item>
          </Space>
        );
      
      case 'bearer':
        return (
          <Form.Item label="Token">
            <Input
              value={auth.bearer?.token || ''}
              onChange={e => handleFieldChange('token', e.target.value)}
              placeholder="Token"
            />
          </Form.Item>
        );
      
      case 'api-key':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="Key">
              <Input
                value={auth.apiKey?.key || ''}
                onChange={e => handleFieldChange('key', e.target.value)}
                placeholder="Key"
              />
            </Form.Item>
            <Form.Item label="Value">
              <Input
                value={auth.apiKey?.value || ''}
                onChange={e => handleFieldChange('value', e.target.value)}
                placeholder="Value"
              />
            </Form.Item>
            <Form.Item label="Add to">
              <Select
                value={auth.apiKey?.addTo || 'header'}
                onChange={value => handleFieldChange('addTo', value)}
                style={{ width: '100%' }}
              >
                <Option value="header">Header</Option>
                <Option value="queryParam">Query Param</Option>
              </Select>
            </Form.Item>
          </Space>
        );
      
      default:
        return <p>No authentication selected</p>;
    }
  };

  return (
    <div className="request-auth">
      <Form layout="vertical">
        <Form.Item label="Type">
          <Select 
            value={auth.type} 
            onChange={handleTypeChange}
            style={{ width: '100%' }}
          >
            <Option value="none">No Auth</Option>
            <Option value="basic">Basic Auth</Option>
            <Option value="bearer">Bearer Token</Option>
            <Option value="api-key">API Key</Option>
          </Select>
        </Form.Item>
        
        {auth.type !== 'none' && renderAuthFields()}
      </Form>
    </div>
  );
};

export default RequestAuth;