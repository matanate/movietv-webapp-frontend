### MovieTV App Frontend

#### Overview

This project is a React-based frontend for a MovieTV app, which allows users to view titles, add reviews, delete reviews, and perform other related actions. The frontend utilizes Axios for API calls and JWT authentication for user management. Additionally, admin users have additional privileges such as adding titles and deleting reviews.

#### Installation and Setup

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
git cd <project-directory>
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

#### Configuration

- Set the API URL in the src/utils/useAxios.js and src/context/AuthContext.js file to point to your backend server.

#### Usage

- Navigate to the homepage to explore available titles.
- Sign up or log in to access additional features.
- Add reviews to titles or delete your own reviews.
- Admin users can add new titles and delete reviews from any user.

#### Dependencies

- React
- Axios
- Django Backend Running

#### Docker Production Setup

- Dockerfile and nginx.conf are available for production.

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
