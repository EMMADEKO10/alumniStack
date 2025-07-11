import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`container p-8 mx-auto xl:px-0 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container; 