import React from 'react';
import { Radio, Select, Space } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-github';
import KeyValueEditor from '../common/KeyValueEditor';
import { RequestBody as RequestBodyType } from '../../types';

const { Option } = Select;

interface RequestBodyProps {
  body: RequestBodyType;
  onChange: (body: RequestBodyType) => void;
}

const RequestBody: React.FC<RequestBodyProps> = ({ body, onChange }) => {
  const handleTypeChange = (e: any) => {
    const type = e.target.value;
    let newBody: RequestBodyType = {
      type,
      content: null
    };

    if (type === 'raw') {
      newBody.rawType = 'json';
      newBody.content = '';
    } else if (type === 'form-data' || type === 'x-www-form-urlencoded') {
      newBody.formData = [];
    }

    onChange(newBody);
  };

  const handleRawTypeChange = (rawType: string) => {
    onChange({
      ...body,
      rawType: rawType as 'text' | 'json' | 'xml' | 'javascript'
    });
  };

  const handleRawContentChange = (content: string) => {
    onChange({
      ...body,
      content
    });
  };

  const handleFormDataChange = (formData: any[]) => {
    onChange({
      ...body,
      formData
    });
  };

  // Render appropriate editor based on body type
  const renderBodyEditor = () => {
    switch (body.type) {
      case 'none':
        return <p>This request does not have a body</p>;

      case 'raw':
        const mode = body.rawType === 'json' ? 'json'
          : body.rawType === 'xml' ? 'xml'
          : body.rawType === 'javascript' ? 'javascript'
          : 'text';

        return (
          <div>
            <Select
              value={body.rawType || 'text'}
              onChange={handleRawTypeChange}
              style={{ width: 120, marginBottom: 8 }}
            >
              <Option value="text">Text</Option>
              <Option value="json">JSON</Option>
              <Option value="javascript">JavaScript</Option>
              <Option value="xml">XML</Option>
            </Select>
            <AceEditor
              mode={mode}
              theme="github"
              value={body.content as string || ''}
              onChange={handleRawContentChange}
              name="body-editor"
              width="100%"
              height="300px"
              editorProps={{ $blockScrolling: true }}
            />
          </div>
        );

      case 'form-data':
      case 'x-www-form-urlencoded':
        return (
          <KeyValueEditor
            items={body.formData || []}
            onChange={handleFormDataChange}
            placeholder={{ key: 'Key', value: 'Value' }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="request-body">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Radio.Group onChange={handleTypeChange} value={body.type}>
          <Radio value="none">None</Radio>
          <Radio value="form-data">Form Data</Radio>
          <Radio value="x-www-form-urlencoded">x-www-form-urlencoded</Radio>
          <Radio value="raw">Raw</Radio>
          <Radio value="binary" disabled>Binary (coming soon)</Radio>
        </Radio.Group>

        <div style={{ marginTop: 16 }}>
          {renderBodyEditor()}
        </div>
      </Space>
    </div>
  );
};

export default RequestBody;