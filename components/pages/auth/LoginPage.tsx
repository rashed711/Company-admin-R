import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import Button from '../../ui/Button';
import InputField from '../../ui/InputField';

export default function LoginPage() {
    const { login } = useAuth();
    const { t } = useTranslation();
    const { companyInfo } = useAppSettings();
    const [email, setEmail] = useState('rashed1711@gmail.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { success, error: loginError } = await login(email, password);
        if (!success && loginError) {
            if (loginError === 'Invalid login credentials') {
                setError(t('login_error_invalid_credentials'));
            } else {
                setError(loginError);
            }
        }
        // On success, or on DB recursion error, the AuthProvider handles the state change.
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--color-background))]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[rgb(var(--color-surface))] rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-sky-600 dark:text-sky-400">{companyInfo.APP_NAME.value}</h1>
                    <p className="mt-2 text-[rgb(var(--color-text-secondary))]">{t('welcome_message', { appName: companyInfo.APP_NAME.value })}</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <InputField
                        label={t('email_address')}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                    />
                     <InputField
                        label={t('password')}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />

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