# TalentFlow - AI-Powered HR Management Platform

TalentFlow is a modern, comprehensive HR management application built with a cutting-edge technology stack. It provides a suite of tools for both employees and HR personnel to streamline common HR tasks, from absence management to recruitment, all enhanced with the power of generative AI.

## Features

We have built a rich set of features to cover the core needs of an HR department and provide a seamless experience for employees.

### For All Users (Employees & HR)
- **Dashboard**: A personalized overview of key information. Employees see their own status, while HR gets a team-wide summary.
- **Employee Directory**: Browse and search for all employees in the organization.
- **Absence Management**: Request time off and view the status of past requests.
- **Messaging**: A real-time internal chat system to communicate with colleagues one-on-one.
- **Authentication**: A complete login/logout system with role-based access control.

### For HR Managers
- **Advanced Dashboard**: Includes key metrics like total employees, staff currently on leave, and pending absence requests.
- **Employee Management**: Ability to add new employees to the directory and remove existing ones.
- **Team Absence Management**: View and approve or reject time-off requests from team members.
- **Recruitment Hub**:
    - Create and manage job postings.
    - Open or close job postings to control the application period.
    - View and track incoming candidate applications.
- **Reporting**: View a comprehensive report of all absence records and export it to CSV.
- **AI-Powered Insights**:
    - Automatically generate summaries of team-wide absence data to identify trends.
    - Receive AI-driven suggestions for managerial actions to support employees based on provided context.
- **Face Recognition (Placeholder)**: A placeholder flow for a future face recognition login feature.

## Technology Stack

This project is built on a modern, robust, and scalable technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router) for a full-stack application with both server-side and client-side rendering.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and improved developer experience.
- **UI Framework**: [React](https://react.dev/) for building the user interface.
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) for a beautiful, accessible, and customizable component library.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first CSS framework.
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (Google's GenAI toolkit) to integrate powerful AI features using Google's Gemini family of models.
- **Data Layer**: Mock data services are used as a placeholder for a real database, demonstrating a clean separation of concerns and readiness for a database integration.

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) (version 18 or later) and npm installed on your machine.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies**:
    Run the following command to install all the necessary packages.
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a file named `.env` in the root of the project and add your Google AI API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

The application requires two separate development servers to run concurrently: one for the Next.js frontend and backend, and one for the Genkit AI flows.

1.  **Start the Next.js server**:
    Open a terminal and run the following command:
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:9002`.

2.  **Start the Genkit server**:
    Open a *second* terminal and run the following command:
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development server, which allows your Next.js application to communicate with the AI models.

Now you can open your browser to `http://localhost:9002` to see the application in action!

## Roadmap: Future Features

Here are some of the extra smart features planned for the future development of TalentFlow:

### 🔹 AI-Powered Performance & Engagement
- **Performance Reviews Automation**: AI analyzes employee KPIs, attendance, and peer feedback to suggest draft performance evaluations.
- **Sentiment Analysis**: AI reads employee messages/chats (with consent) to detect stress, dissatisfaction, or burnout, providing alerts to HR.

### 🔹 Smart Attendance & Presence
- **Face Recognition + QR Check-in**: Real-time check-in using webcams or phones, with automatic updates to the HR dashboard.
- **Geo-Fencing for Remote Work**: Detects whether an employee's check-in is from the office or a remote location.

### 🔹 Notifications & Alerts
- **Instant Alerts**: Push/email/Slack-like notifications for HR and employees regarding absent employees without requests, late arrivals, pending leave approvals, and performance warnings.

### 🔹 Collaboration & Messaging
- **Anonymous Feedback**: Allows employees to send anonymous messages or complaints directly to HR.
- **AI HR Assistant (Chatbot)**: An AI-powered chatbot to instantly answer HR-related questions from employees (e.g., “How many vacation days do I have left?”).

### 🔹 Smart Reports & Forecasting
- **Predictive Absence Analytics**: AI forecasts absence trends based on historical data.
- **AI-Powered Recruitment Matching**: Automated resume/CV parsing and matching of candidates with job postings.
- **Excel/PDF Exports with AI Commentary**: Reports that include not just raw data but also an AI-generated “insights summary”.
