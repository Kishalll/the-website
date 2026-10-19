import React from 'react';
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DomeGallery from '../DomeGallery';

const images = [
    {
        src: '/gallery/alpha.webp',
        alt: 'Alpha Bash',
        title: 'Alpha Bash',
        tag: 'Workshop',
        caption: 'Full-stack build night — 6 hours, 14 shipped demos.',
    },
    {
        src: '/gallery/beta.webp',
        alt: 'Beta Night',
        title: 'Beta Night',
        tag: 'Hackathon',
        caption: 'Overnight sprint that turned ideas into working prototypes.',
    },
    {
        src: '/gallery/gamma.webp',
        alt: 'Gamma Sprint',
        title: 'Gamma Sprint',
        tag: 'Community',
        caption: 'First merged pull requests — worlds changed, bugs squashed.',
    },
];

const GAP = 14; // DEFAULTS.tileGap
const RING_COUNT = 3; // DEFAULTS.ringCount

beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true, writable: true });
    Object.defineProperty(window, 'innerHeight', {
        value: 768,
        configurable: true,
        writable: true,
    });
    class MockResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    globalThis.ResizeObserver = MockResizeObserver;
});

afterEach(() => {
    vi.restoreAllMocks();
});

const getRings = (container) => [...container.querySelectorAll('.ring')];

