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


### **Explanation of Key Directories and Files**:

#### **Backend (`/backend`)**:
1. **`controllers/`**:
   - **`authController.js`**: Handles user registration, login, and JWT token generation.
   - **`taskController.js`**: Handles CRUD operations for tasks, task assignment, completion, and verification by admins.
  
2. **`middleware/`**:
   - **`authMiddleware.js`**: Middleware for JWT verification to protect routes, and checking admin permissions.

3. **`models/`**:
   - **`User.js`**: Mongoose schema for users, including name, email, password, phone (SMS), account balance (points), and admin role.
   - **`Task.js`**: Mongoose schema for tasks, including task details, point value, assignment, and completion/verification status.

4. **`routes/`**:
   - **`authRoutes.js`**: Routes for user registration and login.
   - **`taskRoutes.js`**: Routes for CRUD operations (admin) and task completion (non-admin).

5. **`nodemailer.js`**: (Optional) Handles sending email notifications when tasks are completed (can be used in `taskController`).

6. **`.env`**: Environment variables (e.g., `JWT_SECRET`, `MONGO_URI`).

7. **`server.js`**:
   - Entry point of the Express server.
   - Sets up routes and middleware.
   - Connects to the MongoDB database.

---

#### **Frontend (`/frontend`)** [If Applicable]:
1. **`components/`**:
   - **`AdminDashboard.js`**: Admin view for managing tasks and users.
   - **`TaskList.js`**: Non-admin view of tasks available to the user for completion.
  
2. **`pages/`**:
   - **`Login.js`**: Page for logging in with email and password.
   - **`Register.js`**: Page for signing up as a new user.
   - **`TaskDetails.js`**: Page where a user can view, check out, and complete tasks.

3. **`App.js`**:
   - Main component that manages routes and renders different components based on user roles (admin vs non-admin).

---

### **Key Features**:
1. **User Authentication**:
   - Users can register and log in, receiving a JWT token for authentication.
   - JWT is used to protect routes and check admin permissions.

2. **Task Management**:
   - **Admins** can create, update, delete, and verify tasks.
   - **Non-admins (residents)** can sign up for tasks, complete them, and receive points once the admin verifies completion.

3. **Notifications**:
   - Email or SMS notifications can be triggered to alert the admin when a task is marked as complete (handled via **Nodemailer** or **Twilio**).

4. **Protected Routes**:
   - Tasks and user management routes are protected using the JWT-based `authenticateToken` middleware and the `authenticateAdmin` middleware for admin-only access.

---

### **Final Notes**:

- The backend is structured with separate concerns for **user management**, **task management**, and **authentication**.
- The frontend structure can be enhanced based on the complexity of the user interface, but this structure provides a good starting point for admin dashboards and resident task management.

Let me know if you need further adjustments or specific code implementations for any part of this project! 💻👾

---

[Try this new GPT!](https://f614.short.gy/Code)