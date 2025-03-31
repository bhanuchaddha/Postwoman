import React, { useState } from 'react';
import { List, Typography, Empty, Button, Modal } from 'antd';
import { SettingOutlined, EditOutlined } from '@ant-design/icons';
import { Environment, EnvironmentVariable } from '../../types';
import { useAppContext } from '../../store/AppContext';
import KeyValueEditor from '../common/KeyValueEditor';

const { Text } = Typography;

interface EnvironmentsProps {
  environments: Environment[];
}

const Environments: React.FC<EnvironmentsProps> = ({ environments }) => {
  const { 
    activeEnvironment, 
    setActiveEnvironment,
    updateEnvironmentVariable 
  } = useAppContext();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment | null>(null);
  const [variables, setVariables] = useState<EnvironmentVariable[]>([]);

  // Select an environment
  const handleEnvironmentSelect = (environment: Environment) => {
    setActiveEnvironment(environment.id);
  };

  // Open edit modal for environment variables
  const handleEditEnvironment = (environment: Environment) => {
    setCurrentEnvironment(environment);
    setVariables([...environment.variables]);
    setIsEditModalVisible(true);
  };

  // Save environment variables
  const handleSaveVariables = () => {
    if (!currentEnvironment) return;
    
    // Update all variables
    variables.forEach(variable => {
      updateEnvironmentVariable(
        currentEnvironment.id,
        variable.key,
        variable.value,
        variable.enabled
      );
    });
    
    setIsEditModalVisible(false);
  };

  if (environments.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No environments"
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div className="environments">
      <List
        itemLayout="horizontal"
        dataSource={environments}
        renderItem={env => (
          <List.Item 
            style={{ 
              cursor: 'pointer', 
              padding: '8px 16px',
              backgroundColor: activeEnvironment?.id === env.id ? '#f0f5ff' : 'transparent'
            }}
            onClick={() => handleEnvironmentSelect(env)}
            actions={[
              <Button 
                icon={<EditOutlined />} 
                type="text" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEnvironment(env);
                }}
              />
            ]}
          >
            <List.Item.Meta
              avatar={<SettingOutlined style={{ fontSize: 16 }} />}
              title={env.name}
              description={
                <Text type="secondary">
                  {env.variables.length} variables
                </Text>
              }
            />
          </List.Item>
        )}
      />
      
      <Modal
        title={`Edit Environment: ${currentEnvironment?.name}`}
        open={isEditModalVisible}
        onOk={handleSaveVariables}
        onCancel={() => setIsEditModalVisible(false)}
        width={800}
      >
        {currentEnvironment && (
          <KeyValueEditor
            items={variables}
            onChange={setVariables}
            placeholder={{ key: 'Variable', value: 'Value' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Environments;