const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
};
