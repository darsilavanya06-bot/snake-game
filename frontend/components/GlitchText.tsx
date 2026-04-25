import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '', as: Component = 'span' }) => {
  return (
    <Component 
      className={`glitch-text font-bold tracking-widest ${className}`} 
      data-text={text}
    >
      {text}
    </Component>
  );
};
