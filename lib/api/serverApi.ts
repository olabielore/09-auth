
import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

const getCookieHeader = () => {
  const cookieStore = cookies();
  return cookieStore.toString();
};

export const checkSession = async () => {
  const { data } = await api.get('/auth/session', {
    headers: {
      Cookie: getCookieHeader(),
    },
  });
 
  return data;
};

export const getMe = async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me', {
      headers: {
        Cookie: getCookieHeader(),
      },
    });
    return data;
};
  
export const fetchNotes = async (
  params: Record<string, unknown>
) => {
  const { data } = await api.get('/notes', {
    params,
    headers: {
      Cookie: getCookieHeader(),
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: getCookieHeader(),
    },
  });
  return data;
};