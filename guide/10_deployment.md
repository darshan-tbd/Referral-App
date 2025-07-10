# Deployment Guide

## 🚀 Overview

This guide covers the complete deployment strategy for the Referral Client App, including web app deployment on Vercel, mobile app deployment via Expo Application Services (EAS), and Django CRM integration with secure environment management.

## 🏗️ Deployment Architecture

### Production Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                │
├─────────────────────────────────────────────────────────────┤
│     Mobile App        │         Web App                     │
│   (iOS/Android)       │        (Vercel)                     │
├─────────────────────────────────────────────────────────────┤
│                    CDN (Global)                             │
├─────────────────────────────────────────────────────────────┤
│                   Load Balancer                             │
├─────────────────────────────────────────────────────────────┤
│                   API Gateway                               │
├─────────────────────────────────────────────────────────────┤
│                  Django Backend                             │
│                 (AWS/GCP/Azure)                             │
├─────────────────────────────────────────────────────────────┤
│   Database   │  File Storage  │  Message Queue  │  Cache    │
│  (PostgreSQL)│     (S3)       │    (Redis)      │  (Redis)  │
└─────────────────────────────────────────────────────────────┘
```

### Environment Strategy
```
Development → Staging → Production
     ↓           ↓         ↓
  Mock APIs   → Test APIs → Live APIs
  Local DB    → Test DB   → Production DB
  Dev Config  → Test Config → Prod Config
```

## 📱 Mobile App Deployment (Expo EAS)

### EAS Configuration
```json
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@company.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDEF1234"
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/service-account.json",
        "track": "production"
      }
    }
  }
}
```

### App Configuration
```javascript
// app.config.js
export default ({ config }) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    ...config,
    name: isProduction ? 'Referral Client' : 'Referral Client (Dev)',
    slug: 'referral-client-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/your-project-id'
    },
    runtimeVersion: {
      policy: 'sdkVersion'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: isProduction
        ? 'com.company.referralclientapp'
        : 'com.company.referralclientapp.dev',
      buildNumber: '1.0.0',
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: isProduction
        ? 'com.company.referralclientapp'
        : 'com.company.referralclientapp.dev',
      versionCode: 1
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-notifications',
      'expo-secure-store',
      'expo-image-picker',
      'expo-document-picker',
      [
        'expo-build-properties',
        {
          ios: {
            newArchEnabled: true
          },
          android: {
            newArchEnabled: true
          }
        }
      ]
    ],
    extra: {
      eas: {
        projectId: 'your-project-id'
      },
      apiUrl: isProduction
        ? 'https://api.company.com'
        : 'https://staging-api.company.com'
    }
  };
};
```

### Environment Variables
```typescript
// config/env.ts
export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  STAGE: process.env.EXPO_PUBLIC_STAGE || 'development',
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  ANALYTICS_KEY: process.env.EXPO_PUBLIC_ANALYTICS_KEY,
  FIREBASE_CONFIG: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
  }
};
```

### Build and Deploy Scripts
```bash
#!/bin/bash
# scripts/deploy-mobile.sh

set -e

# Function to build and deploy mobile app
deploy_mobile() {
  local environment=$1
  local platform=$2
  
  echo "🚀 Deploying mobile app for $environment on $platform..."
  
  # Install dependencies
  npm ci
  
  # Build the app
  eas build --platform $platform --profile $environment --non-interactive
  
  # Submit to stores (production only)
  if [ "$environment" = "production" ]; then
    eas submit --platform $platform --profile production --non-interactive
  fi
  
  echo "✅ Mobile app deployed successfully!"
}

# Parse arguments
ENVIRONMENT=${1:-development}
PLATFORM=${2:-all}

case $PLATFORM in
  ios)
    deploy_mobile $ENVIRONMENT ios
    ;;
  android)
    deploy_mobile $ENVIRONMENT android
    ;;
  all)
    deploy_mobile $ENVIRONMENT ios
    deploy_mobile $ENVIRONMENT android
    ;;
  *)
    echo "❌ Invalid platform: $PLATFORM"
    echo "Usage: $0 [development|preview|production] [ios|android|all]"
    exit 1
    ;;
esac
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/mobile-deploy.yml
name: Mobile App Deployment

on:
  push:
    branches: [main, develop]
    paths: ['apps/mobile/**']
  pull_request:
    branches: [main]
    paths: ['apps/mobile/**']

jobs:
  build-and-deploy:
    name: Build and Deploy Mobile App
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        platform: [ios, android]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for Preview
        if: github.event_name == 'pull_request'
        run: eas build --platform ${{ matrix.platform }} --profile preview --non-interactive
        
      - name: Build for Production
        if: github.ref == 'refs/heads/main'
        run: eas build --platform ${{ matrix.platform }} --profile production --non-interactive
        
      - name: Submit to Store
        if: github.ref == 'refs/heads/main'
        run: eas submit --platform ${{ matrix.platform }} --profile production --non-interactive
        
      - name: Notify Slack
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🌐 Web App Deployment (Vercel)

