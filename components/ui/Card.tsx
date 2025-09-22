
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-[rgb(var(--color-surface))] p-5 rounded-xl shadow-sm flex items-center space-x-4 rtl:space-x-reverse">
      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-[rgba(var(--color-primary),0.1)] text-[rgb(var(--color-primary))]">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm text-[rgb(var(--color-text-secondary))] font-medium">{title}</p>
        <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">{value}</p>
      </div>
    </div>
  );
};

export default Card;