import React, { useState } from 'react';
import { Menu, Typography, Button, Input, Modal, Layout } from 'antd';
import {
  FolderOutlined,
  HistoryOutlined,
  PlusOutlined,
  GlobalOutlined,
  HeartOutlined
} from '@ant-design/icons';
import Collections from './Collections';
import History from './History';
import Environments from './Environments';
import { useAppContext } from '../../store/AppContext';

const { Sider } = Layout;
const { Text, Title } = Typography;

const SidebarContainer: React.FC = () => {
  const { 
    collections, 
    history, 
    environments,
    addCollection,
    addEnvironment
  } = useAppContext();
  
  const [selectedKey, setSelectedKey] = useState('collections');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addModalType, setAddModalType] = useState<'collection' | 'environment'>('collection');
  const [newItemName, setNewItemName] = useState('');

  // Handle menu item selection
  const handleMenuSelect = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  // Show add modal (either for collection or environment)
  const showAddModal = (type: 'collection' | 'environment') => {
    setAddModalType(type);
    setNewItemName('');
    setIsAddModalVisible(true);
  };

  // Handle add button for current section
  const handleAddClick = () => {
    if (selectedKey === 'collections') {
      showAddModal('collection');
    } else if (selectedKey === 'environments') {
      showAddModal('environment');
    }
  };

  // Handle creating a new collection or environment
  const handleAddConfirm = () => {
    if (newItemName.trim() === '') return;
    
    if (addModalType === 'collection') {
      addCollection(newItemName);
    } else {
      addEnvironment(newItemName);
    }
    
    setIsAddModalVisible(false);
    setNewItemName('');
  };

  // Render the active section content
  const renderContent = () => {
    switch (selectedKey) {
      case 'collections':
        return <Collections collections={collections} />;
      case 'history':
        return <History history={history} />;
      case 'environments':
        return <Environments environments={environments} />;
      default:
        return null;
    }
  };

  return (
    <Sider 
      width={300} 
      theme="light"
      style={{ 
        height: '100vh', 
        borderRight: '1px solid var(--pink-medium)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="sidebar-header">
          <Title level={4} className="sidebar-title" style={{ margin: 0 }}>
            <span className="emoji-badge">💅</span>
            Postwoman
          </Title>
          <HeartOutlined style={{ fontSize: 20, color: 'var(--pink-primary)' }} />
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onSelect={handleMenuSelect}
          style={{ flex: 'none', borderRight: 0 }}
        >
          <Menu.Item key="collections" icon={<span className="emoji-badge">📚</span>}>
            Collections
          </Menu.Item>
          <Menu.Item key="history" icon={<span className="emoji-badge">⏱️</span>}>
            History
          </Menu.Item>
          <Menu.Item key="environments" icon={<span className="emoji-badge">🌈</span>}>
            Environments
          </Menu.Item>
        </Menu>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '8px 16px',
          borderTop: '1px solid var(--pink-medium)',
          borderBottom: '1px solid var(--pink-medium)',
          backgroundColor: 'var(--pink-light)'
        }}>
          <Text strong style={{ color: 'var(--pink-dark)' }}>{
            selectedKey === 'collections' ? '📚 COLLECTIONS' : 
            selectedKey === 'history' ? '⏱️ HISTORY' : '🌈 ENVIRONMENTS'
          }</Text>
          
          {selectedKey !== 'history' && (
            <Button 
              type="text" 
              icon={<PlusOutlined />} 
              onClick={handleAddClick}
              size="small"
              style={{ color: 'var(--pink-primary)' }}
            />
          )}
        </div>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          {renderContent()}
        </div>
      </div>
      
      <Modal
        title={`Add New ${addModalType === 'collection' ? 'Collection ✨' : 'Environment 🌈'}`}
        open={isAddModalVisible}
        onOk={handleAddConfirm}
        onCancel={() => setIsAddModalVisible(false)}
        okButtonProps={{ style: { backgroundColor: 'var(--pink-primary)' } }}
      >
        <Input
          placeholder={`Enter ${addModalType} name`}
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          autoFocus
          prefix={addModalType === 'collection' ? '📚 ' : '🌈 '}
        />
      </Modal>
    </Sider>
  );
};

export default SidebarContainer;