import React, { useState } from 'react';
import { Tabs } from 'antd';
import RequestParams from './RequestParams';
import RequestHeaders from './RequestHeaders';
import RequestAuth from './RequestAuth';
import RequestBody from './RequestBody';
import { Header, Param, Auth, RequestBody as RequestBodyType } from '../../types';

interface RequestPanelProps {
  params: Param[];
  headers: Header[];
  auth: Auth | null;
  body: RequestBodyType;
  onParamsChange: (params: Param[]) => void;
  onHeadersChange: (headers: Header[]) => void;
  onAuthChange: (auth: Auth) => void;
  onBodyChange: (body: RequestBodyType) => void;
}

const RequestPanel: React.FC<RequestPanelProps> = ({
  params,
  headers,
  auth,
  body,
  onParamsChange,
  onHeadersChange,
  onAuthChange,
  onBodyChange
}) => {
  const [activeKey, setActiveKey] = useState('params');

  const tabItems = [
    {
      key: 'params',
      label: (
        <span>
          <span className="emoji-badge">🔗</span>
          Params
        </span>
      ),
      children: <RequestParams params={params} onChange={onParamsChange} />
    },
    {
      key: 'auth',
      label: (
        <span>
          <span className="emoji-badge">🔐</span>
          Authorization
        </span>
      ),
      children: <RequestAuth auth={auth || { type: 'none' }} onChange={onAuthChange} />
    },
    {
      key: 'headers',
      label: (
        <span>
          <span className="emoji-badge">📋</span>
          Headers
        </span>
      ),
      children: <RequestHeaders headers={headers} onChange={onHeadersChange} />
    },
    {
      key: 'body',
      label: (
        <span>
          <span className="emoji-badge">📦</span>
          Body
        </span>
      ),
      children: <RequestBody body={body} onChange={onBodyChange} />
    }
  ];

  return (
    <div className="request-panel">
      <Tabs 
        activeKey={activeKey} 
        onChange={setActiveKey}
        items={tabItems}
        type="card"
        className="request-tabs"
      />
    </div>
  );
};

export default RequestPanel;