// Force HTTPS - prevent Mixed Content errors
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL.replace('http://', 'https://')}/api/v1` 
  : 'http://localhost:8000/api/v1';

// Debug logging
if (typeof window !== 'undefined') {
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Environment check - Mixed Content fix applied');
}

export interface AnalysisResult {
  summary: {
    overview: string;
    participants: number;
    messageCount: number;
    duration: string;
    mainTopics: string[];
  };
  emotionTimeline: {
    emotions: Array<{
      time: string;
      emotion: string;
      intensity: number;
      color: string;
    }>;
    dominantEmotion: string;
    emotionalShifts: number;
  };
  aiJudgeScore: {
    overallScore: number;
    breakdown: {
      clarity: number;
      empathy: number;
      professionalism: number;
      resolution: number;
    };
    verdict: string;
    recommendation: string;
  };
  subtleties: Array<{
    type: string;
    message: string;
    confidence: number;
    context: string;
  }>;
  preset?: {
    id: string;
    name: string;
    custom_cards: Array<{
      id: string;
      name: string;
      icon: string;
      description: string;
    }>;
  };
  preset_validation?: {
    is_valid: boolean;
    reason: string;
  };
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  dominant_emotion: string;
  overall_score: number;
  message_count: number;
  participants: number;
  file_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  settings?: any;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  target_audience?: string;
  report_style?: string[];
  focus_analysis?: string[];
  temperature: number;
  custom_cards?: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
  }>;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.access_token);
    }
    
    return response;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    this.token = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.access_token);
    }
    
    return response;
  }

  async getUser() {
    return await this.request<User>('/auth/user');
  }

  // Analysis methods
  async analyzeText(text: string, presetId?: string, temperature?: number) {
    console.log('API: отправка запроса анализа текста');
    const formData = new FormData();
    formData.append('text', text);
    if (presetId) formData.append('preset_id', presetId);
    if (temperature) formData.append('temperature', temperature.toString());

    const response = await fetch(`${API_BASE_URL}/analysis/text`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API: получен ответ от сервера', result);
    return result;
  }

  async analyzeFile(file: File, presetId?: string, temperature?: number) {
    const formData = new FormData();
    formData.append('file', file);
    if (presetId) formData.append('preset_id', presetId);
    if (temperature) formData.append('temperature', temperature.toString());

    const response = await fetch(`${API_BASE_URL}/analysis/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async analyzeMultipleFiles(files: File[], presetId?: string, temperature?: number) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    if (presetId) formData.append('preset_id', presetId);
    if (temperature) formData.append('temperature', temperature.toString());

    const response = await fetch(`${API_BASE_URL}/analysis/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getHistory() {
    console.log('API: Getting history items');
    return await this.request<HistoryItem[]>('/history/');
  }

  async getHistoryItem(id: string) {
    return await this.request<AnalysisResult>(`/history/${id}`);
  }

  async deleteHistoryItem(id: string) {
    return await this.request(`/history/${id}`, {
      method: 'DELETE',
    });
  }

  async getPresets() {
    console.log('API: Getting presets');
    return await this.request<Preset[]>('/presets/');
  }

  async getPreset(id: string) {
    return await this.request<Preset>(`/presets/${id}`);
  }

  async getSuggestedResponses(text: string) {
    const response = await this.request<{ responses: string[] }>('/analysis/suggested-responses', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.responses;
  }

  async chatWithAI(message: string, analysisId?: string) {
    const response = await this.request<{ response: string }>('/analysis/chat', {
      method: 'POST',
      body: JSON.stringify({ message, analysis_id: analysisId }),
    });
    return response.response;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }
}

export const apiClient = new ApiClient(); 