
'use client'

import { useState, useEffect } from 'react'
import { updateMe, getMe } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import css from "./EditProfilePage.module.css"

const EditProfile = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [email, setEmail] = useState('');


  useEffect(() => {
    const fetchUser = async () => {
      const user = await getMe();
        setUsername(user.username ?? '');
        setPhotoUrl(user.avatar ?? '');
        setEmail(user.email);
      };
      fetchUser();
      }, []);

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedUser = await updateMe({ username });
    setUser(updatedUser);
    router.push('/profile');
  };

  return (
    <main className={css.mainContent}>
        <div className={css.profileCard}>
            <h1 className={css.formTitle}>Edit Profile</h1>

            <Image
            src={photoUrl || '/avatar-placeholder.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            />

            <form className={css.profileInfo} onSubmit={handleSubmit}>
            <div className={css.usernameWrapper}>
                <label htmlFor="username">Username</label>
                <input id="username"
                  type="text"
                  className={css.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <p>Email: {email}</p>

            <div className={css.actions}>
                <button type="submit" className={css.saveButton}>
                Save
                </button>
                <button type="button" className={css.cancelButton} onClick={() => router.push('/profile')}>
                Cancel
                </button>
            </div>
            </form>
        </div>
    </main>

  );
}

export default EditProfile;
