// Loads the gallery from an external manifest so images are never hardcoded.
// The manifest lives next to the images in the public folder and only needs to
// describe the human-facing metadata plus the image filename. Every other field
// (src, lazy-blur placeholder, dimensions) is derived at runtime.

export const GALLERY_BASE = '/gallery';

const ACCENTS = [
    '#3b82f6',
    '#8b5cf6',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
    '#a855f7',
];

const hashString = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const withExtension = (filename, extension) => {
    const dot = filename.lastIndexOf('.');
    if (dot === -1) return `${filename}${extension}`;
    return `${filename.slice(0, dot)}${extension}`;
};

export const resolveGalleryImage = (entry) => `${
    entry.src ?? (entry.image
        ? `${GALLERY_BASE}/${entry.image}`
        : `${GALLERY_BASE}/${entry.name?.toLowerCase().replace(/\s+/g, '-')}.webp`)
}`;

export const resolveGalleryBlur = (entry) => {
    if (entry.blur) return entry.blur;
    if (!entry.image) return undefined;
    return `${GALLERY_BASE}/${withExtension(entry.image, '-blur.webp')}`;
};

export const normalizeGalleryEntry = (entry, index = 0) => {
    const src = resolveGalleryImage(entry);
    return {
        id: entry.id ?? entry.image ?? `gallery-${index}`,
        title: entry.name ?? entry.title ?? '',
        tag: entry.type ?? entry.tag ?? '',
        caption: entry.desc ?? entry.caption ?? '',
        image: entry.image,
        src,
        blur: resolveGalleryBlur(entry),
        width: entry.width ?? 1280,
        height: entry.height ?? 800,
        accent: entry.accent ?? ACCENTS[hashString(entry.image ?? String(index)) % ACCENTS.length],
    };
};

export const normalizeGalleryManifest = (manifest) => {
    const list = Array.isArray(manifest) ? manifest : manifest?.images;
    if (!Array.isArray(list)) return [];
    return list.map(normalizeGalleryEntry);
};

export const loadGalleryImages = async (signal) => {
    const response = await fetch(`${GALLERY_BASE}/manifest.json`, { signal });
    if (!response.ok) {
        throw new Error(`Failed to load gallery manifest (${response.status})`);
    }
    const manifest = await response.json();
    return normalizeGalleryManifest(manifest);
};

export default loadGalleryImages;