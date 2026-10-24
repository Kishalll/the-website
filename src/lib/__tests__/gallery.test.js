import { describe, it, expect } from 'vitest';
import {
    loadGalleryImages,
    titleFromFilename,
    isGalleryImageName,
    GALLERY_BASE,
} from '../gallery';

describe('gallery image discovery', () => {
    it('exposes the public gallery base path', () => {
        expect(GALLERY_BASE).toBe('/gallery');
    });

    it('derives readable titles from filenames', () => {
        expect(titleFromFilename('bytecode-bash.webp')).toBe('Bytecode Bash');
        expect(titleFromFilename('gamejam.png')).toBe('Gamejam');
        expect(titleFromFilename('open_house_2024.jpg')).toBe('Open House 2024');
        expect(titleFromFilename('ctf-finals-blur.webp')).toBe('Ctf Finals');
    });

    it('skips blur companions and hidden files', () => {
        expect(isGalleryImageName('hacknight.webp')).toBe(true);
        expect(isGalleryImageName('hacknight-blur.webp')).toBe(false);
        expect(isGalleryImageName('.DS_Store')).toBe(false);
    });

    it('loads every real image in the gallery folder, unique and sorted', async () => {
        const images = await loadGalleryImages();
        expect(images.length).toBeGreaterThanOrEqual(1);

        const srcs = images.map((image) => image.src);
        expect(new Set(srcs).size).toBe(srcs.length);
        srcs.forEach((src) => {
            expect(typeof src).toBe('string');
            expect(src).toBeTruthy();
        });

        images.forEach((image) => {
            expect(image.src).toBeTruthy();
            expect(image.title.length).toBeGreaterThan(0);
            expect(image.tag).toBe('');
            expect(image.caption).toBe('');
            expect(isGalleryImageName(image.id)).toBe(true);
        });

        const names = images.map((image) => image.id);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });
});
