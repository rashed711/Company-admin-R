import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import Button from '../../ui/Button';

export default function LoginPage() {
    const { login } = useAuth();
    const { t } = useTranslation();
    const { companyInfo } = useAppSettings();
    const [email, setEmail] = useState('admin@enjaz.app');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await login(email, password);
        if (!success) {
            setError('Invalid email or password.');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-sky-600 dark:text-sky-400">{companyInfo.APP_NAME.value}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{t('welcome_message', { appName: companyInfo.APP_NAME.value })}</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {t('email_address')}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        {/* FIX: Corrected typo from 'cclassName' to 'className'. */}
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {t('password')}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? '...' : t('login')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
