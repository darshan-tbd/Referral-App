# Project Folder Structure Explanation

## Overview 📂

This document explains the folder structure and architecture of the Referral App project, including why we use a monorepo structure and how dependencies are managed.

## Project Structure

```
Referral App/                    # ROOT (Monorepo)
├── package.json                 # Root package.json (workspace manager)
├── node_modules/                # Shared dependencies
├── mobile/                      # React Native + Expo App
│   ├── package.json            # Mobile-specific dependencies
│   ├── app.json                # Expo configuration
│   ├── babel.config.js         # Babel configuration for React Native
│   ├── src/
│   │   ├── screens/            # App screens (Dashboard, Progress, etc.)
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React Context for state management
│   │   ├── navigation/         # Navigation setup
│   │   └── services/           # API calls and data services
│   └── App.jsx                 # Main app component
├── web/                         # React Web App
│   ├── package.json            # Web-specific dependencies
│   ├── vite.config.js          # Vite bundler configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── src/
│   │   ├── pages/              # Web pages
│   │   ├── components/         # Web-specific components
│   │   ├── contexts/           # Web React Context
│   │   └── services/           # Web API services
│   └── index.html              # Web entry point
├── shared/                      # Shared code between mobile & web
│   ├── services/               # Common API services
│   │   ├── ApiService.js
│   │   ├── MockAuthService.js
│   │   └── MockReferralService.js
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   └── constants/              # App constants and configuration
└── guide/                       # Documentation
    ├── 01_overview.md
    ├── 02_authentication.md
    └── explanation.md          # This file
```

## Why This Architecture? 🤔

### 1. Monorepo Benefits

**What is a Monorepo?**
A monorepo (monolithic repository) is a single repository that contains multiple projects or applications.

**Why we chose this structure:**
- ✅ **Code sharing** between mobile and web applications
- ✅ **Consistent dependencies** across all projects
- ✅ **Single repository** for the entire ecosystem
- ✅ **Easier maintenance** and synchronized updates
- ✅ **Shared tooling** (ESLint, Prettier, TypeScript)
- ✅ **Atomic commits** across multiple projects

### 2. Root node_modules Explanation

**Why root node_modules exists:**

```
Root node_modules/
├── shared dependencies          # Used by multiple projects
├── development tools           # ESLint, Prettier, TypeScript
├── build tools                # Webpack, Babel configurations
└── workspace management       # Yarn/npm workspaces tools
```

**How dependency hoisting works:**
- **Hoisting**: Common dependencies are moved to the root level
- **Deduplication**: Prevents duplicate packages across projects
- **Efficiency**: Saves disk space and reduces install time
- **Version consistency**: Ensures all projects use the same versions

## Individual Project Details

### 📱 Mobile App (React Native + Expo)

**Key files and folders:**

```
mobile/
├── package.json              # Mobile-specific dependencies
├── app.json                  # Expo configuration
├── babel.config.js           # Babel config for React Native
├── src/
│   ├── screens/              # App screens
│   │   ├── DashboardScreen.js    # Main dashboard
│   │   ├── ProgressScreen.js     # Progress tracking
│   │   ├── ReferralsScreen.js    # Referral management
│   │   ├── NotificationsScreen.js # Notifications
│   │   └── ProfileScreen.js      # User profile
│   ├── components/           # Reusable components
│   │   ├── common/          # Common UI components
│   │   └── specific/        # Feature-specific components
│   ├── contexts/            # React Context for state
│   │   └── AuthContext.js   # Authentication state
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js  # Main navigation
│   └── services/            # API calls and data
│       └── mockData.js      # Mock data for development
└── App.jsx                  # Main app component
```

**Mobile-specific dependencies:**
- **Expo**: Development platform for React Native
- **React Native**: Mobile app framework
- **NativeBase**: UI component library
- **React Navigation**: Navigation library

### 🌐 Web App (React + Vite)

**Key files and folders:**

```
web/
├── package.json              # Web-specific dependencies
├── vite.config.js           # Vite bundler configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── src/
│   ├── pages/               # Web pages
│   │   ├── DashboardPage.jsx
│   │   ├── ProgressPage.jsx
│   │   └── ...
│   ├── components/          # Web components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Common components
│   │   └── layout/         # Layout components
│   ├── contexts/           # Web React Context
│   └── services/           # Web API services
└── index.html              # Web entry point
```

**Web-specific dependencies:**
- **React**: Web framework
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Web routing

### 🔗 Shared Code

**Purpose**: Contains code that can be reused across mobile and web apps.

