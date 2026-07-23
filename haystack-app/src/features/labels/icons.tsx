import type { SVGProps } from "react";

export function LoveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" >
        </path> 
    </svg>
  );
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
    return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.7 7.1-.6L12 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
    return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommentIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path fillRule="evenodd" 
        clipRule="evenodd" 
        d="M60,0H4C1.789,0,0,1.789,0,4v40c0,2.211,1.789,4,4,4h8v12 c0,1.617,0.973,3.078,2.469,3.695C14.965,63.902,15.484,64,16,64c1.039,0,2.062-0.406,2.828-1.172L33.656,48H60c2.211,0,4-1.789,4-4 V4C64,1.789,62.211,0,60,0z"></path>
      </svg>
  );
}

export function getVideoLabelIcon(id: string, className?: string): import("react").ReactNode {
    switch (id) {
        case "love":
            return <LoveIcon className={className}/>;
        case "star":
            return <StarIcon className={className}/>;
        case "x":
            return <XIcon className={className}/>;
        default:
            return <StarIcon className={className}/>;
    }
}