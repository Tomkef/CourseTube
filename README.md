# CourseTube

This is my first public project. Hope you'll like it and find it useful.

CourseTube is an Udemy-like platform for converting Youtube videos to courses.

Every Youtube video that contains chapters can be used by this platform.

## Features

- Automatic tracking of viewed chapters and course's progress.

- Take notes while watching videos.

- Authentication.

- Watch recently added courses of all users.

## Live Site

[https://coursetube.vercel.app](https://coursetube.vercel.app)

## Tech Stack

- [Next.js](https://nextjs.org/)

- [TypeScript](https://www.typescriptlang.org/)

- [MongoDB](https://www.mongodb.com/)

- [NextAuth.js](https://next-auth.js.org/)

- [Mantine](https://mantine.dev/)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

\*\* Notice that an `example.env.local` file is included in the repo

`MONGODB_URI` = [Your mongoDB connection string]

`NEXTAUTH_URL` = [Your domain full URL path]/api/auth

`NEXT_AUTH_SECRET` = [A secret for your NEXT-AUTH]

`YOUTUBE_API_KEY` = [Your Youtube API KEY]

`NEXT_PUBLIC_BASE_URL` = [YOUR domaion full URL path]/ (with '/' afterward)

## Run Locally

Clone the project

```bash
  git clone https://github.com/Tomkef/CourseTube.git
```

Go to the project directory

```bash
  cd coursetube
```

Install dependencies

```bash
  npm install
```

Change `example.env.local` filename to `.env.local` and fill with your data

Run the development server or run the production build:

- Development:

  Start the server

  ```bash
    npm run dev
  ```

- Production:

  Build

  ```bash
    npm run build
  ```

  Start the server

  ```bash
    npm start
  ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

To deploy this project run

```bash
  npm run start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Author

[Tom Kaufman](https://www.github.com/tomkef)
