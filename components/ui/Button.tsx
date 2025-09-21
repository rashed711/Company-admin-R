
import React from 'react';

// FIX: Converted the Button component to be polymorphic to support rendering as different HTML elements using an 'as' prop.
// This is achieved using TypeScript generics to ensure type safety for the props of the rendered element.

// Define the props specific to the Button component, independent of the rendered element.
type ButtonOwnProps<E extends React.ElementType> = {
  as?: E;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

// Combine our custom props with the props of the underlying element (e.g., HTMLButtonElement attributes).
// `Omit` is used to prevent prop conflicts between our custom props and the element's native props.
type ButtonProps<E extends React.ElementType> = ButtonOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

// The component is now a generic function that defaults to rendering a 'button' element.
const Button = <E extends React.ElementType = 'button'>({ 
  as,
  variant = 'primary', 
  size = 'md', 
  children, 
  className, // Destructure className to merge it correctly with component-specific classes.
  ...props 
}: ButtonProps<E>) => {
  // Determine the component to render based on the `as` prop, defaulting to 'button'.
  const Component = as || 'button';
  
  const baseClasses = "font-bold rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out inline-flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300 dark:focus:ring-sky-800 shadow-sm hover:shadow-md",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-800 shadow-sm hover:shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-800 shadow-sm hover:shadow-md",
    outline: "bg-transparent border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-200 dark:focus:ring-gray-700",
  };

  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-3 px-6 text-base",
  };

  // Merge the component's classes with any `className` passed in props.
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Button;