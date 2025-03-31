import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Request, Response, Param } from '../types';

export const executeRequest = async (request: Request): Promise<Response> => {
  const startTime = Date.now();
  
  try {
    // Process URL with query parameters
    const url = buildUrl(request.url, request.params);
    
    // Build request headers
    const headers = request.headers
      .filter(header => header.enabled)
      .reduce((acc, header) => {
        acc[header.key] = header.value;
        return acc;
      }, {} as Record<string, string>);
    
    // Add authentication headers if needed
    if (request.auth) {
      addAuthHeaders(headers, request.auth);
    }
    
    // Prepare request config
    const config: AxiosRequestConfig = {
      url,
      method: request.method.toLowerCase(),
      headers,
      timeout: 30000, // 30 seconds timeout
    };
    
    // Add request body if needed (not for GET or HEAD requests)
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.body.type !== 'none') {
      config.data = processRequestBody(request.body);
    }
    
    // Execute the request
    const axiosResponse = await axios(config);
    const endTime = Date.now();
    
    // Process response
    return {
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      time: endTime - startTime,
      size: calculateResponseSize(axiosResponse),
      headers: axiosResponse.headers as Record<string, string>,
      body: axiosResponse.data
    };
  } catch (error: any) {
    const endTime = Date.now();
    
    // Handle error response
    if (error.response) {
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        time: endTime - startTime,
        size: calculateResponseSize(error.response),
        headers: error.response.headers as Record<string, string>,
        body: error.response.data
      };
    }
    
    // Handle network errors or other issues
    return {
      status: 0,
      statusText: error.message || 'Network Error',
      time: endTime - startTime,
      size: 0,
      headers: {},
      body: error.message || 'Request failed'
    };
  }
};

// Helper function to build URL with query parameters
const buildUrl = (baseUrl: string, params: Param[]): string => {
  const enabledParams = params.filter(param => param.enabled);
  
  if (enabledParams.length === 0) {
    return baseUrl;
  }
  
  const queryString = enabledParams
    .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
    .join('&');
  
  return baseUrl.includes('?') 
    ? `${baseUrl}&${queryString}` 
    : `${baseUrl}?${queryString}`;
};

// Helper function to add authentication headers
const addAuthHeaders = (headers: Record<string, string>, auth: any) => {
  switch (auth.type) {
    case 'basic':
      if (auth.basic?.username && auth.basic?.password) {
        const credentials = `${auth.basic.username}:${auth.basic.password}`;
        const encoded = btoa(credentials);
        headers['Authorization'] = `Basic ${encoded}`;
      }
      break;
    case 'bearer':
      if (auth.bearer?.token) {
        headers['Authorization'] = `Bearer ${auth.bearer.token}`;
      }
      break;
    case 'api-key':
      if (auth.apiKey?.key && auth.apiKey?.value && auth.apiKey.addTo === 'header') {
        headers[auth.apiKey.key] = auth.apiKey.value;
      }
      break;
    default:
      break;
  }
};

// Process request body based on type
const processRequestBody = (requestBody: any) => {
  switch (requestBody.type) {
    case 'raw':
      return requestBody.content;
    case 'form-data':
      if (requestBody.formData) {
        const formData = new FormData();
        requestBody.formData
          .filter((item: any) => item.enabled)
          .forEach((item: any) => {
            formData.append(item.key, item.value);
          });
        return formData;
      }
      return null;
    case 'x-www-form-urlencoded':
      if (requestBody.formData) {
        return requestBody.formData
          .filter((item: any) => item.enabled)
          .map((item: any) => `${encodeURIComponent(item.key)}=${encodeURIComponent(item.value)}`)
          .join('&');
      }
      return null;
    default:
      return null;
  }
};

// Calculate response size
const calculateResponseSize = (response: AxiosResponse): number => {
  let size = 0;
  
  // Headers size
  const headers = response.headers;
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      size += key.length + (value ? String(value).length : 0);
    });
  }
  
  // Body size
  if (response.data) {
    if (typeof response.data === 'string') {
      size += response.data.length;
    } else {
      try {
        size += JSON.stringify(response.data).length;
      } catch (e) {
        // Can't calculate size if we can't stringify
      }
    }
  }
  
  return size;
};