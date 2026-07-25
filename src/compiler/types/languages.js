export const LANGUAGES = [
  {
    id: "python",
    label: "Python",
    mode: "python",
    needsLazyLoad: true,
    template: `print("Hello, World!")`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    mode: "javascript",
    needsLazyLoad: false,
    template: `console.log("Hello, World!");`,
  },
  {
    id: "html",
    label: "HTML/CSS/JS",
    mode: "html",
    needsLazyLoad: false,
    template: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            padding: 2rem;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }
        h1 { color: #4f46e5; }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is rendered live in a sandboxed iframe.</p>
    <script>
        console.log("Page rendered successfully!");
    </script>
</body>
</html>`,
  },
  {
    id: "css",
    label: "CSS",
    mode: "css",
    needsLazyLoad: false,
    template: `/* CSS Demo — enter any CSS here */
body {
    font-family: system-ui, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
    background: white;
    border-radius: 16px;
    padding: 2rem 3rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    text-align: center;
}

h1 {
    color: #4f46e5;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

p {
    color: #666;
    font-size: 1.1rem;
}`,
  },
  {
    id: "c",
    label: "C",
    mode: "clike",
    needsLazyLoad: false,
    template: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  },
  {
    id: "cpp",
    label: "C++",
    mode: "clike",
    needsLazyLoad: false,
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
];

export const LANGUAGE_MAP = Object.fromEntries(
  LANGUAGES.map((lang) => [lang.id, lang])
);

export const DEFAULT_LANGUAGE = "javascript";

export const PREVIEW_LANGUAGES = new Set(["html", "css"]);
