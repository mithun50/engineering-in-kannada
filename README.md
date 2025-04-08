# Engineering in Kannada

A platform for learning engineering concepts in Kannada through YouTube playlists and course materials.

## Features

- Browse available courses
- Track video progress
- Bookmark favorite videos
- View course materials and coding exercises
- Responsive design for all devices

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Netlify

### Prerequisites
- A Netlify account
- Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Steps to Deploy

1. **Push your code to a Git repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy to Netlify**
   - Log in to your [Netlify account](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect to your Git provider and select your repository
   - Configure the build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Configure Environment Variables (if needed)**
   - Go to Site settings > Build & deploy > Environment
   - Add any required environment variables

4. **Set up Custom Domain (optional)**
   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Follow the instructions to configure your domain

### Post-Deployment

- Your site will be available at `https://your-site-name.netlify.app`
- Netlify will automatically deploy new changes when you push to your repository
- You can enable HTTPS for your custom domain in the Netlify dashboard

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (State Management)
- Canvas Confetti (Celebration Effects) 