import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GalleryCarousel from '../GalleryCarousel';

const images = [
    { id: 'a', title: 'Alpha Bash', tag: 'Workshop', caption: 'First caption', src: '/gallery/alpha.webp', accent: '#3b82f6' },
    { id: 'b', title: 'Beta Night', tag: 'Hackathon', caption: 'Second caption', src: '/gallery/beta.webp', accent: '#8b5cf6' },
    { id: 'c', title: 'Gamma Sprint', tag: 'Community', caption: 'Third caption', src: '/gallery/gamma.webp', accent: '#22c55e' },
];

beforeAll(() => {
    // jsdom has no IntersectionObserver; the carousel guards for this but we
    // provide a stub to exercise the observer code path explicitly.
    class MockIntersectionObserver {
        constructor(callback) {
            this.callback = callback;
        }
        observe(target) {
            this.callback([{ isIntersecting: true, target }], this);
        }
        unobserve() {}
        disconnect() {}
    }
    globalThis.IntersectionObserver = MockIntersectionObserver;
});

describe('GalleryCarousel', () => {
    it('renders the active slide with its caption', () => {
        render(<GalleryCarousel images={images} />);
        expect(screen.getByText(images[0].title)).toBeInTheDocument();
        expect(screen.getByText(images[0].caption)).toBeInTheDocument();
    });

    it('renders one thumbnail button per image', () => {
        render(<GalleryCarousel images={images} />);
        expect(screen.getAllByRole('button', { name: /^Show / })).toHaveLength(images.length);
    });

    it('advances to the next slide when the next control is clicked', async () => {
        const user = userEvent.setup();
        render(<GalleryCarousel images={images} autoPlayInterval={100000} />);

        await user.click(screen.getByRole('button', { name: 'Next image' }));

        await waitFor(() => {
            expect(screen.getByText(images[1].title)).toBeInTheDocument();
        });
    });

    it('jumps to a specific slide when a thumbnail is selected', async () => {
        const user = userEvent.setup();
        render(<GalleryCarousel images={images} autoPlayInterval={100000} />);

        await user.click(screen.getByRole('button', { name: `Show ${images[2].title}` }));

        await waitFor(() => {
            expect(screen.getByText(images[2].title)).toBeInTheDocument();
        });
    });
});