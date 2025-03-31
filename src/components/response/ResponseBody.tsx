import React, { useMemo, useState } from 'react';
import { Button, Space, Typography, Card } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ResponseBodyProps {
  body: any;
}

// Simple pretty-print for JSON without external libraries
const PrettyJSON: React.FC<{ data: any }> = ({ data }) => {
  // Format the JSON as a nicely indented string
  const formattedJson = JSON.stringify(data, null, 2);
  
  return (
    <pre 
      style={{
        backgroundColor: 'var(--pink-light)',
        padding: '12px',
        borderRadius: 'var(--border-radius)',
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#333'
      }}
    >
      {formattedJson}
    </pre>
  );
};

const ResponseBody: React.FC<ResponseBodyProps> = ({ body }) => {
  const [copied, setCopied] = useState(false);
  
  // Process the body content
  const { contentType, rawBody } = useMemo(() => {
    if (body === null || body === undefined) {
      return {
        contentType: 'empty',
        rawBody: '',
      };
    }

    let rawBody = '';
    let contentType = 'text';

    // Convert to string if not already
    if (typeof body !== 'string') {
      try {
        // Check if it's JSON object
        rawBody = JSON.stringify(body, null, 2);
        contentType = 'json';
      } catch (e) {
        rawBody = String(body);
      }
    } else {
      rawBody = body;
      
      // Try to detect if it's JSON or HTML
      try {
        const trimmedBody = body.trim();
        if (
          (trimmedBody.startsWith('{') && trimmedBody.endsWith('}')) ||
          (trimmedBody.startsWith('[') && trimmedBody.endsWith(']'))
        ) {
          JSON.parse(body); // Just to validate it's parseable JSON
          contentType = 'json';
        } else if (
          trimmedBody.startsWith('<!DOCTYPE html') ||
          trimmedBody.startsWith('<html') ||
          (trimmedBody.includes('<') && trimmedBody.includes('>'))
        ) {
          contentType = 'html';
        } else if (
          trimmedBody.startsWith('<?xml') ||
          (trimmedBody.includes('<') && trimmedBody.includes('</'))
        ) {
          contentType = 'xml';
        }
      } catch (e) {
        // If parsing fails, treat as plain text
      }
    }

    return {
      contentType,
      rawBody,
    };
  }, [body]);

  // Copy response to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(rawBody).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Render content based on type
  const renderContent = () => {
    if (contentType === 'empty') {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">
            <span className="emoji-badge">🦄</span> No content in response body
          </Text>
        </div>
      );
    }

    if (contentType === 'json') {
      try {
        const jsonData = typeof body === 'string' ? JSON.parse(body) : body;
        return <PrettyJSON data={jsonData} />;
      } catch (e: any) {
        return <Text type="danger">Invalid JSON: {e.message}</Text>;
      }
    }

    // For HTML, XML, and plain text
    return (
      <pre
        style={{
          backgroundColor: 'var(--pink-light)',
          padding: '12px',
          borderRadius: 'var(--border-radius)',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '13px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {rawBody}
      </pre>
    );
  };

  const getContentTypeEmoji = () => {
    switch (contentType) {
      case 'json': return '💎';
      case 'html': return '🔮';
      case 'xml': return '📊';
      default: return '📄';
    }
  };

  return (
    <div className="response-body">
      <div className="response-body-header" style={{ marginBottom: 8 }}>
        <Space>
          <Button
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            type="text"
            style={{ color: 'var(--pink-dark)' }}
          >
            {copied ? 'Copied! ✨' : 'Copy ✨'}
          </Button>
          <Text style={{ color: 'var(--pink-dark)' }}>
            <span className="emoji-badge">{getContentTypeEmoji()}</span>
            Content Type: {contentType.toUpperCase()}
          </Text>
        </Space>
      </div>
      
      <Card 
        bordered={false} 
        className="response-body-content"
        style={{ 
          borderRadius: 'var(--border-radius)',
          boxShadow: '0 2px 8px rgba(255, 128, 191, 0.1)'
        }}
      >
        {renderContent()}
      </Card>
    </div>
  );
};

export default ResponseBody;