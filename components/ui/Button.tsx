import React from 'react';

// This defines the props that are unique to our Button component.
interface ButtonOwnProps {
  // FIX: Made children optional to allow for icon-only buttons and to resolve a widespread typing issue.
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// This is a generic type for polymorphic components.
// It correctly combines our own props with the props of the element type it will render.
type PolymorphicComponentProps<
  E extends React.ElementType,
  P
> = P & {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof P | 'as'>;

// Define the final props for our Button, using the polymorphic helper.
// The default element type is 'button'.
type ButtonProps<E extends React.ElementType = 'button'> = PolymorphicComponentProps<E, ButtonOwnProps>;

// The component implementation.
const Button = <E extends React.ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...otherProps
}: ButtonProps<E>) => {
  const Component = as || 'button';

  const baseClasses =
    'font-bold rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out inline-flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300 dark:focus:ring-sky-800 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-800 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-800 shadow-sm hover:shadow-md',
    outline: 'bg-transparent border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-200 dark:focus:ring-gray-700',
  };

  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;

  // FIX: Using React.createElement instead of JSX for the polymorphic component
  // to resolve a TypeScript error where the JSX compiler fails to correctly
  // infer the type of 'Component', which was causing cascading errors.
  return React.createElement(Component, { className: classes, ...otherProps }, children);
};

export default Button;