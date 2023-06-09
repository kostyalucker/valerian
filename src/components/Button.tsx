import React from "react";

export default function Button(props: { children: React.ReactNode, onClick?: any, className?: string, disabled?: boolean }) { 
  const classes = `
    bg-transparent 
    hover:bg-blue-500
    text-blue-700 
    font-semibold 
    hover:text-white 
    py-2 
    px-4 
    border 
    border-blue-500 
    hover:border-transparent 
    rounded
    ${props.className || ''}
  `;

  return (
    <button
      onClick={props.onClick}
      className={classes}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
