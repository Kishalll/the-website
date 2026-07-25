import React from "react";

export function PythonIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M11.87 2c-4.47 0-4.19 1.94-4.19 1.94l.01 2.01h4.24v.6H6.01S2 6.09 2 10.59c0 4.5 3.5 4.34 3.5 4.34h1.2v-1.68s-.06-2.02 1.98-2.02h3.42s1.91.03 1.91-1.87V5.51s.29-3.51-4.14-3.51zm-2.3 1.34a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"
        fill="#3776AB"
      />
      <path
        d="M12.13 22c4.47 0 4.19-1.94 4.19-1.94l-.01-2.01h-4.24v-.6h5.92s4.01.46 4.01-4.04c0-4.5-3.5-4.34-3.5-4.34h-1.2v1.68s.06 2.02-1.98 2.02h-3.42s-1.91-.03-1.91 1.87v3.85s-.29 3.51 4.14 3.51zm2.3-1.34a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
        fill="#FFD43B"
      />
    </svg>
  );
}

export function JSIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <path
        d="M12.87 18.15c.61.35 1.33.58 2.06.58 1.13 0 1.76-.53 1.76-1.3 0-.85-.66-1.22-1.78-1.71l-.61-.26c-1.76-.74-2.92-1.66-2.92-3.66 0-2.22 1.74-3.77 4.54-3.77 1.37 0 2.45.31 3.22.75l-.94 1.81c-.57-.33-1.37-.57-2.28-.57-1.11 0-1.6.5-1.6 1.14 0 .79.62 1.13 1.87 1.68l.61.26c2.01.87 2.92 1.86 2.92 3.73 0 2.37-1.87 3.86-4.94 3.86-1.62 0-2.84-.37-3.72-.89l.81-1.65zM5.7 18.25c.57.33 1.25.55 1.95.55.98 0 1.51-.44 1.51-1.57V8.25h2.51v9.01c0 2.5-1.42 3.74-3.9 3.74-1.3 0-2.45-.33-3.18-.8l1.11-1.95z"
        fill="#000000"
      />
    </svg>
  );
}

export function HtmlIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4.5 2h15l-1.36 15.34L12 19.5l-6.14-2.16L4.5 2z" fill="#E34F26" />
      <path d="M12 3.66v14.07l4.89-1.72 1.12-12.35H12z" fill="#EF652A" />
      <path d="M8.02 6.64h7.96l-.26 2.9H8.28l.26 2.91h7.16l-.52 5.82L12 19.26l-3.18-1.09-.22-2.48H6.56l.39 4.38L12 21.5l6.05-2.07.82-9.22.25-2.82H8.02z" fill="#FFFFFF" />
    </svg>
  );
}

export function CssIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4.5 2h15l-1.36 15.34L12 19.5l-6.14-2.16L4.5 2z" fill="#1572B6" />
      <path d="M12 3.66v14.07l4.89-1.72 1.12-12.35H12z" fill="#33A9DC" />
      <path d="M15.7 6.64H8.02l.26 2.9h7.16l-.26 2.91H8.54l.26 2.91L12 16.45l3.18-1.09.28-3.05h2.04l-.46 5.14L12 19.5l-6.05-2.07L4.85 6.64h10.85z" fill="#FFFFFF" />
    </svg>
  );
}

export function CIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="4" fill="#00599C" />
      <path
        d="M16.5 16.2c-.8.6-1.8.9-2.9.9-2.8 0-4.6-2-4.6-4.9 0-2.9 1.8-4.9 4.6-4.9 1.1 0 2.1.3 2.9.9l1-1.7c-1.1-.8-2.5-1.2-3.9-1.2-4.2 0-7.2 2.9-7.2 6.9s3 6.9 7.2 6.9c1.4 0 2.8-.4 3.9-1.2l-1-1.7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function CppIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="4" fill="#004482" />
      <path
        d="M11.5 15.2c-.6.4-1.3.6-2.1.6-2 0-3.3-1.4-3.3-3.5s1.3-3.5 3.3-3.5c.8 0 1.5.2 2.1.6l.7-1.3c-.8-.5-1.8-.8-2.8-.8-3 0-5.1 2.1-5.1 5s2.1 5 5.1 5c1 0 2-.3 2.8-.8l-.7-1.3zM14 11.3h-1v1.4h1v1h1.4v-1h1v-1.4h-1v-1H14v1zm5 0h-1v1.4h1v1h1.4v-1h1v-1.4h-1v-1H19v1z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
