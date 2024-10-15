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

👾 **Application Overview and Features** 🛠️

This **application** is designed to manage a **sober living home** with two distinct user roles: **administrators** and **residents** (non-administrators). The core functionality revolves around **task management**, where residents can sign up for tasks, complete them, and earn **points** that accumulate in their account. Administrators are responsible for creating and assigning tasks, verifying task completion, and awarding points. Additionally, the app uses **JWT-based authentication** to manage user sessions and permissions, and **email/SMS notifications** ensure timely communication between administrators and residents.

---

### **Core Functionality**:

1. **User Authentication and Role-Based Access Control (RBAC)**:
   - Users can **register** for an account, specifying whether they are **administrators** or **residents**.
   - The system uses **JWT tokens** to authenticate users, ensuring that only logged-in users can access certain features.
   - **Role-based access control** ensures that administrative tasks are only available to **administrators**, while **residents** can interact with tasks in a limited way.

2. **Task Management**:
   - Administrators can **create, assign, update, and delete tasks**.
   - Tasks include details like a **name**, **description**, **due date**, **point value**, and a **completion status**.
   - Residents can **sign up for tasks** (reserving them so no other resident can take the same task) and **mark them as completed**.
   - Once a task is marked as complete, administrators must **verify task completion** before awarding points to the resident.

3. **Point System**:
   - Tasks are assigned **point values** that are awarded to residents upon successful completion and verification of the task by an administrator.
   - Residents accumulate **points in their account balance**, which is updated whenever a task is verified by an admin.

4. **Notifications**:
   - Administrators receive **email or SMS notifications** when a resident marks a task as complete.
   - This notification ensures that the administrator is aware of the pending task and can review it for verification.

---

### **Detailed Feature Breakdown**:

#### **1. User Authentication and Permissions**:

**Key Roles**:
- **Administrator**: Has full control over the system, including user management, task creation, and verification.
- **Resident (Non-Administrator)**: Can only view available tasks, reserve them, mark them as complete, and view their accumulated points.

**How It Works**:
- When a user logs in, they receive a **JWT token** that is included in all API requests. This token is used to identify the user and determine their role (admin or non-admin).
- **Admin-only routes** are protected with the `authenticateAdmin` middleware, ensuring that only admins can create, update, or delete tasks.
- **Residents** cannot modify tasks, but they can interact with them by signing up for tasks and marking them as complete.

#### **2. Task Management**:

**Task Features**:
- Tasks include fields like:
  - **Name**: The name of the task (e.g., "Clean kitchen").
  - **Description**: A short description of the task (up to 240 characters).
  - **Due Date**: The deadline for completing the task.
  - **Points**: The points that a resident can earn upon completing the task.
  - **Completion Status**: Tracks whether the task is completed and whether it has been verified by an admin.
  - **Assigned To**: The resident who has reserved or signed up for the task.

**How It Works**:
- **Administrators** create tasks and assign point values to them. Tasks have a due date, and residents can **check out a task** so others cannot take it.
- Residents **reserve tasks** and work on them, marking them as **complete** when finished. Once a task is marked as complete, it goes into a **pending state** for admin verification.
- **Administrators verify tasks** by confirming that the task has been successfully completed. Upon verification, the resident receives the assigned **points**, which are added to their **account balance**.

#### **3. Point System and Account Balance**:

**How It Works**:
- Each task has an associated **point value**, which is set by the administrator at the time of task creation.
- Residents **accumulate points** in their account by completing tasks. Once an admin verifies the task, points are awarded to the resident’s account.
- The **account balance** is updated every time a task is verified, and residents can view their total accumulated points through the system.

#### **4. Notifications**:

**How It Works**:
- **Administrators are notified** via **email or SMS** when a resident marks a task as completed. This notification includes the task details and the resident who completed it.
- Notifications are handled via **Nodemailer** (for emails) and **Twilio** (for SMS).
- The notification system ensures timely updates so that admins can quickly review and verify tasks.

---

### **Feature Interrelationships**:

1. **User Authentication → Task Management**:
   - Only **authenticated users** can interact with the system. **JWT tokens** are used to protect task routes, ensuring that only **residents** can sign up for tasks and only **administrators** can create, update, or delete tasks.

2. **Task Management → Point System**:
   - Task creation includes the assignment of **point values**. When a resident completes a task, the **points** are only awarded after an administrator verifies the completion.
   - The **account balance** of a resident is updated based on the points from the verified tasks.

3. **Task Management → Notifications**:
   - When a task is completed, **notifications** (via email/SMS) are triggered to alert the administrator.
   - The administrator can then log in, review the task, and verify its completion.

4. **Permissions → Task Management**:
   - **Administrators** have full control over tasks. They can **add, modify, delete**, and **verify** tasks.
   - **Residents** are restricted from modifying tasks but can **sign up for** and **complete** them. They also cannot re-assign or delete tasks, ensuring task integrity.

---

### **User Journey**:

1. **Registration**: 
   - A new user registers and logs into the system, receiving a **JWT token** for session management.
   
2. **Resident Signs Up for a Task**:
   - A resident browses available tasks, selects one to work on, and **reserves** it.
   - They **complete the task** and mark it as finished, notifying the admin.

3. **Administrator Verifies Task**:
   - The administrator receives an **email/SMS notification** about the completed task.
   - They log in, review the task, and **verify** it.
   - Once verified, the resident receives the **points**, which are added to their **account balance**.

4. **Point Tracking**:
   - The resident can view their updated **account balance** based on the tasks they’ve completed and the points awarded.

---

### **Conclusion**:

This application streamlines the management of tasks in a **sober living home**, ensuring that tasks are completed efficiently while providing a **gamified reward system** through points. **Administrators** can effectively manage tasks and monitor progress, while **residents** have a clear, structured system to follow. The combination of **user authentication**, **task management**, and **notifications** ensures accountability and communication between residents and administrators, making the system robust and easy to manage.

Let me know if you need further clarifications or adjustments to any features! 💻👾

---


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
