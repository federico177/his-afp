// Definiamo il tipo direttamente qui
export type UserRole = 'DOC' | 'INF' | 'AMM';

export interface User {
  id?: number;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export interface CreateUserRequest {
  username: string;
  role: UserRole;
  password?: string;
}

export interface UsernameCheckData {
  available: boolean;
}