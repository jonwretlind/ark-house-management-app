# Ark House Management System

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

<pre>
├── /backend/                       # Root folder for the backend
│   ├── controllers/               # Contains all the controller files
│   │   ├── authController.js      # Handles user registration, login, and authentication
│   │   ├── taskController.js      # Handles CRUD operations for tasks and task verification
│   ├── middleware/                # Contains the JWT authentication middleware
│   │   ├── authMiddleware.js      # Middleware to verify JWT and protect routes
│   ├── models/                    # Contains the Mongoose models
│   │   ├── User.js                # User schema with permissions and account balance
│   │   ├── Task.js                # Task schema for tasks assigned to users
│   ├── routes/                    # Express route handlers
│   │   ├── authRoutes.js          # Routes for user registration and login
│   │   ├── taskRoutes.js          # Routes for task management (admin and non-admin users)
│   ├── .env                       # Environment variables (JWT secret, MongoDB URI, etc.)
│   ├── package.json               # NPM dependencies and scripts
│   ├── server.js                  # Entry point of the backend server (Express)
│   ├── README.md                  # Documentation for backend functionality
└── └── nodemailer.js              # Optional: Nodemailer configuration for email notifications

/frontend/                         # Root folder for the React frontend
│   ├── src/                       # Contains source files for React
│   │   ├── components/            # React components
│   │   │   ├── AdminDashboard.js  # Admin dashboard for managing tasks and users
│   │   │   ├── TaskList.js        # List of tasks for non-admin users
│   │   ├── pages/                 # Pages for different routes in the app
│   │   │   ├── Login.js           # Login page for user authentication
│   │   │   ├── Register.js        # Registration page for user sign-up
│   │   │   ├── TaskDetails.js     # Task details and completion page
│   │   ├── App.js                 # Main entry point of the React app
│   │   ├── index.js               # React DOM rendering
│   ├── public/                    # Public files (index.html, assets)
│   │   ├── index.html             # Entry HTML file for the React app
│   ├── package.json               # NPM dependencies and scripts for frontend
└── └── README.md                  # Documentation for the frontend functionality


</pre>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

