### MovieTV App Frontend

#### Overview

This project is a **Next.js** frontend for a MovieTV app, utilizing **TypeScript** and **MUI Devias** as a baseline. The app provides functionality for users to view titles, add reviews, delete reviews, and more. Users can authenticate using **Google login**, manage their profiles, and verify their email addresses for sign-up and password resets. The frontend also supports **dark mode** and employs improved context management using `useReducer`. Environment variables have been introduced for easy configuration.

#### Installation and Setup

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd <project-directory>
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables by creating a `.env` file in the root directory and adding the following values:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
NEXT_PUBLIC_SITE_URL=<your-site-url>
```

5. Start the development server:

```bash
npm run dev
```

#### Usage

- Navigate to the homepage to explore available titles.
- Sign up or log in with Google to access additional features.
- Manage your user profile and settings.
- Add reviews to titles or delete your own reviews.
- Admin users can add new titles and delete reviews from any user.

#### Features

- **Google Login**: Use your Google account for authentication.
- **Email Verification**: For sign-up and password reset functionality.
- **Profile Management**: Users can update their profiles.
- **Dark Mode Support**: Toggle between light and dark modes.
- **Context Management**: Enhanced state management using `useReducer`.

#### Dependencies

- **Next.js**
- **TypeScript**
- **Material-UI (MUI)**
- **Axios**
- **Google API Client**
- **Django Backend Running**

#### Docker Production Setup

- Dockerfile is available for production deployment.

#### Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Create a new Pull Request.

#### License

This project is licensed under the MIT License. See the LICENSE file for details.
