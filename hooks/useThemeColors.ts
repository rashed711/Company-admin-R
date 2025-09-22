import { useState, useEffect } from 'react';
import { useAppSettings } from '../contexts/AppSettingsContext';

export const useThemeColors = () => {
    const { theme } = useAppSettings();
    const [colors, setColors] = useState({
        textPrimary: '',
        textSecondary: '',
        surface: '',
        border: '',
        background: ''
    });

    useEffect(() => {
        // Ensure component is mounted before accessing document
        if (typeof window !== 'undefined') {
            const rootStyles = getComputedStyle(document.documentElement);
            setColors({
                textPrimary: `rgb(${rootStyles.getPropertyValue('--color-text-primary').trim()})`,
                textSecondary: `rgb(${rootStyles.getPropertyValue('--color-text-secondary').trim()})`,
                surface: `rgb(${rootStyles.getPropertyValue('--color-surface').trim()})`,
                border: `rgb(${rootStyles.getPropertyValue('--color-border').trim()})`,
                background: `rgb(${rootStyles.getPropertyValue('--color-background').trim()})`,
            });
        }
    }, [theme]); // Re-run when theme changes

    return colors;
};
