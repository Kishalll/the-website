import { describe, it, expect } from 'vitest';
import {
    GALLERY_BASE,
    normalizeGalleryEntry,
    normalizeGalleryManifest,
    resolveGalleryBlur,
    resolveGalleryImage,
} from '../gallery';

describe('gallery manifest helpers', () => {
    it('resolves a filename to an image path in the gallery folder', () => {
        expect(resolveGalleryImage({ image: 'ctf-finals.webp' })).toBe(`${GALLERY_BASE}/ctf-finals.webp`);
    });

    it('derives the blur placeholder from the image filename', () => {
        expect(resolveGalleryBlur({ image: 'ctf-finals.webp' })).toBe(
            `${GALLERY_BASE}/ctf-finals-blur.webp`
        );
    });

    it('normalizes a manifest entry into carousel props', () => {
        const entry = normalizeGalleryEntry({
            name: 'CTF Finals',
            type: 'Competition',
            desc: 'Capture the flag.',
            image: 'ctf-finals.webp',
        });

        expect(entry).toMatchObject({
            title: 'CTF Finals',
            tag: 'Competition',
            caption: 'Capture the flag.',
            src: `${GALLERY_BASE}/ctf-finals.webp`,
            blur: `${GALLERY_BASE}/ctf-finals-blur.webp`,
        });
        expect(entry.accent).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('normalizes a manifest object with an images array', () => {
        const list = normalizeGalleryManifest({
            images: [
                { name: 'A', type: 'X', desc: 'a', image: 'a.webp' },
                { name: 'B', type: 'Y', desc: 'b', image: 'b.webp' },
            ],
        });

        expect(list).toHaveLength(2);
        expect(list[1].src).toBe(`${GALLERY_BASE}/b.webp`);
    });

    it('returns an empty array for malformed manifests', () => {
        expect(normalizeGalleryManifest(null)).toEqual([]);
        expect(normalizeGalleryManifest({})).toEqual([]);
        expect(normalizeGalleryManifest({ images: 'nope' })).toEqual([]);
    });
});