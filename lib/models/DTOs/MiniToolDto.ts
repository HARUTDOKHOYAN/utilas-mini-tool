
 export  type MiniToolDto = {
    _id?: string;
    id: string;
    title: string;
    summary: string;
    keyFeatures: KeyFeatureBlock[];
    description: DescriptionBlock[];
    thumbnail: string;
    iframeSlug: string;
    tags?: string[];
    iframeHtml?: string;
    reactAppUrl?: string;
    appType?: "html" | "react";
    iframeUrl?: string;
    iframeFullUrl?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type DescriptionBlock = {
    image: string;
    text: string;
    orientation: "left" | "right";
};

export type KeyFeatureBlock = {
    image: string;
    title: string;
    description: string;
};