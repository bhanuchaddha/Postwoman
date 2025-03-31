import React from 'react';
import { Table, Input, Button, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

interface KeyValuePair {
  id?: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  placeholder?: {
    key?: string;
    value?: string;
  };
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  items,
  onChange,
  placeholder = { key: 'Key', value: 'Value' }
}) => {
  // Add new empty row
  const handleAddRow = () => {
    const newItem: KeyValuePair = {
      id: uuidv4(),
      key: '',
      value: '',
      enabled: true
    };
    onChange([...items, newItem]);
  };

  // Delete row
  const handleDeleteRow = (id: string | undefined) => {
    if (!id) return;
    onChange(items.filter(item => item.id !== id));
  };

  // Update row
  const handleChange = (id: string | undefined, field: keyof KeyValuePair, value: any) => {
    if (!id) return;
    onChange(
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const columns = [
    {
      title: '',
      dataIndex: 'enabled',
      width: '40px',
      render: (enabled: boolean, record: KeyValuePair) => (
        <Checkbox
          checked={enabled}
          onChange={e => handleChange(record.id, 'enabled', e.target.checked)}
        />
      ),
    },
    {
      title: placeholder.key || 'Key',
      dataIndex: 'key',
      render: (text: string, record: KeyValuePair) => (
        <Input
          placeholder={placeholder.key || 'Key'}
          value={text}
          onChange={e => handleChange(record.id, 'key', e.target.value)}
        />
      ),
    },
    {
      title: placeholder.value || 'Value',
      dataIndex: 'value',
      render: (text: string, record: KeyValuePair) => (
        <Input
          placeholder={placeholder.value || 'Value'}
          value={text}
          onChange={e => handleChange(record.id, 'value', e.target.value)}
        />
      ),
    },
    {
      title: '',
      dataIndex: 'operation',
      width: '60px',
      render: (_: any, record: KeyValuePair) => (
        <Button
          icon={<DeleteOutlined />}
          type="text"
          danger
          onClick={() => handleDeleteRow(record.id)}
        />
      ),
    },
  ];

  // Ensure all items have IDs
  const itemsWithIds = items.map(item => ({
    ...item,
    id: item.id || uuidv4()
  }));

  return (
    <div className="key-value-editor">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={itemsWithIds}
        pagination={false}
        size="small"
        bordered
      />
      <Button
        icon={<PlusOutlined />}
        type="dashed"
        onClick={handleAddRow}
        style={{ marginTop: 8, width: '100%' }}
      >
        Add
      </Button>
    </div>
  );
};

export default KeyValueEditor;