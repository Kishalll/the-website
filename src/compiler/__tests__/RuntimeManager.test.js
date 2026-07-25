import { describe, it, expect } from 'vitest';
import { RuntimeManager, JavaScriptRuntime, HtmlRuntime } from '../runtime';
import { LANGUAGES, DEFAULT_LANGUAGE, PREVIEW_LANGUAGES } from '../types/languages';

describe('Compiler RuntimeManager & Language Config', () => {
  it('defines the expected languages', () => {
    const langIds = LANGUAGES.map((l) => l.id);
    expect(langIds).toContain('javascript');
    expect(langIds).toContain('python');
    expect(langIds).toContain('html');
    expect(langIds).toContain('css');
    expect(langIds).toContain('c');
    expect(langIds).toContain('cpp');
  });

  it('sets JavaScript as the default language', () => {
    expect(DEFAULT_LANGUAGE).toBe('javascript');
  });

  it('identifies preview languages correctly', () => {
    expect(PREVIEW_LANGUAGES.has('html')).toBe(true);
    expect(PREVIEW_LANGUAGES.has('css')).toBe(true);
    expect(PREVIEW_LANGUAGES.has('python')).toBe(false);
  });

  it('executes JavaScript runtime synchronously', async () => {
    const jsRuntime = new JavaScriptRuntime();
    await jsRuntime.load();
    const result = await jsRuntime.execute('console.log("Hello from test");', null);

    expect(result.status).toBe('success');
    expect(result.stdout).toContain('Hello from test');
  });

  it('validates HTML runtime live preview message', async () => {
    const htmlRuntime = new HtmlRuntime();
    await htmlRuntime.load();
    const result = await htmlRuntime.execute('<h1>Test</h1>', null);

    expect(result.status).toBe('success');
    expect(result.stdout).toContain('Live Preview panel');
  });
});
