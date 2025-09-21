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
  
  const baseClasses = "font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  
  const variantClasses = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "bg-transparent border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-sky-500",
  };

  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
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
