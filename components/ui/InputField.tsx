import React from 'react';

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">
            {label}
        </label>
        <input
            {...props}
            className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 placeholder:text-[rgb(var(--color-text-secondary))] disabled:opacity-50 read-only:bg-[rgb(var(--color-muted))] read-only:opacity-70"
        />
    </div>
);

export default InputField;