describe('DomeGallery', () => {
    it('renders three stacked rings with distinct vertical offsets (middle centered)', () => {
        const { container } = render(<DomeGallery images={images} minSlots={12} />);
        const rings = getRings(container);
        expect(rings).toHaveLength(RING_COUNT);

        const offsets = rings.map((el) => el.style.getPropertyValue('--ring-y'));
        expect(new Set(offsets).size).toBe(RING_COUNT);
        expect(rings[1].style.getPropertyValue('--ring-y')).toBe('0px');
        const numbers = offsets.map((v) => parseFloat(v));
        expect(numbers[0]).toBeLessThan(0);
        expect(numbers[2]).toBeGreaterThan(0);
    });

    it('gives every ring its own random direction and speed', () => {
        const { container } = render(<DomeGallery images={images} />);
        const rings = getRings(container);

        const dirs = rings.map((el) => Number(el.dataset.dir));
        expect(new Set(dirs).size).toBe(2);
        expect(dirs).toContain(1);
        expect(dirs).toContain(-1);

        const speeds = rings.map((el) => Number(el.dataset.speed));
        expect(speeds).toHaveLength(RING_COUNT);
        speeds.forEach((s) => expect(s).toBeGreaterThan(0));
        expect(new Set(speeds).size).toBe(RING_COUNT);

        const starts = rings.map((el) => el.style.getPropertyValue('--ring-spin'));
        starts.forEach((v) => expect(v).toMatch(/deg$/));
    });

    it('sizes the ring to span the full site width (no side margins)', () => {
        const { container } = render(<DomeGallery images={images} />);
        const root = container.querySelector('.sphere-root');
        const radius = parseFloat(root.style.getPropertyValue('--radius'));
        expect(radius).toBeGreaterThan(0);
        // Ring diameter reaches (and slightly passes) the viewport edges once
        // projected, so there is no leftover margin on either side.
        expect(radius).toBeGreaterThanOrEqual(window.innerWidth / 2);
        expect(radius).toBeLessThanOrEqual(window.innerWidth);
    });

    it('renders one button per unique image and fills the remaining slots with placeholders', () => {
        const { container } = render(<DomeGallery images={images} minSlots={12} />);
        expect(screen.getAllByRole('button')).toHaveLength(3);

        const items = container.querySelectorAll('.item');
        const placeholders = container.querySelectorAll('.item--placeholder');
        expect(items.length).toBeGreaterThan(3);
        expect(placeholders).toHaveLength(items.length - 3);
        expect(placeholders.length).toBeGreaterThanOrEqual(RING_COUNT);
    });

    it('spreads unique images across the rings without repeats', () => {
        const { container } = render(<DomeGallery images={images} minSlots={12} />);
        getRings(container).forEach((ring) => {
            expect(ring.querySelectorAll('[role="button"]')).toHaveLength(1);
        });
        const srcs = [...container.querySelectorAll('.item')].map((el) => el.dataset.src).filter(Boolean);
        expect(srcs).toHaveLength(3);
        expect(new Set(srcs).size).toBe(3);
    });

    it('expands the rings when more unique images are added, without repeats', () => {
        const { rerender, container } = render(<DomeGallery images={images} minSlots={3} />);
        expect(screen.getAllByRole('button')).toHaveLength(3);
        const before = container.querySelectorAll('.item').length;

        const many = Array.from({ length: 40 }, (_, i) => ({
            src: `/gallery/img-${i}.webp`,
            alt: `Shot ${i}`,
        }));
        rerender(<DomeGallery images={many} minSlots={3} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(40);
        expect(new Set(buttons.map((b) => b.getAttribute('aria-label'))).size).toBe(40);

        const after = container.querySelectorAll('.item').length;
        expect(after).toBeGreaterThanOrEqual(40);
        expect(after).toBeGreaterThanOrEqual(before);
    });

    it('deduplicates repeated image sources', () => {
        const dupes = [...images, { src: '/gallery/alpha.webp', alt: 'Alpha Again' }];
        render(<DomeGallery images={dupes} minSlots={4} />);
        expect(screen.getAllByRole('button', { name: 'Alpha Bash' })).toHaveLength(1);
        expect(screen.queryAllByRole('button', { name: 'Alpha Again' })).toHaveLength(0);
    });

    it('fills every ring with colored placeholders when no images exist', () => {
        const { container } = render(<DomeGallery images={[]} minSlots={5} />);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
        const placeholders = container.querySelectorAll('.item__image--placeholder');
        expect(placeholders.length).toBeGreaterThanOrEqual(RING_COUNT);
        expect(placeholders).toHaveLength(container.querySelectorAll('.item').length);
        const colors = [...placeholders].map((el) => el.style.background);
        expect(new Set(colors).size).toBeLessThanOrEqual(3);
        colors.forEach((c) => expect(c).toMatch(/rgb|#/));
        // Every ring participates in the fill.
        getRings(container).forEach((ring) => {
            expect(ring.querySelectorAll('.item--placeholder').length).toBeGreaterThan(0);
        });
    });

    it('labels tiles with the provided alt text', () => {
        render(<DomeGallery images={images} minSlots={6} />);
        expect(screen.getAllByRole('button', { name: 'Alpha Bash' }).length).toBe(1);
    });

    it('renders the dome overlays and viewer frame', () => {
        const { container } = render(<DomeGallery images={images} minSlots={6} />);
        expect(container.querySelector('.overlay--blur')).toBeInTheDocument();
        expect(container.querySelector('.viewer .frame')).toBeInTheDocument();
    });

    it('applies the grayscale filter by default', () => {
        const { container } = render(<DomeGallery images={images} minSlots={6} />);
        expect(container.querySelector('.sphere-root').style.getPropertyValue('--image-filter')).toBe(
            'grayscale(1)'
        );
    });

    it('mixes tile sizes (big, medium, small) around every ring', () => {
        const { container } = render(<DomeGallery images={images} minSlots={12} />);
        getRings(container).forEach((ring) => {
            const widths = [...ring.querySelectorAll('.item')].map((el) =>
                parseFloat(el.style.getPropertyValue('--item-w'))
            );
            expect(widths.length).toBeGreaterThanOrEqual(4);
            // At least three distinct sizes present.
            expect(new Set(widths).size).toBeGreaterThanOrEqual(3);
            // Sizes scale off a shared base, so the ratio between smallest and
            // largest should match the tier spread (0.66x .. 1.5x).
            const ratio = Math.max(...widths) / Math.min(...widths);
            expect(ratio).toBeGreaterThan(1.5);
            expect(ratio).toBeLessThan(3);
        });
    });

    it('places non-overlapping tiles whose spans close the full 360° on every ring', () => {
        const { container } = render(<DomeGallery images={images} minSlots={12} />);
        const root = container.querySelector('.sphere-root');
        const radius = parseFloat(root.style.getPropertyValue('--radius'));
        expect(radius).toBeGreaterThan(0);

        getRings(container).forEach((ring) => {
            const items = [...ring.querySelectorAll('.item')];
            const n = items.length;
            const gapEff = Math.min(GAP, (0.3 * 2 * Math.PI * radius) / n);

            const spans = items.map((el) => {
                const w = parseFloat(el.style.getPropertyValue('--item-w'));
                return 2 * Math.atan(w / (2 * radius)) + gapEff / radius;
            });
            const totalDeg = (spans.reduce((s, v) => s + v, 0) * 180) / Math.PI;
            expect(totalDeg).toBeCloseTo(360, 0);

            // Angles are strictly increasing and stay within one revolution.
            const angles = items.map((el) => parseFloat(el.dataset.angle));
            for (let i = 1; i < angles.length; i++) {
                expect(angles[i]).toBeGreaterThan(angles[i - 1]);
            }
            expect(angles[angles.length - 1]).toBeLessThan(360);
        });
    });

    it('surfaces the title, tag and caption on each tile', () => {
        const { container } = render(<DomeGallery images={images} minSlots={12} />);
        const alpha = container.querySelector('.item[data-title="Alpha Bash"]');
        expect(alpha).not.toBeNull();
        expect(alpha.dataset.tag).toBe('Workshop');
        expect(alpha.dataset.caption).toContain('build night');
        expect(alpha.dataset.src).toBe('/gallery/alpha.webp');

        const beta = container.querySelector('.item[data-title="Beta Night"]');
        expect(beta).not.toBeNull();
        expect(beta.dataset.tag).toBe('Hackathon');
    });

    it('opens a big preview with the image, title and details on click', async () => {
        const rect = {
            left: 0,
            top: 0,
            right: 300,
            bottom: 200,
            width: 300,
            height: 200,
            x: 0,
            y: 0,
            toJSON: () => {},
        };
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(rect);

        const { container } = render(
            <DomeGallery
                images={images}
                minSlots={12}
                openedImageWidth="900px"
                openedImageHeight="640px"
            />
        );

        const btn = screen.getAllByRole('button', { name: 'Alpha Bash' })[0];
        fireEvent.click(btn);

        const overlay = container.querySelector('.viewer .enlarge');
        expect(overlay).toBeInTheDocument();
        expect(overlay.querySelector('img').getAttribute('src')).toBe('/gallery/alpha.webp');
        expect(overlay.querySelector('img').getAttribute('alt')).toBe('Alpha Bash');
        expect(overlay.querySelector('.enlarge__title')).toBeNull();
        expect(overlay.querySelector('.enlarge__tag').textContent).toBe('Workshop');
        expect(overlay.querySelector('.enlarge__caption').textContent).toContain('build night');

        // After the expand transition the card resizes to the big preview.
        const ev = new Event('transitionend', { bubbles: true });
        ev.propertyName = 'transform';
        fireEvent(overlay, ev);
        await waitFor(() => {
            expect(overlay.style.width).toBe('900px');
            expect(overlay.style.height).toBe('640px');
        });
    });

    it('spaces rings to span 1/3rd of the viewport height each on vertical screens', () => {
        const origW = window.innerWidth;
        const origH = window.innerHeight;
        window.innerWidth = 390;
        window.innerHeight = 844;
        try {
            const { container } = render(<DomeGallery images={images} minSlots={12} />);
            const rings = getRings(container);
            expect(rings).toHaveLength(RING_COUNT);
            const offsets = rings.map((el) => parseFloat(el.style.getPropertyValue('--ring-y')));
            expect(offsets[1]).toBe(0);
            expect(offsets[0]).toBeCloseTo(-844 / 3, 0);
            expect(offsets[2]).toBeCloseTo(844 / 3, 0);
        } finally {
            window.innerWidth = origW;
            window.innerHeight = origH;
        }
    });

    it('preserves the original uploaded image aspect ratio in the enlarged preview', async () => {
        const rect = {
            left: 0,
            top: 0,
            right: 1040,
            bottom: 760,
            width: 1040,
            height: 760,
            x: 0,
            y: 0,
            toJSON: () => {},
        };
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(rect);

        const { container } = render(
            <DomeGallery
                images={images}
                minSlots={12}
                openedImageWidth="1040px"
                openedImageHeight="760px"
            />
        );

        const btn = screen.getAllByRole('button', { name: 'Alpha Bash' })[0];
        const tileImg = btn.querySelector('img');
        Object.defineProperty(tileImg, 'naturalWidth', { value: 1600, configurable: true });
        Object.defineProperty(tileImg, 'naturalHeight', { value: 900, configurable: true });

        fireEvent.click(btn);

        const overlay = container.querySelector('.viewer .enlarge');
        expect(overlay).toBeInTheDocument();

        const ev = new Event('transitionend', { bubbles: true });
        ev.propertyName = 'transform';
        fireEvent(overlay, ev);
        await waitFor(() => {
            const w = parseFloat(overlay.style.width);
            const h = parseFloat(overlay.style.height);
            expect(w / h).toBeCloseTo(1600 / 900, 2);
        });
    });
});
