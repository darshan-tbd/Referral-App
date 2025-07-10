# Referral Client App

A comprehensive visa consultancy referral application with both mobile (React Native + Expo) and web (React + Vite) clients.

## 🏗️ Project Structure

```
referral-client-app/
├── mobile/                 # React Native + Expo mobile app
│   ├── components/         # Mobile UI components
│   ├── screens/           # Mobile screens
│   └── ...
├── web/                   # React + Vite web app
│   ├── src/
│   │   ├── components/    # Web UI components
│   │   ├── pages/         # Web pages
│   │   └── ...
│   └── ...
├── shared/                # Shared code between mobile and web
│   ├── types/            # TypeScript type definitions
│   ├── services/         # API services and mock data
│   ├── utils/            # Utility functions
│   └── constants/        # Configuration constants
└── guide/                # Project documentation and guides
```

## 🚀 Features

### Core Features
- **JWT Authentication**: Secure login and registration system
- **Visa Progress Tracking**: 5-stage progress system (Enquiry → Payment)
- **Referral System**: Form-based referral submission with tracking
- **Notification System**: In-app notifications with real-time updates
- **User Dashboard**: Comprehensive dashboard for both platforms
- **Responsive Design**: Mobile-first approach with responsive web design

### Technical Features
- **Mock API Integration**: Development with mock APIs, production-ready for Django integration
- **Shared Services**: Common business logic shared between mobile and web
- **TypeScript**: Full type safety across all platforms
- **Modern UI**: NativeBase for mobile, Tailwind CSS for web
- **State Management**: React Context API (upgradeable to Redux)

## 🛠️ Technology Stack

### Mobile App
- **Framework**: React Native + Expo
- **UI Library**: NativeBase
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Storage**: AsyncStorage + Expo SecureStore

### Web App
- **Framework**: React + Vite
- **UI Framework**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite

### Shared Layer
- **Language**: TypeScript
- **API Client**: Axios with mock services
- **Validation**: Custom validation utilities
- **Types**: Comprehensive type definitions

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd referral-client-app
   ```

2. **Install dependencies for all projects**
   ```bash
   npm run install:all
   ```

   Or install individually:
   ```bash
   # Mobile app
   cd mobile && npm install

   # Web app
   cd ../web && npm install
   ```

## 🚀 Running the Applications

### Mobile App
```bash
# Start the mobile app
npm run dev:mobile

# Or from the mobile directory
cd mobile && npm run start
```

### Web App
```bash
# Start the web app
npm run dev:web

# Or from the web directory
cd web && npm run dev
```

## 📱 Development

### Mobile Development
- The mobile app uses Expo for development and deployment
- Run on iOS Simulator, Android Emulator, or physical device
- Hot reload enabled for faster development

### Web Development
- The web app uses Vite for fast development and building
- Responsive design with Tailwind CSS
- Hot reload enabled for faster development

## 🔧 Available Scripts

### Root Level Scripts
- `npm run dev:mobile` - Start mobile app
- `npm run dev:web` - Start web app
- `npm run build:mobile` - Build mobile app
- `npm run build:web` - Build web app
- `npm run install:all` - Install all dependencies
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean all node_modules
- `npm run reset` - Clean and reinstall all dependencies

## 🎯 Project Status

✅ **Completed:**
- [x] Project structure setup
- [x] Mobile app initialization (React Native + Expo)
- [x] Web app initialization (React + Vite)
- [x] Shared services layer with mock APIs
- [x] TypeScript type definitions
- [x] Basic configuration and constants
- [x] Tailwind CSS setup for web
- [x] Package.json scripts for development

🔄 **In Progress:**
- [ ] Authentication system implementation
- [ ] UI components creation
- [ ] Screen/page development
- [ ] Navigation setup
- [ ] Testing framework setup

📅 **Upcoming:**
- [ ] Dashboard implementation
- [ ] Referral system
- [ ] Notification system
- [ ] User profile management
- [ ] Progress tracking
- [ ] Deployment configuration

## 📚 Documentation

See the `guide/` directory for detailed documentation:
- `01_overview.md` - Project overview and architecture
- `02_authentication.md` - Authentication system details
- `03_api_integration.md` - API integration patterns
- `04_mobile_app.md` - Mobile app development guide
- `05_web_app.md` - Web app development guide
- `06_database_design.md` - Database design and types
- `07_notifications.md` - Notification system
- `08_referral_flow.md` - Referral system workflow
- `09_scalability.md` - Scalability considerations
- `10_deployment.md` - Deployment guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation in the `guide/` directory
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy coding! 🎉** 