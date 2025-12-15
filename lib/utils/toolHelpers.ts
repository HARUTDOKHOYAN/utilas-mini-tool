export function getBaseUrl(): string {
  const baseUrl = 
    process.env.API_BASE_URL || 
    process.env.NEXT_PUBLIC_API_BASE_URL || 
    process.env.NEXT_PUBLIC_VERCEL_URL;
  
  return baseUrl ? baseUrl.replace(/\/$/, "") : "";
}

export function withIframeUrl(tool: any) {
  if (!tool) {
    return tool;
  }

  const plain =
    typeof tool.toObject === "function" ? tool.toObject({ virtuals: true }) : { ...tool };

  // Remove internal blob URL from response
  if (plain.reactAppBlobUrl) {
    delete plain.reactAppBlobUrl;
  }

  const iframeUrl = plain.appType === 'react'
    ? (plain.reactAppUrl || `/mini-tools-react/${plain.iframeSlug}/`)
    : `/mini-tools/${plain.iframeSlug}`;

  return {
    ...plain,
    iframeUrl,
  };
}

