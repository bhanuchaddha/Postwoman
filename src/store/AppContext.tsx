import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Request, Response, Collection, Environment, 
  RequestHistory
} from '../types';

interface AppState {
  activeRequest: Request;
  collections: Collection[];
  environments: Environment[];
  activeEnvironment: Environment | null;
  history: RequestHistory[];
  currentResponse: Response | null;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  updateActiveRequest: (request: Partial<Request>) => void;
  createNewRequest: () => void;
  sendRequest: (request: Request) => Promise<void>;
  saveRequestToCollection: (collectionId: string, request: Request) => void;
  addCollection: (name: string) => void;
  addEnvironment: (name: string) => void;
  setActiveEnvironment: (envId: string | null) => void;
  updateEnvironmentVariable: (envId: string, key: string, value: string, enabled: boolean) => void;
}

const defaultRequest: Request = {
  id: uuidv4(),
  name: 'New Request',
  url: '',
  method: 'GET',
  headers: [],
  params: [],
  body: {
    type: 'none',
    content: null,
  },
  auth: {
    type: 'none'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Initialize state
  const [state, setState] = useState<AppState>({
    activeRequest: { ...defaultRequest },
    collections: [{
      id: 'httpbin-test-collection',
      name: 'Test Collection',
      requests: [
        {
          id: 'get-test',
          name: 'GET Request Test',
          method: 'GET',
          url: 'https://httpbin.org/get',
          headers: [],
          params: [
            { key: 'test', value: 'value', enabled: true }
          ],
          body: { type: 'none', content: null },
          auth: null
        },
        {
          id: 'post-test',
          name: 'POST Request Test',
          method: 'POST',
          url: 'https://httpbin.org/post',
          headers: [
            { key: 'Content-Type', value: 'application/json', enabled: true }
          ],
          params: [],
          body: {
            type: 'raw',
            rawType: 'json',
            content: JSON.stringify({ message: 'Hello World' }, null, 2)
          },
          auth: null
        },
        {
          id: 'auth-test',
          name: 'Basic Auth Test',
          method: 'GET',
          url: 'https://httpbin.org/basic-auth/user/pass',
          headers: [],
          params: [],
          body: { type: 'none', content: null },
          auth: {
            type: 'basic',
            basic: {
              username: 'user',
              password: 'pass'
            }
          }
        },
        {
          id: 'headers-test',
          name: 'Headers Test',
          method: 'GET',
          url: 'https://httpbin.org/headers',
          headers: [
            { key: 'X-Custom-Header', value: 'Test Value', enabled: true }
          ],
          params: [],
          body: { type: 'none', content: null },
          auth: null
        },
        {
          id: 'delay-test',
          name: 'Delayed Response',
          method: 'GET',
          url: 'https://httpbin.org/delay/2',
          headers: [],
          params: [],
          body: { type: 'none', content: null },
          auth: null
        }
      ],
      folders: []
    }],
    environments: [],
    activeEnvironment: null,
    history: [],
    currentResponse: null,
    isLoading: false
  });

  // Load state from localStorage on component mount
  useEffect(() => {
    const storedCollections = localStorage.getItem('collections');
    const storedEnvironments = localStorage.getItem('environments');
    const storedHistory = localStorage.getItem('requestHistory');
    
    if (storedCollections) {
      setState(prev => ({ ...prev, collections: JSON.parse(storedCollections) }));
    }
    
    if (storedEnvironments) {
      setState(prev => ({ ...prev, environments: JSON.parse(storedEnvironments) }));
    }
    
    if (storedHistory) {
      setState(prev => ({ ...prev, history: JSON.parse(storedHistory) }));
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(state.collections));
    localStorage.setItem('environments', JSON.stringify(state.environments));
    localStorage.setItem('requestHistory', JSON.stringify(state.history));
  }, [state.collections, state.environments, state.history]);

  // Update the active request
  const updateActiveRequest = (requestUpdates: Partial<Request>) => {
    setState(prev => ({
      ...prev,
      activeRequest: {
        ...prev.activeRequest,
        ...requestUpdates
      }
    }));
  };

  // Create a new request
  const createNewRequest = () => {
    setState(prev => ({
      ...prev,
      activeRequest: { ...defaultRequest, id: uuidv4() },
      currentResponse: null
    }));
  };

  // Send a request
  const sendRequest = async (request: Request) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Import dynamically to avoid circular dependencies
      const { executeRequest } = await import('../utils/requestUtils');
      const response = await executeRequest(request);
      
      // Add to history
      const historyItem: RequestHistory = {
        id: uuidv4(),
        timestamp: Date.now(),
        request: { ...request },
        response
      };
      
      setState(prev => ({
        ...prev,
        currentResponse: response,
        isLoading: false,
        history: [historyItem, ...prev.history.slice(0, 49)] // Keep last 50 items
      }));
    } catch (error) {
      console.error('Failed to execute request:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Save request to collection
  const saveRequestToCollection = (collectionId: string, request: Request) => {
    setState(prev => ({
      ...prev,
      collections: prev.collections.map(collection => {
        if (collection.id === collectionId) {
          // Check if request already exists in collection
          const existingRequestIndex = collection.requests.findIndex(r => r.id === request.id);
          
          if (existingRequestIndex >= 0) {
            // Update existing request
            const updatedRequests = [...collection.requests];
            updatedRequests[existingRequestIndex] = { ...request };
            return {
              ...collection,
              requests: updatedRequests
            };
          } else {
            // Add new request
            return {
              ...collection,
              requests: [...collection.requests, { ...request }]
            };
          }
        }
        return collection;
      })
    }));
  };

  // Add a new collection
  const addCollection = (name: string) => {
    const newCollection: Collection = {
      id: uuidv4(),
      name,
      requests: [],
      folders: []
    };
    
    setState(prev => ({
      ...prev,
      collections: [...prev.collections, newCollection]
    }));
  };

  // Add a new environment
  const addEnvironment = (name: string) => {
    const newEnvironment: Environment = {
      id: uuidv4(),
      name,
      variables: []
    };
    
    setState(prev => ({
      ...prev,
      environments: [...prev.environments, newEnvironment]
    }));
  };

  // Set active environment
  const setActiveEnvironment = (envId: string | null) => {
    if (envId === null) {
      setState(prev => ({ ...prev, activeEnvironment: null }));
      return;
    }
    
    const environment = state.environments.find(env => env.id === envId);
    if (environment) {
      setState(prev => ({ ...prev, activeEnvironment: environment }));
    }
  };

  // Update environment variable
  const updateEnvironmentVariable = (
    envId: string, 
    key: string, 
    value: string, 
    enabled: boolean
  ) => {
    setState(prev => ({
      ...prev,
      environments: prev.environments.map(env => {
        if (env.id === envId) {
          const existingVarIndex = env.variables.findIndex(v => v.key === key);
          
          if (existingVarIndex >= 0) {
            // Update existing variable
            const updatedVariables = [...env.variables];
            updatedVariables[existingVarIndex] = { key, value, enabled };
            return {
              ...env,
              variables: updatedVariables
            };
          } else {
            // Add new variable
            return {
              ...env,
              variables: [...env.variables, { key, value, enabled }]
            };
          }
        }
        return env;
      })
    }));
  };

  // Create context value
  const contextValue: AppContextType = {
    ...state,
    updateActiveRequest,
    createNewRequest,
    sendRequest,
    saveRequestToCollection,
    addCollection,
    addEnvironment,
    setActiveEnvironment,
    updateEnvironmentVariable
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};