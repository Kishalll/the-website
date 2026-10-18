// The gallery is every image dropped into public/gallery — no manifest needed.
// Vite scans that folder at build time (and watches it in dev), so adding or
// removing a file automatically adds or removes it from the ring. Blur
// companions (*-blur.*) and hidden files are skipped; a human-readable title
// is derived from the filename for labels and the preview card.

export const GALLERY_BASE = '/gallery';

const galleryModules = import.meta.glob('../../public/gallery/*.{avif,gif,jpeg,jpg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
});

export const titleFromFilename = (filename) => {
    const base = filename.replace(/\.[^.]+$/, '').replace(/-blur$/i, '');
    return base
        .split(/[-_]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const isGalleryImageName = (filename) =>
    !filename.startsWith('.') && !/-blur\.[^.]+$/i.test(filename);

export const loadGalleryImages = async () =>
    Object.entries(galleryModules)
        .map(([modulePath, src]) => ({ src, name: modulePath.split('/').pop() }))
        .filter(({ name }) => isGalleryImageName(name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ src, name }) => ({
            id: name,
            title: titleFromFilename(name),
            tag: '',
            caption: '',
            src,
        }));

export default loadGalleryImages;
