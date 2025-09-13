# Help Halo 📂

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🎯 Overview

Help Halo is a full-stack application for building, managing, and deploying custom AI support chatbots. It provides a no-code interface for chatbot creation and a secure dashboard for monitoring conversations.

## 🎥 Live Demo & Showcase

A live version of the application is deployed and can be accessed here:

**[Link to Live Demo]()**

### Application Showcase

To give you a better feel for the application, here is a short video demonstrating the core features.

<div align="center">

![Demo]()

</div>

## ✨ Features

- **Secure User Authentication:** Powered by Clerk for robust and easy-to-use user management.
- **No-Code Customization:** Easily tailor your chatbot's personality, icon, and knowledge base without writing code.
- **Secure Admin Dashboard:** Manage your chatbots, view session history, and analyze conversations in a secure, authenticated environment.
- **AI-Powered Conversations:** Leverages OpenAI to provide intelligent and contextual responses to user queries.
- **Session History:** Review and analyze all user conversations for quality assurance and insights.
- **Public Chat Interface:** Deploy a clean and user-friendly chat interface for your customers to interact with.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (v15 with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **GraphQL Client:** [Apollo Client](https://www.apollographql.com/docs/react/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### Backend & Database

- **Runtime:** [Next.js](https://nextjs.org/) (API Routes & Server Actions)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **API:** [GraphQL](https://graphql.org/) with [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- **AI:** [OpenAI API](https://openai.com/docs)

### Authentication

- **Provider:** [Clerk](https://clerk.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js** and **npm** (or yarn/pnpm) installed on your machine.
- A **PostgreSQL** database. For example [Neon](https://neon.com/) as a hosted solution.
- A **Clerk Application**. If you don't have one, follow the [official setup guide](https://clerk.com/docs/quickstarts/setup-clerk).
- An [**OpenAI**](https://platform.openai.com/docs/overview) **API Key**.

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/T-S-dev/HelpHalo.git

    cd HelpHalo
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of the project and add the following, replacing the values with your own keys from your Clerk dashboard.

    ```env
    # PostgreSQL Database
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    # OpenAI API
    OPENAI_API_KEY=
    ```

4.  **Push the database schema:**

    Run the following command to sync your Prisma schema with your PostgreSQL database.

    ```sh
    npm run prisma:push
    ```

5.  **Run the development server:**

    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.