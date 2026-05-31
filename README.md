# Synq.ai — Warm Minimalist AI-Native Community Hub

[![Live Site](https://img.shields.io/badge/Production-Live%20Demo-e07a5f?style=for-the-badge&logo=vercel)](https://synq-ai-ten.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-1e1a17?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-123a50?style=for-the-badge&logo=prisma)](https://prisma.io)

**Synq** is a premium, high-fidelity AI-native networking community engineered for builders, creators, developers, and designers. Moving away from cold, dark, cybernetic designs, Synq is crafted around a warm, soft-minimalist editorial bento grid aesthetic that centers human connection, tactile typography, and visual tranquility.

### 🌐 Live Production URL
Explore the full platform live on Vercel: **[https://synq-ai-ten.vercel.app/](https://synq-ai-ten.vercel.app/)**

---

## 🎨 Design Philosophy & Aesthetic Tokens

Synq is built around a bespoke, high-end editorial design system tailored to evoke calmness, texture, and state-of-the-art startup branding:

*   **Warm Minimalism Layout**: A customized Bento UI structure utilizing smooth corners, soft borders, and generous breathing room.
*   **Aesthetic Palette (60-30-10 Rule)**:
    *   **60% (Base)**: Oatmeal Milk (`#FDFBF7`) — provides a tactile, paper-like background experience.
    *   **30% (Secondary)**: Charcoal Slate (`#1E1A17` & `#6B6560`) — expressive, high-contrast dark tones for readability and typography structure.
    *   **10% (Citrus Accent)**: Sunwashed Clay (`#E07A5F`) & Apricot Citrus (`#F4A261`) — energetic, natural warmth highlighting interactive components.
*   **Expressive Serif Typography**: Features **Instrument Serif** for display headings paired with clean, geometric sans-serif typefaces for user controls.

---

## 🚀 Key Features

### 1. 🔍 Advanced User Search & Custom Compatibility
*   **Intuitive Queries**: Instantly search the community database matching name, role, organization, bio details, skills, or interests.
*   **Dynamic Filtering**: Multi-select filtering panels built dynamically from actual active community profile tags.
*   **Compatibility Matrix**: Calculates mutual compatibility using a dynamic overlapping array match algorithm (or falls back to pre-compiled AI recommendations) ensuring users see real compatibility percentages (60% to 95%).
*   **Excluded Incomplete Drafts**: Automatically filters out inactive profiles without `completedAt` timestamps, preventing dead clicks and 404 landing errors.

### 2. 🤖 AI Matchmaking Engine & Conversational Chat
*   **AI Recommendations**: Fully integrated conversational partner recommender compiling overlapping skills, target outcomes, and community profiles.
*   **Community Assistant**: Interactive chatbot interface powered by Mistral AI, ready to answer questions, guide connections, and curate collaborative groups.

### 3. 💬 Secure Direct Messaging (`/dashboard/messages`)
*   **Exclusive Privacy Gating**: Direct communication channels are secure and only available to users with an approved (`ACCEPTED`) connection status.
*   **Bento Chat Console**: Fluid chat panel with live messages, unread message indicators, active conversation tabs, and smooth animations.

### 4. 📊 High-Fidelity Administrator Dashboard (`/admin`)
*   **Strict Security Controls**: Gatekeeper authorization checks that validate platform admins.
*   **QA Sandbox Bypass**: Built-in test sandbox bypass giving reviewer access to preview metrics.
*   **Advanced Analytics KPIs**: Bespoke KPI bars tracking onboarding funnel completion, request approval success, matching coverage, and chat densities.
*   **Live Stream Feed**: Chronological transaction stream tracking new signups, completed profiles, and connection request changes.
*   **🔑 Standard Admin Seed Credentials**:
    *   **Email**: `admin@gmail.com`
    *   **Password**: `Admin@123`
    *   *System Auto-seeding*: Logging in with these credentials automatically registers the account in Supabase Auth, updates Prisma profile records to `"Admin"`, marks onboarding completed, and redirects instantly to `/admin`.

### 5. 🔔 Notification System & Welcome Emails
*   **Transactional Notifications**: Alerts for connection updates, messaging streams, and matches.
*   **Welcome Emails**: Programmatic welcome notifications fired via Resend templates to new onboarded members.
*   **Custom Loading Skeletons**: Tailored, fluid skeleton loader screens (`loading.tsx`) across all core routes.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16.2.6 (App Router with full Turbopack compiler compatibility)
*   **Styling**: Tailwind CSS & Vanilla CSS Transitions
*   **Animations**: Framer Motion (with strict type safety)
*   **Database & ORM**: PostgreSQL database, managed via Prisma Client ORM
*   **Auth Provider**: Supabase Auth (integrated with Next.js Cookie Session handlers)
*   **Transactional Email**: Resend
*   **AI LLM Engine**: Mistral AI Client API

---

## ⚙️ Local Development & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Syedzayed/Synq.ai.git
cd Synq
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory based on the `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
MISTRAL_API_KEY=your_mistral_api_key
NEXTAUTH_SECRET=your_auth_secret
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Generate Database Models & Apply Migrations
```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your local browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🛡️ Security & Optimization Guards

* **Server Actions Validation**: Double-layered authorization checks safeguarding administrative actions and data retrieval server-side.
* **Rate-Limiter Protection**: Strict IP-based request rate limiting protecting register and login forms from brute force attacks.
* **Safe Client Hydration**: Complete decoupling of heavy database imports from Client Components to prevent database bundles from entering browser assets.

---

## 🔑 Authentication Notes & Production Recommendations

### 1. ⚙️ Authentication Notes (Assessment / Demo Settings)
For the purpose of easy and frictionless evaluation during assessment and demo trials:
* **Email Verification Disabled**: Mandatory Supabase sign-up email confirmation has been intentionally deactivated. Registered users are immediately routed to log in and proceed through onboarding without email friction.
* **Welcome Emails**: Programmatic welcome emails are automatically triggered via the Resend API on successful profile creation, processed as a non-blocking background task (failures will never disrupt registration).
* **Password Reset delivery**: The complete recovery flow (`/forgot-password` and `/reset-password`) is fully implemented. Users can submit reset prompts and secure new passwords securely.
* **Resend Sandbox constraints**: Since the demonstration utilizes a Resend sandbox account, password reset emails and welcome notes can only be delivered to verified sandbox recipient addresses (e.g. the account owner's email).
* **Production custom domains**: In standard production environments, a verified custom sending domain is required to send emails freely to unrestricted recipient inboxes.

### 2. 🛡️ Production Recommendations
When migrating the Synq platform from assessment/sandbox trials into a live production environment, we highly recommend applying the following security measures:
* **Enable Email Verification**: Turn the "Confirm Email" toggle back to **ON** inside the Supabase Auth Project Settings panel.
* **Verify Custom Domain**: Fully verify your sending domain (e.g., `synq.ai` or your own domain) by completing the DKIM/SPF setup in your [Resend Domains Dashboard](https://resend.com/domains).
* **Configure Custom SMTP**: Apply the custom Resend SMTP relay settings (port `465` / secure SSL) inside the Supabase Project Dashboard under custom SMTP parameters (see detailed credentials in [docs/supabase-resend-smtp.md](file:///c:/Synq/docs/supabase-resend-smtp.md)).
* **Configure Production Callback URLs**: Ensure the redirect list in Supabase is updated to strictly permit your live production URLs (`https://synq-ai-ten.vercel.app/auth/callback`) to protect credentials transfer.
