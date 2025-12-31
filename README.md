# Zero Bugs Club (ZBC) Website

Welcome to the official repository for the Zero Bugs Club website. This project is a modern web application designed to serve as the digital hub for our community of developers and creators.

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### 1. Prerequisites
Ensure **Node.js** is installed on your system.
- [Download Node.js (LTS)](https://nodejs.org/)

### 2. Installation
Open your terminal, navigate to the project directory, and install the required dependencies:

```bash
npm install
```

### 3. Running Locally
Start the development server to view the application in your browser:

```bash
npm run dev
```
The terminal will provide a local URL (typically `http://localhost:5173`).

---

## � Deployment & Updates (Netlify)

We recommend **Netlify** for hosting because of its simplicity and automatic CI/CD capabilities.

### Initial Deployment
1.  **Push to GitHub**: Ensure your project code is pushed to a repository on GitHub.
2.  **Log in to Netlify**: Go to [Netlify.com](https://www.netlify.com/) and log in.
3.  **Add New Site**: Click **"Add new site"** > **"Import an existing project"**.
4.  **Connect GitHub**: Select GitHub and choose your `zbc-website` repository.
5.  **Configure Build**:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
6.  **Deploy**: Click **"Deploy Site"**. Netlify will build and publish your site in under a minute.

### Making Changes (Automatic Updates)
Once deployed, the site is linked to your GitHub repository.
1.  Make changes to your code locally.
2.  Commit and push your changes to GitHub (`git push origin main`).
3.  **Automatic Trigger**: Netlify detects the new commit and automatically rebuilds and redeploys the site.
4.  No manual action is required on the Netlify dashboard for standard updates.

---

## �🛠️ Technology Stack

We utilize a modern stack to ensure scalability, maintainability, and visual fidelity.

*   **React & Vite**: React facilitates component-based UI development, while Vite ensures rapid build times and hot module replacement.
*   **Tailwind CSS**: A utility-first framework used for efficient, responsive styling and implementation of our custom design system.
*   **Framer Motion**: Handles complex animations and page transitions, providing a polished user experience.
*   **OGL (WebGL)**: A lightweight WebGL library used to render the interactive "Light Rays" background effect efficiently.
*   **React Router**: Manages client-side routing, enabling seamless navigation without page reloads.

---

## 🧩 Architecture & Key Features

### Dynamic "Light Rays" Background
Located in `src/components/ui/LightRays.jsx`, this component uses a custom WebGL fragment shader to generate real-time atmospheric lighting. It tracks mouse movement to create subtle interactive shifts in the lighting direction.

### Design System (Glassmorphism)
The user interface employs a dark-themed glassmorphism aesthetic. This is achieved using Tailwind's `backdrop-blur` utilities layered with semi-transparent backgrounds (`bg-white/5`) and subtle borders, creating depth and hierarchy.

### Component Structure
*   `src/pages/`: Contains the main view components (Home, About, Events).
*   `src/components/`: Houses reusable UI elements.
*   `src/components/ui/`: Contains specialized visual effects.

---


