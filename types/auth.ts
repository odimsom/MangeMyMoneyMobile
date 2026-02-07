export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currency: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  currency: string;
  verificationUrl?: string; // Likely not used in mobile flow same way, but keeping for compatibility
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}
