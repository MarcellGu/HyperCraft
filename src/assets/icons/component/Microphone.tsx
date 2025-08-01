import React from "react";

function Microphone(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 128 128"
                stroke="currentColor"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={8}
                xmlns="http://www.w3.org/2000/svg"
                {...props}>
        <line x1="48" y1="111.5" x2="80" y2="111.5"/>
        <line x1="64" y1="95" x2="64" y2="111"/>
        <path d="M34,64 C34,80.5685425 47.4314575,94 64,94 C80.5685425,94 94,80.5685425 94,64"/>
        <rect x="48" y="17" width="32" height="64" rx="16"/>
    </svg>;
}

export default Microphone;
