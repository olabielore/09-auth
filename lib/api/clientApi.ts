import { api } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';

export type AuthRequest = {
    email: string;
    password: string;
};
  
export type UpdateUserRequest = {
  username?: string;
};
  
export const register = async (data: AuthRequest): Promise<User> => {
const { data: user } = await api.post<User>('/auth/register', data);
return user;
};

export const login = async (data: AuthRequest): Promise<User> => {
const { data: user } = await api.post<User>('/auth/login', data);
return user;
};

export const logout = async (): Promise<void> => {
await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
const { data } = await api.get<User | null>('/auth/session');
return data ?? null;
};

export const getMe = async (): Promise<User> => {
const { data } = await api.get<User>('/users/me');
return data;
};

export const updateMe = async({ username: string }: UpdateUserRequest): Promise<User> => {
const { data } = await api.patch<User>('/users/me', { username: string });
return data;
};

export type FetchNotesParams = {
page?: number;
perPage?: number;
search?: string;
tag?: string;
}
  
export type FetchNotesResponse = {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (
    params: FetchNotesParams
  ): Promise<FetchNotesResponse> => {
    const { data } = await api.get<FetchNotesResponse>('/notes', { params });
    return data;
  };
  
  export const fetchNoteById = async (id: string): Promise<Note> => {
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
  };
  
  export const createNote = async (
    note: Pick<Note, 'title' | 'content' | 'tag'>
  ): Promise<Note> => {
    const { data } = await api.post<Note>('/notes', note);
    return data;
  };
  
  export const deleteNote = async (id: string): Promise<Note> => {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
  };
