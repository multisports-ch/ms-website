"use client";

import { useState } from "react";
import Image from "next/image";

interface NewsImage {
    id: string;
    imageUrl: string;
    order: number;
}

interface NewsItem {
    id: string;
    title: string;
    body: string | null;
    publishedAt: string;
    images: NewsImage[];
}

interface Props {
    item: NewsItem;
}

export default function NewsCard({ item }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const hasImages = item.images.length > 0;
    const previewText = item.body ? item.body.slice(0, 160) : "";
    const needsExpand = item.body && item.body.length > 160;

    return (
        <>
            <div
                className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
                onClick={() => setExpanded(true)}
            >
                {/* First image preview */}
                {hasImages && (
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={item.images[0].imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                +{item.images.length - 1} photo{item.images.length > 2 ? "s" : ""}
                            </div>
                        )}
                    </div>
                )}

                <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-2">
                        {new Date(item.publishedAt).toLocaleDateString("fr-CH", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                    </h3>
                    {previewText && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {previewText}
                            {needsExpand ? "..." : ""}
                        </p>
                    )}
                    {needsExpand && (
                        <p className="text-xs font-semibold mt-3" style={{ color: "var(--primary)" }}>
                            Lire la suite →
                        </p>
                    )}
                </div>
            </div>

            {/* Expanded modal */}
            {expanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => {
                            setExpanded(false);
                            setCurrentImage(0);
                        }}
                    />

                    <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
                        {/* Carousel */}
                        {hasImages && (
                            <div className="relative">
                                <div className="relative h-72 w-full overflow-hidden rounded-t-2xl">
                                    <Image
                                        src={item.images[currentImage].imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Carousel controls */}
                                {item.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImage((prev) =>
                                                    prev === 0 ? item.images.length - 1 : prev - 1
                                                );
                                            }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImage((prev) =>
                                                    prev === item.images.length - 1 ? 0 : prev + 1
                                                );
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            ›
                                        </button>

                                        {/* Dots */}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {item.images.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImage(i);
                                                    }}
                                                    className={`w-2 h-2 rounded-full transition-colors ${
                                                        i === currentImage ? "bg-white" : "bg-white/40"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {new Date(item.publishedAt).toLocaleDateString("fr-CH", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                    <h2 className="text-2xl font-black text-foreground">{item.title}</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setExpanded(false);
                                        setCurrentImage(0);
                                    }}
                                    className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none ml-4 shrink-0"
                                >
                                    ✕
                                </button>
                            </div>

                            {item.body && (
                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                    {item.body}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
