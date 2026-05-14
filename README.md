# 🚀 CodeCollab

A real-time collaborative code editor built with **Next.js**, **Socket.io**, **Monaco Editor**, and **Judge0 API**.
CodeCollab allows multiple users to join the same room, write code together in real time, and execute code instantly in multiple programming languages.

---

# ✨ Features

CodeCollab is a full-stack collaborative coding platform that allows developers to write, execute, communicate, and collaborate together in real time.

## 🔥 Real-Time Collaboration

* Multiple users can join the same coding room
* Live code synchronization using Socket.io
* Room-based collaboration system
* Shared code execution output
* Real-time collaborative editing
* Persistent coding sessions

## 💬 Live Chat System

* Built-in real-time chat window
* Instant messaging between collaborators
* Socket.io powered communication

## 📹 Video Calling Feature

* Real-time video calling between users
* Peer-to-peer communication support
* Enables team collaboration and pair programming

## 💻 Multi-Language Support

Supports multiple programming languages including:

* JavaScript
* TypeScript
* Python
* Java
* C++
* C
* C#
* Go
* PHP
* Ruby
* Swift
* Kotlin
* Rust
* R
* Perl
* Bash
* Dart
* SQL
* HTML
* XML
* Markdown
* Scala
* Haskell

## ⚡ Online Code Execution

* Integrated with **Judge0 API**
* Execute code directly from the browser
* Displays compilation errors and runtime output
* Shared output across connected users

## 🔐 Authentication & Database

Implemented using **NextAuth.js** and **MongoDB**

* Google OAuth Login
* GitHub OAuth Login
* Session management
* Persistent login sessions
* Stores user room history
* Stores room IDs and collaboration sessions
* Database-powered user management

## 🎨 Modern UI

* Built with Tailwind CSS
* Monaco Editor integration
* Responsive interface
* Clean developer-focused design

---

# 🛠️ Tech Stack

| Technology    | Purpose                       |
| ------------- | ----------------------------- |
| Next.js       | Frontend Framework            |
| React.js      | UI Development                |
| Socket.io     | Real-time communication       |
| Monaco Editor | Code editor                   |
| Judge0 API    | Code execution                |
| NextAuth.js   | Authentication                |
| Tailwind CSS  | Styling                       |
| Node.js       | Runtime Environment           |
| Express.js    | Backend API & Server          |
| MongoDB       | Database for sessions & rooms |
| Socket.io     | Real-time communication       |

---

# 📂 Folder Structure

```bash
app/
 ├── api/
 │    ├── auth/
 │    └── socket/
 ├── components/
 ├── [language]/
 │     └── [roomId]/
 ├── globals.css
 └── layout.js

server.js
utils/
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/CodeCollab.git
cd CodeCollab
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create Environment Variables

Create a `.env.local` file in the root directory:

```env
# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

---

## 4️⃣ Run the Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# 🔑 Authentication Setup

## GitHub OAuth

1. Open GitHub Developer Settings
2. Create a new OAuth App
3. Add callback URL:

```bash
http://localhost:3000/api/auth/callback/github
```

---

## Google OAuth

1. Open Google Cloud Console
2. Create OAuth Credentials
3. Add Authorized Redirect URI:

```bash
http://localhost:3000/api/auth/callback/google
```

---

# 🧠 How It Works

## Room Creation

* User selects a programming language
* A unique room ID is generated
* Users can share the room link or room code
* Room details are stored in MongoDB
* Previous sessions can be restored

## Real-Time Sync

* Socket.io broadcasts code changes instantly
* Every connected user sees updates live

## Code Execution

* Code is sent to Judge0 API
* Output is displayed in real time
* Errors and compile messages are supported

---

# 📸 Future Improvements

* 👥 Live cursors
* 💬 Real-time chat
* 📹 Video calling
* 🧾 File explorer
* ☁️ Save code sessions to database
* 🧠 AI code suggestions
* 🌙 Dark/Light theme toggle

---

# 🧪 Challenges Faced

* Handling real-time synchronization
* Managing Socket.io room connections
* Integrating Monaco Editor with Next.js App Router
* Tailwind CSS v4 configuration issues
* Implementing OAuth authentication using NextAuth.js

---

# 🌟 Learning Outcomes

Through this project, I learned:

* Real-time web communication using WebSockets
* Authentication flow using OAuth providers
* Dynamic routing in Next.js
* State synchronization between multiple clients
* API integration and async handling
* Building scalable collaborative applications

---

# 🤝 Contributing

Contributions are welcome.

```bash
Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Open a Pull Request
```

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Aryan Rane**

* GitHub: [https://github.com/your-github-username](https://github.com/your-github-username)
* LinkedIn: [https://linkedin.com/in/your-linkedin](https://linkedin.com/in/your-linkedin)

---

# ⭐ If you like this project

Give this repository a star ⭐ and share it with others.
