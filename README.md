# Ark House Management System

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

<pre>
.
├── /frontend/                 # ReactJS + Material-UI (Frontend)
│   ├── public/                # Public files (HTML, favicon, etc.)
│   │   ├── index.html         # Main HTML file
│   │   └── favicon.ico        # Favicon
│   │
│   ├── src/                   # ReactJS source files
│   │   ├── components/        # Reusable React components (TaskList, Leaderboard, etc.)
│   │   │   ├── TaskList.js    # Component for listing tasks
│   │   │   └── Leaderboard.js # Component for displaying leaderboard
│   │   │
│   │   ├── pages/             # ReactJS pages for routing
│   │   │   ├── Dashboard.js   # Resident's task dashboard
│   │   │   ├── Login.js       # User login page
│   │   │   └── Leaderboard.js # Leaderboard page
│   │   │
│   │   ├── App.js             # Main React app component
│   │   ├── index.js           # Entry point for React app
│   │   ├── theme.js           # Custom Material-UI theme
│   │   └── styles/            # CSS styles (if needed)
│   │
│   ├── package.json           # Project dependencies and scripts
│   └── package-lock.json      # Exact versions of installed dependencies
│
├── /backend/                  # Node.js + Express (Backend API)
│   ├── controllers/           # Logic to handle route logic (tasks, auth, leaderboard)
│   │   ├── authController.js  # Controller for authentication (register, login)
│   │   ├── taskController.js  # Controller for task management
│   │   └── leaderboardController.js # Controller for leaderboard logic
│   │
│   ├── middleware/            # Middleware functions
│   │   └── authMiddleware.js  # JWT authentication middleware
│   │
│   ├── models/                # Mongoose schemas for MongoDB
│   │   ├── User.js            # User schema (admin/resident)
│   │   ├── Task.js            # Task schema
│   │   └── Leaderboard.js     # Leaderboard schema
│   │
│   ├── routes/                # API routes for Express
│   │   ├── auth.js            # Routes for authentication (register, login)
│   │   ├── task.js            # Routes for tasks (create, complete)
│   │   └── leaderboard.js     # Routes for leaderboard (view leaderboard)
│   │
│   ├── services/              # Business logic services (wallet, leaderboard)
│   │   ├── leaderboardService.js # Leaderboard calculation and reset service
│   │   └── walletService.js   # Cryptocurrency-related logic (optional)
│   │
│   ├── .env                   # Environment variables (MongoDB URI, JWT secret)
│   ├── server.js              # Main entry point for the Node.js server
│   ├── package.json           # Project dependencies and scripts
│   └── package-lock.json      # Exact versions of installed dependencies
│
├── .gitignore                 # List of files to ignore in version control
└── README.md                  # Documentation for the project

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

