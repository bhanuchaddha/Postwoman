import React from 'react';
import KeyValueEditor from '../common/KeyValueEditor';
import { Header } from '../../types';

interface RequestHeadersProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

const RequestHeaders: React.FC<RequestHeadersProps> = ({ headers, onChange }) => {
  return (
    <div className="request-headers">
      <KeyValueEditor 
        items={headers} 
        onChange={onChange} 
        placeholder={{ key: 'Header', value: 'Value' }}
      />
    </div>
  );
};

export default RequestHeaders;