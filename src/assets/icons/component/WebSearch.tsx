import React from "react";

function WebSearch(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 128 128"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={9}
                xmlns="http://www.w3.org/2000/svg"
                {...props}>
        <path
            d="M19,64.5 L110,64.5 M46.3,64.5 C46.3,89.6289561 54.4484176,110 64.5,110 C74.5515824,110 82.7,89.6289561 82.7,64.5 C82.7,39.3710439 74.5515824,19 64.5,19 C54.4484176,19 46.3,39.3710439 46.3,64.5 M19,64.5 C19,89.6289561 39.3710439,110 64.5,110 C89.6289561,110 110,89.6289561 110,64.5 C110,39.3710439 89.6289561,19 64.5,19 C39.3710439,19 19,39.3710439 19,64.5"/>
    </svg>;
}

export default WebSearch;