### Vercel Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.company.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "apps/web/dist/$1"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@api_url",
    "REACT_APP_STAGE": "@stage",
    "REACT_APP_SENTRY_DSN": "@sentry_dsn"
  },
  "build": {
    "env": {
      "REACT_APP_API_URL": "@api_url",
      "REACT_APP_STAGE": "@stage"
    }
  }
}
```

### Environment Configuration
```typescript
// apps/web/src/config/environment.ts
export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  stage: process.env.REACT_APP_STAGE || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_STAGE || 'development'
  },
  analytics: {
    googleAnalyticsId: process.env.REACT_APP_GA_ID,
    mixpanelToken: process.env.REACT_APP_MIXPANEL_TOKEN
  },
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enablePushNotifications: process.env.REACT_APP_ENABLE_PUSH === 'true'
  }
};
```

### Build Optimization
```typescript
// apps/web/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, '../../packages/shared/src'),
      '@ui': resolve(__dirname, '../../packages/ui/src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          utils: ['date-fns', 'lodash']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
```

### Deployment Scripts
```bash
#!/bin/bash
# scripts/deploy-web.sh

set -e

# Function to deploy web app
deploy_web() {
  local environment=$1
  
  echo "🚀 Deploying web app for $environment..."
  
  # Install dependencies
  npm ci
  
  # Build the app
  npm run build
  
  # Deploy to Vercel
  if [ "$environment" = "production" ]; then
    vercel --prod
  else
    vercel
  fi
  
  echo "✅ Web app deployed successfully!"
}

# Parse arguments
ENVIRONMENT=${1:-development}

deploy_web $ENVIRONMENT
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/web-deploy.yml
name: Web App Deployment

on:
  push:
    branches: [main, develop]
    paths: ['apps/web/**', 'packages/**']
  pull_request:
    branches: [main]
    paths: ['apps/web/**', 'packages/**']

jobs:
  build-and-deploy:
    name: Build and Deploy Web App
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build app
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          
      - name: Run E2E tests
        if: github.ref == 'refs/heads/main'
        run: npm run test:e2e
        
      - name: Notify deployment
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🐳 Django Backend Deployment

### Docker Configuration
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        gcc \
        python3-dev \
        musl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_DB=referral_app
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DEBUG=1
      - DATABASE_URL=postgres://postgres:postgres@db:5432/referral_app
      - REDIS_URL=redis://redis:6379/0

  celery:
    build: .
    command: celery -A config worker -l info
    volumes:
      - .:/app
    depends_on:
      - db
      - redis
    environment:
      - DEBUG=1
      - DATABASE_URL=postgres://postgres:postgres@db:5432/referral_app
      - REDIS_URL=redis://redis:6379/0

volumes:
  postgres_data:
```

### Django Settings
```python
# backend/config/settings/production.py
import os
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['api.company.com', 'staging-api.company.com']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Security
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# CORS
CORS_ALLOWED_ORIGINS = [
    "https://referral-app.vercel.app",
    "https://staging-referral-app.vercel.app",
]

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/app/logs/django.log',
        },
        'console': {
            'level': 'ERROR',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# Sentry
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN'),
    integrations=[DjangoIntegration(), CeleryIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=True
)
```

### Kubernetes Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: referral-app-backend
  labels:
    app: referral-app-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: referral-app-backend
  template:
    metadata:
      labels:
        app: referral-app-backend
    spec:
      containers:
      - name: backend
        image: your-registry/referral-app-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DEBUG
          value: "False"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: secret-key
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /health/
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: referral-app-backend-service
spec:
  selector:
    app: referral-app-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

## 🔒 Security and Environment Management

### Environment Variables Management
```typescript
// scripts/env-manager.ts
import * as fs from 'fs';
import * as path from 'path';

interface EnvironmentConfig {
  development: Record<string, string>;
  staging: Record<string, string>;
  production: Record<string, string>;
}

class EnvironmentManager {
  private config: EnvironmentConfig;
  
  constructor(configPath: string) {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  
  generateEnvFile(environment: keyof EnvironmentConfig): void {
    const envVars = this.config[environment];
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(`.env.${environment}`, envContent);
    console.log(`✅ Generated .env.${environment}`);
  }
  
  validateEnvironment(environment: keyof EnvironmentConfig): boolean {
    const required = ['API_URL', 'DATABASE_URL', 'SECRET_KEY'];
    const envVars = this.config[environment];
    
    for (const key of required) {
      if (!envVars[key]) {
        console.error(`❌ Missing required environment variable: ${key}`);
        return false;
      }
    }
    
    return true;
  }
}

// Usage
const envManager = new EnvironmentManager('./config/environments.json');
envManager.generateEnvFile('production');
```

### Secrets Management
```bash
#!/bin/bash
# scripts/setup-secrets.sh

set -e

# Function to create secrets
create_secrets() {
  local environment=$1
  
  echo "🔐 Setting up secrets for $environment..."
  
  # Create namespace if it doesn't exist
  kubectl create namespace $environment || true
  
  # Create secrets
  kubectl create secret generic app-secrets \
    --from-literal=database-url="$DATABASE_URL" \
    --from-literal=redis-url="$REDIS_URL" \
    --from-literal=secret-key="$SECRET_KEY" \
    --from-literal=sentry-dsn="$SENTRY_DSN" \
    --from-literal=email-password="$EMAIL_PASSWORD" \
    --namespace=$environment \
    --dry-run=client -o yaml | kubectl apply -f -
  
  echo "✅ Secrets created successfully!"
}

# Parse arguments
ENVIRONMENT=${1:-staging}

create_secrets $ENVIRONMENT
```

## 📊 Monitoring and Analytics

### Application Monitoring
```typescript
// apps/web/src/utils/monitoring.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_STAGE,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out certain errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError') {
        return null; // Don't send chunk load errors
      }
    }
    return event;
  }
});

