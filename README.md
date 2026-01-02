# Zero Bugs Club (ZBC) - Official Website

Welcome to the official repository for the **Zero Bugs Club** website. This project is a modern, high-performance web application designed to showcase our community, events, and technical achievements.

## 🚀 Live Demo
Visit the live site: [https://zbc-website.netlify.app](https://zbc-website.netlify.app)

---

## 🛠️ Technology Stack
This project is built using a modern frontend stack focused on performance and aesthetics:
*   **Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Graphics/WebGL:** [OGL](https://github.com/oframe/ogl) (Lightweight WebGL for visual effects)
*   **Routing:** `react-router-dom`
*   **Icons:** `lucide-react`
*   **Forms:** Web3Forms (Serverless contact form)

---

## 📦 Quick Start

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/ZeroBugsClub/zbc-website.git
    cd zbc-website
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to view the site.

### Building for Production
To generate the optimized static assets:
```bash
npm run build
```
The output will be in the `dist` folder.

---

## 🔒 Maintenance Mode (Hiding & Revealing the Site)

The website includes a standalone **"Coming Soon / Maintenance"** page. This allows you to temporarily hide the main application during updates or before the official launch.

### Current Status
*   **`index.html`**: The file currently served by the browser/Netlify.
*   **`app.html`**: The main React Application entry point.
*   **`maintenance.html` (or similar)**: The standalone visual effect page.

### 🔴 HOW TO HIDE THE SITE (Maintenance Mode)
To switch to the "Coming Soon" screen:
1.  **Backup the App:** Rename the existing `index.html` to `app.html`.
    ```bash
    mv index.html app.html
    ```
2.  **Activate Maintenance Page:** Rename your maintenance file (e.g., `maintenance.html` or the specific backup you have) to `index.html`.
    ```bash
    cp maintenance.html index.html
    ```
3.  **Deploy:** Push your changes. The build process will now use the maintenance page as the entry point.

### 🟢 HOW TO UNHIDE THE SITE (Go Live)
To launch the full React application:
1.  **Backup Maintenance Page:** Rename the current `index.html` to `maintenance.html`.
    ```bash
    mv index.html maintenance.html
    ```
2.  **Activate App:** Rename `app.html` back to `index.html`.
    ```bash
    mv app.html index.html
    ```
3.  **Deploy:** Push your changes. The full site is now live.

> **Note:** The "Coming Soon" page is a standalone HTML file with zero dependencies. It will work even if the React build fails.

---

## ⚡ Deployment & Troubleshooting

### Deployment to Netlify
This site is configured for Netlify.
1.  Connect your GitHub repository to Netlify.
2.  **Build Command:** `npm run build`
3.  **Publish Directory:** `dist`

### Handling SPA Routing (404 on Refresh)
If you encounter 404 errors when refreshing pages like `/about` or `/events`:
*   Ensure the `public/_redirects` file exists.
*   It should contain: `/* /index.html 200`
*   This forces Netlify to redirect all requests to React's router.

---

<div align="center">
    Built with ❤️ by Kishal.
</div>
