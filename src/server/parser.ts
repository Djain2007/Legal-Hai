/** Accepted image MIME types for legal document analysis via vision AI. */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',  // single-frame only
] as const;

export type AcceptedImageMimeType = typeof ACCEPTED_IMAGE_TYPES[number];

/**
 * Validates that the uploaded file is a supported image type.
 * Returns the mime type cast to AcceptedImageMimeType on success,
 * or throws an informative error on failure.
 */
export function validateImageFile(
  mimeType: string
): AcceptedImageMimeType {
  if (ACCEPTED_IMAGE_TYPES.includes(mimeType as AcceptedImageMimeType)) {
    return mimeType as AcceptedImageMimeType;
  }
  throw new Error(
    `Unsupported file type: "${mimeType}". Please upload a JPG, PNG, or WebP image of your legal document.`
  );
}
