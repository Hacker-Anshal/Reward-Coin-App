# 🔥 Firebase Setup Guide

Your Reward Coins App is configured with Firebase, but you need to authorize your domain for Google Sign-In to work properly.

## 🚨 **Current Issue**

The error `auth/network-request-failed` occurs because your current domain is not authorized in Firebase console.

**Current domain:** `https://20dbbaa523bc470e90c6b82cc1e23b82-99922a06cfef4653872f61ca4.fly.dev`

## ✅ **Quick Fix Steps**

### 1. **Open Firebase Console**

Go to: https://console.firebase.google.com/

### 2. **Select Your Project**

- Click on "reward-coins-app-a9af0" project

### 3. **Navigate to Authentication**

- In the left sidebar, click "Authentication"
- Click on the "Settings" tab

### 4. **Add Authorized Domain**

- Scroll down to "Authorized domains"
- Click "Add domain"
- Add: `20dbbaa523bc470e90c6b82cc1e23b82-99922a06cfef4653872f61ca4.fly.dev`
- Click "Add"

### 5. **Test the App**

- Refresh your app and try signing in again
- It should now work with real Google authentication!

## 🔄 **Fallback Mode**

Your app currently includes a fallback authentication that creates a "Demo User" when Firebase fails. This allows development to continue while you fix the domain authorization.

**Demo User Details:**

- Name: Demo User
- Email: demo@rewardcoins.app
- Profile: Default placeholder

## 🛠️ **For Production Deployment**

When you deploy to a custom domain, remember to:

1. **Add production domain** to Firebase authorized domains
2. **Update Firebase config** if needed
3. **Test authentication** on the new domain
4. **Remove fallback** authentication for production

### Common Production Domains to Add:

- `your-domain.com`
- `www.your-domain.com`
- `app.your-domain.com`

## 🎯 **Firebase Project Configuration**

Your current Firebase setup:

- **Project ID:** reward-coins-app-a9af0
- **Auth Domain:** reward-coins-app-a9af0.firebaseapp.com
- **Region:** Default (us-central1)

## 🔐 **Security Notes**

- **API Keys:** Your Firebase API key is public (normal for client-side apps)
- **Security Rules:** Configure Firestore rules for production
- **Domain Restrictions:** Keep authorized domains list minimal
- **Rate Limiting:** Firebase handles this automatically

## 📱 **For Mobile App (APK)**

When converting to APK, you'll also need to:

1. **Add SHA-1 fingerprint** to Firebase (for Android)
2. **Configure app package name** in Firebase
3. **Download google-services.json** (for native Android builds)

## 🚀 **Next Steps**

1. ✅ **Add current domain** to Firebase console (immediate fix)
2. 🔄 **Test real Google Sign-In**
3. 🗑️ **Remove fallback auth** once working
4. 🛡️ **Configure security rules** for Firestore
5. 📊 **Set up Analytics** (optional)

Your app is ready for production-level authentication once the domain is authorized! 🎉
