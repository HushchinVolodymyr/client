# University Course Management Client

This is the frontend client for the University Course Management System. It is built with [Next.js](https://nextjs.org), TypeScript, and Tailwind CSS. The client provides a modern, responsive interface for students and instructors to manage courses, tasks, groups, and communication.

## Features

- User authentication and registration
- Course browsing and enrollment
- Task creation, submission, and grading
- File upload and download for assignments
- Group and role management
- Real-time chat and notifications
- Responsive UI with [shadcn/ui](https://ui.shadcn.com/) components

## Project Structure

- `src/` - Main application source code
  - `app/` - Next.js app directory (pages, layouts, routes)
  - `components/` - Reusable UI components
  - `lib/` - Utility functions and libraries
  - `hooks/` - Custom React hooks
  - `public/` - Static assets
- `ssl/` - SSL certificates for local development
- `Dockerfile` - Docker configuration for deployment
- `next.config.ts` - Next.js configuration
- `package.json` - Project dependencies and scripts

## Getting Started

First, install dependencies:

```sh
npm install
# or
yarn install
```

Then, run the development server:
```sh
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser to view the app.

## Environment Variables

Create a .env file in the root of the client directory and configure the following variables as needed

```sh
NEXT_PUBLIC_API_URL=
```

## Building for Production

```sh
npm run build
npm start
```

## License

This project is licensed under the MIT License.
