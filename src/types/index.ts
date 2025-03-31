export interface Request {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: Header[];
  params: Param[];
  body: RequestBody;
  auth: Auth | null;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

export interface Param {
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestBody {
  type: 'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary';
  content: string | FormData | null;
  formData?: {key: string; value: string; enabled: boolean}[];
  rawType?: 'text' | 'json' | 'xml' | 'javascript';
}

export interface Auth {
  type: 'none' | 'basic' | 'bearer' | 'api-key';
  basic?: {
    username: string;
    password: string;
  };
  bearer?: {
    token: string;
  };
  apiKey?: {
    key: string;
    value: string;
    addTo: 'header' | 'queryParam';
  };
}

export interface Response {
  status: number;
  statusText: string;
  time: number;
  size: number;
  headers: Record<string, string>;
  body: any;
}

export interface Collection {
  id: string;
  name: string;
  requests: Request[];
  folders: Folder[];
}

export interface Folder {
  id: string;
  name: string;
  requests: Request[];
  folders: Folder[];
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestHistory {
  id: string;
  timestamp: number;
  request: Request;
  response: Response | null;
}