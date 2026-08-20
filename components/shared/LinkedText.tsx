import type { ReactNode } from "react";

const URL_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
const URL_ONLY_PATTERN = /^(https?:\/\/[^\s]+|www\.[^\s]+)$/;
const TRAILING_PUNCTUATION = /[.,!?;:)]$/;

function linkifyText(text: string): ReactNode[] {
    return text.split(URL_PATTERN).map((part, index) => {
        if (!part || !URL_ONLY_PATTERN.test(part)) return part;

        let url = part;
        let trailing = "";
        while (TRAILING_PUNCTUATION.test(url)) {
            trailing = url.slice(-1) + trailing;
            url = url.slice(0, -1);
        }

        const href = url.startsWith("www.") ? `https://${url}` : url;
        return (
            <span key={`${url}-${index}`}>
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-75"
                    onClick={(event) => event.stopPropagation()}
                >
                    {url}
                </a>
                {trailing}
            </span>
        );
    });
}

export default function LinkedText({ text }: { text: string | null | undefined }) {
    if (!text) return null;

    return <span className="whitespace-pre-wrap">{linkifyText(text)}</span>;
}
