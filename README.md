# Cribbles

<img src="public/cribbles_logo.png" alt="Cribbles Logo" width="150"/>

## 🌈 Overview

Cribbles is an AI-powered wellness platform focused on "zenful joy" that helps users improve their wellbeing and mindset. Unlike productivity tools, Cribbles aims to become a personal AI friend that builds a relationship with users over time through meaningful conversations, asking about their life and thoughts.

The app provides personalized wisdom and beautiful AI-generated imagery to inspire wonder, joy, and philosophical reflection. It emphasizes the whole self - zen, joy, personal growth, philosophy, wonder, and happiness - rather than metrics or tracking.

## ✨ Features

- **AI Chat Companion**: Have meaningful conversations with an AI that remembers your discussions and builds a relationship over time
- **Visual Inspiration**: Generate beautiful AI artwork that inspires wonder and joy
- **Daily Boosts**: Receive personalized motivational content to uplift your day
- **Profile Customization**: Create and customize your personal profile with AI-generated profile pictures

## 🚀 Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **AI Integration**: OpenAI GPT-4o model for conversations and DALL-E 3 for image generation
- **ORM**: Drizzle ORM

## 🏗️ Project Structure

- `/client`: React frontend application
- `/server`: Express backend server
- `/shared`: Shared types and schemas
- `/public`: Static assets

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- OpenAI API key

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgres://username:password@host:port/database
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/amyleesterling/cribbles.git
   cd cribbles
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   ```
   npm run db:push
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The application will be available at http://localhost:5000

## 🎨 Design Philosophy

Cribbles is designed with a "zenful joy" approach, using a calming yet uplifting color palette:

- Primary: #F5B14C (Warm Orange)
- Background: #E8F7FB (Soft Blue)
- Accent: #F593D2 (Gentle Pink)
- Secondary: #7BDFFF (Sky Blue)
- Text: #2F2D30 (Deep Charcoal)

The interface prioritizes spaciousness, ease of use, and delight through subtle animations and thoughtful interactions.

## 📸 Screenshots

(Coming soon)

## 🧠 Vision

Cribbles is designed to be more than an app - it's a companion for your personal growth journey. It focuses on the whole self rather than metrics or tracking, emphasizing zen, joy, personal growth, philosophy, wonder, and happiness.

## 📝 License

This project is licensed under the MIT License.