/**
 * Ensures all tags exist in the database, creating them if they don't.
 * Returns a promise that resolves when all tags are created.
 */
export async function ensureTagsExist(tags: string[]): Promise<void> {
  if (!tags || tags.length === 0) {
    return;
  }

  try {
    // Create all tags in parallel, ignoring duplicates
    await Promise.all(
      tags.map(async (tag) => {
        const normalizedTag = tag.trim().toLowerCase();
        if (!normalizedTag) return;

        try {
          const response = await fetch("/api/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: normalizedTag }),
          });

          // If tag already exists (200 or 409), that's fine
          if (!response.ok && response.status !== 409) {
            console.warn(`Failed to create tag "${normalizedTag}":`, await response.text());
          }
        } catch (error) {
          console.warn(`Error creating tag "${normalizedTag}":`, error);
          // Continue even if one tag fails
        }
      })
    );
  } catch (error) {
    console.error("Error ensuring tags exist:", error);
    // Don't throw - allow the save to continue even if tag creation fails
  }
}

