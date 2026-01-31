# Telehealth AI Platform

A modern telehealth application designed to provide instant, AI-powered medical assessments and reports. This platform leverages advanced AI models to analyze user symptoms, ask relevant follow-up questions, and generate comprehensive medical reports in PDF format.

## Features

- **AI-Powered Assessment**: Uses Liquid LFM (via OpenRouter) to intelligently analyze symptoms and generate follow-up questions.
- **Instant Medical Reports**: Generates professional PDF reports summarizing the consultation, potential conditions, and recommendations.
- **Dynamic User Interface**: Built with user experience in mind, utilizing Framer Motion for smooth transitions and animations.
- **Real-time Interaction**: Simulates a conversation with a medical assistant to gather precise clinical context.

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: Redux Toolkit
- **AI Integration**: [OpenRouter](https://openrouter.ai/) (Model: `liquid/lfm-2.5-1.2b-thinking:free`)
- **PDF Generation**: jsPDF & jsPDF-AutoTable
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd telehealth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your OpenRouter API key:
   ```env
   OPEN_ROUTER=your_openrouter_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenRouter API](https://openrouter.ai/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