// Custom error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: {
      custom: context
    }
  });
};

// Performance monitoring
export const trackPerformance = (metric: string, value: number) => {
  // Send to analytics service
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metric,
      value: Math.round(value)
    });
  }
};
```

### Health Checks
```python
# backend/apps/health/views.py
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import redis

def health_check(request):
    """Basic health check endpoint"""
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Check Redis connection
        cache.set('health_check', 'ok', 10)
        cache.get('health_check')
        
        return JsonResponse({
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'services': {
                'database': 'ok',
                'cache': 'ok'
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e)
        }, status=500)

def readiness_check(request):
    """Readiness check for Kubernetes"""
    # Add more comprehensive checks here
    return JsonResponse({'status': 'ready'})
```

## 🚀 Deployment Automation

### Complete Deployment Script
```bash
#!/bin/bash
# scripts/deploy-all.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Function to deploy everything
deploy_all() {
  local environment=$1
  
  print_status "Starting deployment for $environment environment..."
  
  # Deploy backend
  print_status "Deploying backend..."
  cd backend
  docker build -t referral-app-backend:$environment .
  docker tag referral-app-backend:$environment your-registry/referral-app-backend:$environment
  docker push your-registry/referral-app-backend:$environment
  kubectl set image deployment/referral-app-backend backend=your-registry/referral-app-backend:$environment
  cd ..
  
  # Deploy web app
  print_status "Deploying web app..."
  cd apps/web
  npm ci
  npm run build
  vercel --prod --token $VERCEL_TOKEN
  cd ../..
  
  # Deploy mobile app (if production)
  if [ "$environment" = "production" ]; then
    print_status "Deploying mobile app..."
    cd apps/mobile
    eas build --platform all --profile production --non-interactive
    eas submit --platform all --profile production --non-interactive
    cd ../..
  fi
  
  print_status "Deployment completed successfully! 🎉"
}

# Parse arguments
ENVIRONMENT=${1:-staging}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
  print_error "Invalid environment: $ENVIRONMENT"
  print_error "Usage: $0 [development|staging|production]"
  exit 1
fi

# Run deployment
deploy_all $ENVIRONMENT
```

### Rollback Strategy
```bash
#!/bin/bash
# scripts/rollback.sh

set -e

rollback_deployment() {
  local environment=$1
  local version=$2
  
  echo "🔄 Rolling back to version $version in $environment..."
  
  # Rollback backend
  kubectl set image deployment/referral-app-backend backend=your-registry/referral-app-backend:$version
  kubectl rollout status deployment/referral-app-backend
  
  # Rollback web app
  vercel --prod --token $VERCEL_TOKEN rollback $version
  
  echo "✅ Rollback completed successfully!"
}

# Parse arguments
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

rollback_deployment $ENVIRONMENT $VERSION
```

## 📈 Post-Deployment

### Testing Pipeline
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  deployment_status:

jobs:
  e2e-tests:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: ${{ github.event.deployment_status.target_url }}
          
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-results
          path: test-results/
```

### Monitoring Setup
```typescript
// monitoring/setup.ts
import { setupAnalytics } from './analytics';
import { setupErrorTracking } from './error-tracking';
import { setupPerformanceMonitoring } from './performance';

export const initializeMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    setupAnalytics();
    setupErrorTracking();
    setupPerformanceMonitoring();
  }
};

// Usage in apps
// apps/web/src/index.tsx
import { initializeMonitoring } from '@referral-app/monitoring';

initializeMonitoring();
```

This comprehensive deployment guide provides everything needed to deploy and maintain the Referral Client App across all platforms with proper security, monitoring, and automation practices. 