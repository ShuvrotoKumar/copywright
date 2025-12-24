# Copywright Web Dashboard

A modern React (Vite) dashboard for Copywright service providers to manage users, admins, payments, notifications, settings, and reports. Built with React 18, React Router, Tailwind CSS v4, and Ant Design v5.

## Tech Stack

- **Build Tool**: Vite 6
- **UI Library**: React 18, React Router 7
- **Styling**: Tailwind CSS 4 (with `@tailwindcss/vite`)
- **Components**: Ant Design 5
- **Icons**: react-icons

## Project Structure (high level)

```
copywright-web-dashboard/
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ layout/
│  │  └─ MainLayout.jsx
│  ├─ pages/
│  │  ├─ Add Admin/
│  │  │  └─ AddAdmin.jsx
│  │  ├─ Create Admin/
│  │  │  └─ CreateAdmin.jsx
│  │  ├─ Notifications/
│  │  │  └─ Notifications.jsx
│  │  ├─ Privacy Policy/
│  │  │  └─ PrivacyPolicy.jsx
│  │  ├─ Reports/
│  │  │  └─ Reports.jsx
│  │  ├─ Settings/
│  │  │  └─ Settings.jsx
│  │  ├─ Terms Condition/
│  │  │  └─ TermsCondition.jsx
│  │  ├─ dashboard/
│  │  │  └─ DashboardPage.jsx
│  │  ├─ paymentManagement/
│  │  │  └─ PaymentManagement.jsx
│  │  ├─ profile/
│  │  │  ├─ ProfilePage.jsx
│  │  │  ├─ ChangePass.jsx
│  │  │  └─ EditProfile.jsx
│  │  ├─ userDetails/
│  │  │  ├─ UserDetails.jsx
│  │  │  └─ CreateUser.jsx
│  │  ├─ optional/
│  │  │  └─ AboutUs.jsx
│  │  └─ auth/
│  │     ├─ SignInPage.jsx
│  │     ├─ ForgetPassword.jsx
│  │     ├─ VerificationCode.jsx
│  │     └─ ResetPassword.jsx
│  ├─ routes/Routes.jsx
│  ├─ index.css
│  └─ main.jsx
├─ package.json
├─ vite.config.js
├─ vercel.json
└─ README.md
```

## Features

- **Authentication**: Sign in, password reset and verification flows (`src/pages/auth`).
- **Dashboard**: Overview metrics and widgets (`src/pages/dashboard/DashboardPage.jsx`).
- **User Management**: Create and manage users (`src/pages/userDetails`).
- **Admin Management**: Create and add admins (`src/pages/Create Admin`, `src/pages/Add Admin`).
- **Payments**: Manage payments and billing (`src/pages/paymentManagement/PaymentManagement.jsx`).
- **Notifications**: View and manage notifications (`src/pages/Notifications/Notifications.jsx`).
- **Profile**: View and edit profile, change password (`src/pages/profile`).
- **Settings**: Application-level settings (`src/pages/Settings/Settings.jsx`).
- **Legal**: Privacy Policy and Terms & Conditions pages.

## Theming

- Tailwind CSS v4 imported via `@import "tailwindcss";` in `src/index.css`.
- You can use arbitrary color utilities (e.g., `bg-[#111827]`).
- Ant Design theming can be applied via `ConfigProvider` where needed.

## Routing

- Routes are defined in `src/routes/Routes.jsx` using React Router 7.
- Current routes include: `/` (Dashboard), `/sign-in`, `/user-details`, `/create-user`, `/payment-management`, `/notifications`, `/reports`, `/settings`, `/profile`, `/edit-profile`, `/change-password`, `/privacy-policy`, `/terms-and-condition`, `/about-us`, `/create-admin`, `/add-admin`.

## Development Guidelines

- **Components**: Keep components page-scoped under `src/pages/...` and shared UI under `src/shared/...`.
- **Styling**: Prefer Tailwind utility classes. Use arbitrary values for brand color: `[#111827]`.
- **State**: Use React hooks; no global store at present.
- **Linting**: Keep code lint-clean via `npm run lint`.
- **Commits**: Use clear, descriptive messages (e.g., `feat:`, `fix:`, `chore:`).

## Environment Variables

- None required for local development.
- If you add APIs, avoid hardcoding secrets. Use `.env` files and access via Vite’s `import.meta.env`.

## Build & Deploy

- Build with `npm run build`.
- Serve `dist/` with any static hosting (Netlify, Vercel, Nginx).
- SPA routing: `vercel.json` includes a rewrite to `/` for client-side routing.

## Troubleshooting

- **Windows line endings**: Git may warn about LF/CRLF conversions. Configure Git as needed:
  ```bash
  git config core.autocrlf true   # checkout CRLF on Windows, commit LF
  ```
- **Tailwind styles**: Restart dev server after config changes; ensure classes like `bg-[#111827]` appear in built CSS when used.
- **AntD styles**: Ensure `ConfigProvider` wraps components that need theming.

## License

MIT

## Acknowledgements

- React, Vite, Tailwind CSS, Ant Design, Recharts, React Router, React Icons, React Quill.
