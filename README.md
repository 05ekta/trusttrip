# TrustTrip — AI-Powered Travel Companion Platform

TrustTrip is a travel companion platform designed to help travelers connect with compatible travel buddies based on their preferences and interests. It combines user profiles, preference-based matching, communication features, and AI-assisted compatibility scoring to support a more personalized travel experience.

## ✨ Features

- **User Authentication:** Login, registration, and password recovery using Firebase Authentication.
- **User Profiles:** Create, view, and manage user profile information.
- **Travel Preferences:** Set travel styles and interests to personalize buddy recommendations.
- **AI-Assisted Buddy Matching:** Calculate compatibility scores using user preferences and behavioral signals.
- **Real-Time Communication:** Chat interface for connecting with potential travel companions.
- **Face Verification:** Camera-based face verification interface using face detection and recognition models.
- **Image Uploads:** Upload images through Cloudinary integration.
- **Behavior Analytics:** Record user interactions to support engagement analysis and matching.
- **Content Moderation:** Moderation utilities for supporting safer user-generated content.
- **AI Scoring Functions:** Separate Firebase Cloud Functions for behavior and preference scoring.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Cloud Functions | Firebase Cloud Functions |
| Image Storage | Cloudinary |
| Face Verification | face-api.js-compatible models |
| Development Tools | Git, GitHub, npm |

## 🏗️ Project Structure

```text
TrustTrip/
├── backend/
│   ├── models/
│   ├── admin.js
│   ├── cloudinary.js
│   ├── moderation.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── models/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── firebase.js
│   └── package.json
├── functions/
│   ├── ai/
│   ├── index.js
│   └── package.json
├── firebase.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- A Firebase project with the required services configured
- A Cloudinary account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/05ekta/trusttrip.git
cd trusttrip
```

### 2. Configure the frontend

Install the frontend dependencies:

```bash
cd frontend
npm install
```

Configure the Firebase settings required by `frontend/src/firebase.js` using your own Firebase project credentials. Keep private credentials out of the repository.

Start the development server:

```bash
npm run dev
```

### 3. Configure the backend

Open a separate terminal:

```bash
cd backend
npm install
```

Create a local `.env` file with the required Cloudinary configuration:

```env
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Configure Firebase Admin credentials locally using a service-account JSON file at the path expected by `backend/admin.js`. Never commit this file or share its private key.

Start the backend:

```bash
node server.js
```

The backend runs on port `5000` by default.

### 4. Configure Firebase Cloud Functions

Install the dependencies:

```bash
cd functions
npm install
```

Configure the Firebase project and deploy functions only after reviewing the Firebase configuration and deployment requirements.

## 🧠 AI-Assisted Matching

TrustTrip includes an AI-assisted scoring approach that considers factors such as:

- Shared travel preferences and interests
- User engagement signals
- Activity recency
- Reliability-related behavioral signals

The scoring logic is designed to help rank potential travel companions based on compatibility-related signals.

## 🔐 Security Notes

- Never commit `.env` files or Firebase service-account credentials.
- Configure Firestore security rules to restrict access to authorized users.
- Store API secrets in environment variables.
- Review authentication, authorization, and input validation before production deployment.

## 🚀 Future Improvements

- Improve compatibility scoring and recommendation quality.
- Optimize frontend performance and code splitting.
- Strengthen security and production deployment workflows.
- Expand automated testing and error handling.

## 👩‍💻 Author

**Ekta Chauhan**

MCA Graduate | Aspiring Software Developer

[GitHub](https://github.com/05ekta)

---

*TrustTrip is a full-stack project focused on personalized travel companion discovery, preference-based matching, and AI-assisted compatibility scoring.*
