
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm flex items-center space-x-4 rtl:space-x-reverse">
      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
};

export default Card;