import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QRCodePage from '../QRCodePage';
import ToolsPage from '../ToolsPage';

// Mock qr-code-styling class
vi.mock('qr-code-styling', () => {
  class MockQRCodeStyling {
    constructor() {}
    append(container) {
      if (container) {
        const dummyCanvas = document.createElement('canvas');
        container.appendChild(dummyCanvas);
      }
    }
    update() {}
    download() {}
  }
  return {
    default: MockQRCodeStyling
  };
});

// Mock FogBackground
vi.mock('../../components/ui/FogBackground', () => ({
  default: () => <div data-testid="fog-background" />
}));

describe('QR Code Feature', () => {
  it('displays the QR Code Generator card on ToolsPage', () => {
    render(
      <BrowserRouter>
        <ToolsPage />
      </BrowserRouter>
    );

    expect(screen.getByText('QR Code Generator')).toBeInTheDocument();
    expect(screen.getByText(/Create customizable QR codes/i)).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('renders QRCodePage with tabs, live preview, and download buttons', () => {
    render(
      <BrowserRouter>
        <QRCodePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Canva-Style QR Generator')).toBeInTheDocument();
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /PNG/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SVG/i })).toBeInTheDocument();

    // Verify tabs exist and presets tab is removed
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Shapes')).toBeInTheDocument();
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.queryByText('Presets')).not.toBeInTheDocument();

    // Verify default URL text
    expect(screen.getByDisplayValue('https://before-build-26.vercel.app/')).toBeInTheDocument();
  });

  it('switches between tabs and shows respective controls', () => {
    render(
      <BrowserRouter>
        <QRCodePage />
      </BrowserRouter>
    );

    // Click Shapes tab
    fireEvent.click(screen.getByText('Shapes'));
    expect(screen.getByText('Dot Pattern Style')).toBeInTheDocument();
    expect(screen.getByText('Corner Frame Shape')).toBeInTheDocument();

    // Click Colors tab
    fireEvent.click(screen.getByText('Colors'));
    expect(screen.getByText('Gradient Fill')).toBeInTheDocument();
    expect(screen.getByText('Background Color')).toBeInTheDocument();

    // Click Logo tab
    fireEvent.click(screen.getByText('Logo'));
    expect(screen.getByText('Center Logo Image')).toBeInTheDocument();
  });
});
