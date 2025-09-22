import React from 'react';

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">
            {label}
        </label>
        <textarea
            {...props}
            rows={props.rows || 4}
            className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 placeholder:text-[rgb(var(--color-text-secondary))]"
        />
    </div>
);

export default TextareaField;
