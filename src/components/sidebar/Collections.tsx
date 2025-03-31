import React from 'react';
import { Tree, Empty, Typography } from 'antd';
import { 
  FolderOutlined, 
  ApiOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Collection, Request } from '../../types';
import { useAppContext } from '../../store/AppContext';

const { DirectoryTree } = Tree;
const { Text } = Typography;

interface CollectionsProps {
  collections: Collection[];
}

const Collections: React.FC<CollectionsProps> = ({ collections }) => {
  const { updateActiveRequest } = useAppContext();

  // Handle request click
  const handleRequestClick = (request: Request) => {
    updateActiveRequest(request);
  };

  // Convert collections to tree data for Ant Design Tree component
  const getTreeData = () => {
    return collections.map(collection => ({
      title: collection.name,
      key: `collection-${collection.id}`,
      icon: <FolderOutlined />,
      children: [
        // Folder nodes
        ...collection.folders.map(folder => ({
          title: folder.name,
          key: `folder-${folder.id}`,
          icon: <FolderOutlined />,
          children: [
            // Folder requests
            ...folder.requests.map(request => ({
              title: (
                <div onClick={() => handleRequestClick(request)}>
                  <Text style={{ marginRight: 8 }} type="secondary">
                    {request.method}
                  </Text>
                  {request.name}
                </div>
              ),
              key: `request-${request.id}`,
              icon: <ApiOutlined />,
              isLeaf: true,
            }))
          ],
        })),
        // Collection requests
        ...collection.requests.map(request => ({
          title: (
            <div onClick={() => handleRequestClick(request)}>
              <Text style={{ marginRight: 8 }} type="secondary">
                {request.method}
              </Text>
              {request.name}
            </div>
          ),
          key: `request-${request.id}`,
          icon: <ApiOutlined />,
          isLeaf: true,
        }))
      ],
    }));
  };

  if (collections.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No collections"
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div className="collections">
      <DirectoryTree
        defaultExpandAll
        switcherIcon={<DownOutlined />}
        treeData={getTreeData()}
      />
    </div>
  );
};

export default Collections;