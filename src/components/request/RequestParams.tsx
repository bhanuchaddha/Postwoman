import React from 'react';
import KeyValueEditor from '../common/KeyValueEditor';
import { Param } from '../../types';

interface RequestParamsProps {
  params: Param[];
  onChange: (params: Param[]) => void;
}

const RequestParams: React.FC<RequestParamsProps> = ({ params, onChange }) => {
  return (
    <div className="request-params">
      <KeyValueEditor 
        items={params} 
        onChange={onChange} 
        placeholder={{ key: 'Parameter', value: 'Value' }}
      />
    </div>
  );
};

export default RequestParams;