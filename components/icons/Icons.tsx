
import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const DashboardIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 4h6v8h-6z" />
    <path d="M4 16h6v4h-6z" />
    <path d="M14 12h6v8h-6z" />
    <path d="M14 4h6v4h-6z" />
  </svg>
);

export const SalesIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2" />
    <path d="M12 3v3m0 12v3" />
  </svg>
);

export const PurchasesIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M15 17h-9v-14h-2" />
    <path d="M6 5l14 1l-1 7h-13" />
    <path d="M15 13l5 -2" />
  </svg>
);

export const InvoiceIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    <path d="M9 7h1" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
  </svg>
);

export const AccountingIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M17 21v-2a4 4 0 0 0 -4 -4h-6a4 4 0 0 0 -4 4v2" />
    <path d="M9 3a4 4 0 1 0 6 0a4 4 0 0 0 -6 0" />
    <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
    <path d="M5.5 15h2" />
    <path d="M6.5 15v6" />
  </svg>
);


export const ContactsIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

export const SettingsIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  </svg>
);

export const ChevronDownIcon = ({className = ''}) => (
  <svg {...iconProps} className={`${iconProps.className} ${className}`} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6 9l6 6l6 -6" />
  </svg>
);

export const UserIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
);

export const CustomersIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
    </svg>
);

export const SuppliersIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-4.05 1" />
        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a4 4 0 0 1 -4 -4v-1a.5 .5 0 0 0 -1 0v1" />
    </svg>
);

export const MenuIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
);

export const XIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
