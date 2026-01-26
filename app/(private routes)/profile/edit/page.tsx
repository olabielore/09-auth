
'use client'

import { useState, useEffect } from 'react'
import { updateMe, getMe } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import css from "./EditProfilePage.module.css"

const EditProfile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [email, setEmail] = useState('');

    useEffect(() => {
        getMe().then((user) => {
          setUserName(user.userName ?? '');
          setPhotoUrl(user.photoUrl ?? '');
          setEmail(user.email);
        });
      }, []);

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateMe({ userName, photoUrl });
    router.push('/profile');
  };

  return (
    <main className={css.mainContent}>
        <div className={css.profileCard}>
            <h1 className={css.formTitle}>Edit Profile</h1>

            <img src={photoUrl || '/avatar-placeholder.png'}
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
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
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
