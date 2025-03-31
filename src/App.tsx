import React from 'react';
import { Layout, Button, Input, Divider, Space, Select, Modal, Form } from 'antd';
import { 
  SaveOutlined, 
  PlusOutlined, 
  HeartOutlined, 
  SendOutlined, 
  RocketOutlined 
} from '@ant-design/icons';
import SidebarContainer from './components/sidebar/SidebarContainer';
import RequestUrlBar from './components/request/RequestUrlBar';
import RequestPanel from './components/request/RequestPanel';
import ResponsePanel from './components/response/ResponsePanel';
import { AppProvider, useAppContext } from './store/AppContext';
import 'antd/dist/reset.css';
import './App.css';

const { Header, Content } = Layout;
const { Option } = Select;

const MainApp: React.FC = () => {
  const {
    activeRequest,
    collections,
    currentResponse,
    isLoading,
    updateActiveRequest,
    sendRequest,
    saveRequestToCollection,
    createNewRequest
  } = useAppContext();

  const [saveModalVisible, setSaveModalVisible] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState<string | null>(null);
  const [requestName, setRequestName] = React.useState('');

  // Handle URL change
  const handleUrlChange = (url: string) => {
    updateActiveRequest({ url });
  };

  // Handle HTTP method change
  const handleMethodChange = (method: any) => {
    updateActiveRequest({ method });
  };

  // Send request
  const handleSendRequest = () => {
    sendRequest(activeRequest);
  };

  // Open save modal
  const handleOpenSaveModal = () => {
    setRequestName(activeRequest.name);
    setSelectedCollection(collections.length > 0 ? collections[0].id : null);
    setSaveModalVisible(true);
  };

  // Save request to collection
  const handleSaveRequest = () => {
    if (!selectedCollection) return;

    const requestToSave = {
      ...activeRequest,
      name: requestName
    };

    saveRequestToCollection(selectedCollection, requestToSave);
    setSaveModalVisible(false);
  };

  // Handle request parameters change
  const handleParamsChange = (params: any) => {
    updateActiveRequest({ params });
  };

  // Handle request headers change
  const handleHeadersChange = (headers: any) => {
    updateActiveRequest({ headers });
  };

  // Handle auth change
  const handleAuthChange = (auth: any) => {
    updateActiveRequest({ auth });
  };

  // Handle body change
  const handleBodyChange = (body: any) => {
    updateActiveRequest({ body });
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <SidebarContainer />
      
      <Layout className="main-content">
        <Header className="app-header" style={{ 
          padding: '0 16px', 
          height: 'auto', 
          lineHeight: 'normal',
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px 0'
          }}>
            <Space>
              <Button 
                icon={<PlusOutlined />}
                onClick={createNewRequest}
                style={{ 
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: 'var(--pink-light)',
                  borderColor: 'var(--pink-medium)',
                  color: 'var(--pink-dark)'
                }}
              >
                New Request ✨
              </Button>
              <Button 
                icon={<SaveOutlined />}
                onClick={handleOpenSaveModal}
                style={{ 
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: 'var(--pink-light)',
                  borderColor: 'var(--pink-medium)',
                  color: 'var(--pink-dark)'
                }}
              >
                Save Request 💖
              </Button>
            </Space>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: 'var(--pink-extra-dark)'
            }}>
              <HeartOutlined style={{ fontSize: 16, marginRight: 6, color: 'var(--pink-primary)' }} />
              <span>Postwoman API Tester 💁‍♀️</span>
            </div>
          </div>
          
          <div style={{ marginBottom: 10 }}>
            <Input
              placeholder="✨ Request name"
              value={activeRequest.name}
              onChange={e => updateActiveRequest({ name: e.target.value })}
              style={{ 
                marginBottom: 10, 
                borderRadius: 'var(--border-radius)',
                borderColor: 'var(--pink-medium)'
              }}
              prefix={<span className="emoji-badge">🔮</span>}
            />
            <RequestUrlBar
              url={activeRequest.url}
              method={activeRequest.method}
              onUrlChange={handleUrlChange}
              onMethodChange={handleMethodChange}
              onSend={handleSendRequest}
              isLoading={isLoading}
            />
          </div>
        </Header>
        
        <Content style={{ 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'auto' 
        }}>
          <div style={{ flex: '0 0 auto', marginBottom: 16 }}>
            <RequestPanel
              params={activeRequest.params}
              headers={activeRequest.headers}
              auth={activeRequest.auth}
              body={activeRequest.body}
              onParamsChange={handleParamsChange}
              onHeadersChange={handleHeadersChange}
              onAuthChange={handleAuthChange}
              onBodyChange={handleBodyChange}
            />
          </div>
          
          <Divider style={{ 
            margin: '12px 0', 
            borderColor: 'var(--pink-medium)',
            borderStyle: 'dashed'
          }}>
            <span style={{ color: 'var(--pink-dark)', fontWeight: 'bold', fontSize: 14 }}>
              ✨ Response ✨
            </span>
          </Divider>
          
          <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
            <ResponsePanel
              response={currentResponse}
              isLoading={isLoading}
            />
          </div>
        </Content>
      </Layout>
      
      <Modal
        title={<><span className="emoji-badge">📚</span> Save Request</>}
        open={saveModalVisible}
        onOk={handleSaveRequest}
        onCancel={() => setSaveModalVisible(false)}
        width={600}
        okButtonProps={{ style: { backgroundColor: 'var(--pink-primary)' } }}
      >
        <Form layout="vertical">
          <Form.Item label={<><span className="emoji-badge">🔮</span> Request Name</>}>
            <Input
              value={requestName}
              onChange={e => setRequestName(e.target.value)}
              placeholder="Enter a cute name for your request"
              style={{ borderColor: 'var(--pink-medium)' }}
            />
          </Form.Item>
          
          <Form.Item label={<><span className="emoji-badge">📚</span> Collection</>}>
            <Select
              value={selectedCollection}
              onChange={value => setSelectedCollection(value)}
              style={{ width: '100%' }}
              placeholder="Select collection"
              dropdownStyle={{ borderRadius: 'var(--border-radius)' }}
            >
              {collections.map(collection => (
                <Option key={collection.id} value={collection.id}>
                  <span className="emoji-badge">📚</span> {collection.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
