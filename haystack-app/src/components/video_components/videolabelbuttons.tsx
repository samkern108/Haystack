import React from "react";

export type ButtonDef = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export const videoLabelButtons: ButtonDef[] = [
  {
    id: "love",
    label: "Love",
    icon: (
    <svg className="love"
      width="16" height="16" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> 
      <path d="m8 13.447-1.45-1.323C3.1 9.258 1 7.39 1 4.92 1 3.326 2.324 2 4 2c.995 0 1.905.51 2.5 1.25C7.095 2.51 8.005 2 9 2c1.676 0 3 1.326 3 2.92 0 2.47-2.1 4.338-5.55 7.204L8 13.447z"
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      /> 
    </svg>
    ),
  },
  {
    id: "star",
    label: "Star",
    icon: (
      <svg className="star"
        width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.7 7.1-.6L12 2z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X",
    icon: (
      <svg className="x"
        width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }
];