```
shared/
├── services/                # API services
│   ├── ApiService.js       # Main API service
│   ├── MockAuthService.js  # Authentication mock
│   ├── MockReferralService.js # Referral mock
│   └── index.js           # Service exports
├── types/                  # TypeScript types
│   ├── auth.js            # Authentication types
│   ├── referral.js        # Referral types
│   └── api.js             # API types
├── utils/                  # Utility functions
│   └── validation.js      # Form validation
└── constants/              # App constants
    └── config.js          # Configuration constants
```

## Dependency Management 📦

### Root Dependencies (package.json)

```json
{
  "name": "referral-app-monorepo",
  "workspaces": ["mobile", "web", "shared"],
  "scripts": {
    "mobile": "cd mobile && npm start",
    "web": "cd web && npm start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^2.0.0"
  }
}
```

### Mobile Dependencies

```json
{
  "dependencies": {
    "expo": "~49.0.0",
    "react-native": "0.72.0",
    "native-base": "^3.4.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/native-stack": "^6.0.0",
    "@expo/vector-icons": "^13.0.0"
  }
}
```

### Web Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "vite": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "react-router-dom": "^6.0.0"
  }
}
```

## Installation Process 🔧

When you run `npm install` in the root directory:

1. **Reads all package.json files** (root, mobile, web, shared)
2. **Resolves dependencies** and identifies common ones
3. **Hoists shared dependencies** to root node_modules
4. **Creates symlinks** for project-specific dependencies
5. **Installs everything** in an optimal structure

## Available Commands 🚀

### From Root Directory:
```bash
npm run mobile          # Start mobile app (Expo)
npm run web            # Start web app (Vite)
npm run lint           # Lint all projects
npm run format         # Format all code
npm install            # Install all dependencies
```

### From Mobile Directory:
```bash
cd mobile
npm start              # Start Expo development server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npx expo start --clear # Start with cleared cache
```

### From Web Directory:
```bash
cd web
npm run dev            # Start Vite development server
npm run build          # Build for production
npm run preview        # Preview production build
```

## Benefits of This Structure ✨

### 1. Code Reuse
- Share authentication logic between mobile and web
- Reuse API services and data models
- Common utility functions and constants

### 2. Consistency
- Same styling approach across platforms
- Consistent state management patterns
- Shared configuration and constants

### 3. Maintainability
- Update shared code once, affects all apps
- Single source of truth for business logic
- Easier to keep dependencies in sync

### 4. Scalability
- Easy to add new platforms (desktop, etc.)
- Simple to add new shared libraries
- Modular architecture supports growth

### 5. Developer Experience
- Single repository to manage
- Consistent tooling and scripts
- Simplified CI/CD pipeline

## Alternative Structures 🔄

### Simple Structure (Single App)
If you only had a mobile app:

```
my-mobile-app/
├── src/
├── App.jsx
├── package.json
└── node_modules/
```

### Separate Repositories
Each app in its own repository:

```
referral-mobile/     # Separate repo
├── src/
└── package.json

referral-web/        # Separate repo
├── src/
└── package.json
```

### Our Monorepo Structure
Multiple apps sharing common code:

```
referral-system/
├── mobile/          # Native mobile app
├── web/            # Web dashboard
├── shared/         # Common business logic
└── node_modules/   # Shared dependencies
```

## Best Practices 📋

### 1. Dependency Management
- Keep shared dependencies in root package.json
- Use exact versions for critical dependencies
- Regularly update and audit dependencies

### 2. Code Organization
- Keep platform-specific code in respective folders
- Move common logic to shared folder
- Use consistent naming conventions

### 3. Development Workflow
- Always run commands from appropriate directories
- Test changes across all platforms
- Use git hooks for consistent code quality

### 4. Documentation
- Keep this file updated with structural changes
- Document new dependencies and their purposes
- Maintain clear README files for each project

## Troubleshooting 🔧

### Common Issues:

1. **Dependency conflicts**: Clear node_modules and reinstall
2. **Version mismatches**: Check package.json files for consistency
3. **Build failures**: Ensure you're in the correct directory
4. **Import errors**: Check relative paths and shared imports

### Solutions:
```bash
# Clean installation
rm -rf node_modules package-lock.json
rm -rf mobile/node_modules mobile/package-lock.json
rm -rf web/node_modules web/package-lock.json
npm install

# Reset Expo cache
cd mobile
npx expo start --clear
```

## Future Considerations 🚀

### Potential Additions:
- **Desktop app** (Electron)
- **Admin dashboard** (separate web app)
- **API backend** (Node.js/Express)
- **Documentation site** (Docusaurus)
- **Component library** (Storybook)

### Migration Paths:
- Convert to TypeScript for better type safety
- Add automated testing setup
- Implement proper CI/CD pipeline
- Add Docker containers for development

---

This structure provides a solid foundation for building and scaling your referral application across multiple platforms while maintaining code quality and developer productivity. 