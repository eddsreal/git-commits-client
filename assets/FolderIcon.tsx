import React from "react";

type Props = {
  className: string;
  color: string;
}

const FolderIcon: React.FC<Props> = ({className, color}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 512 512"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      className={className}
    >
      <path
        className={color}
        d="M467.862 123.586H256l-70.621-70.621H44.138C19.765 52.966 0 72.73 0 97.103v317.793c0 24.373 19.765 44.138 44.138 44.138h423.724c24.373 0 44.138-19.765 44.138-44.138V167.724c0-24.373-19.765-44.138-44.138-44.138"
      ></path>
      <path
        className={color}
        d="M220.69 335.448L220.69 229.517 308.966 282.483z"
      ></path>
    </svg>
  );
};

export default FolderIcon;
