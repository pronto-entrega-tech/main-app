import React from 'react';

export type UseHover = [
  boolean,
  {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onTouchCancel: () => void;
  }
];

const useHover = (): UseHover => {
  const [hovered, setHovered] = React.useState(false);

  const hoverBind = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onTouchCancel: () => setHovered(false),
  };

  return [hovered, hoverBind];
};

export default useHover;
