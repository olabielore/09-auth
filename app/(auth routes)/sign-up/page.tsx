'use client';

import css from "@/app/(auth routes)/SignUpPage.module.css"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, AuthRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import axios, { AxiosError } from 'axios';

const SignUp = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const setUser = useAuthStore((state) => state.setUser);

    const handleSubmit = async (formData: FormData) => {

        try {
            const formValues = Object.fromEntries(formData) as AuthRequest;
            const response = await register(formValues);

            if (response) {
                setUser(response)
                router.push('/profile');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.error ??
                    error.message ??
                    'Axios error'
                );
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Unknown error');
            }
        }
    }

    return (
    <>
        <main className={css.mainContent}>
            <h1 className={css.formTitle}>Sign up</h1>
            <form className={css.form} action={handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" className={css.input} required />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" className={css.input} required />
            </div>

            <div className={css.actions}>
                <button type="submit" className={css.submitButton}>
                    Register
                </button>
            </div>
                    
            {error &&
                <p className={css.error}>{error}</p>}
            </form>
        </main>
    </>
    )
};

export default SignUp;