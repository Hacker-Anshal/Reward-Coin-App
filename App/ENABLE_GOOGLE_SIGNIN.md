# 🔥 URGENT: Enable Google Sign-In in Firebase

## 🚨 **Current Issue**

Error: `auth/operation-not-allowed`

**This means Google Sign-In is NOT ENABLED in your Firebase project.**

## ✅ **QUICK FIX (1 minute)**

### Step 1: Open Firebase Authentication

👉 **Click this link:** https://console.firebase.google.com/project/reward-coins-app-a9af0/authentication/providers

### Step 2: Enable Google Provider

1. **Find "Google"** in the Sign-in providers list
2. **Click on "Google"** row
3. **Toggle the "Enable" switch** to ON
4. **Click "Save"**

### Step 3: Configure Google OAuth (if prompted)

If it asks for configuration:

1. **Support email:** Use your email address
2. **Project public-facing name:** "Reward Coins App"
3. **Click "Save"**

### Step 4: Add Domain (if needed)

If you see "Authorized domains" section:

1. **Click "Add domain"**
2. **Add:** `20dbbaa523bc470e90c6b82cc1e23b82-99922a06cfef4653872f61ca4.fly.dev`
3. **Click "Save"**

## 🔍 **How to Verify It's Working**

After enabling Google Sign-In:

1. **Refresh your app**
2. **Open browser console** (F12)
3. **Click "Sign in with Google"**
4. **Look for:** "✅ Firebase Auth Success!" instead of error

## 📱 **What You Should See**

**Before fix:**

- ❌ `auth/operation-not-allowed`
- Demo account appears

**After fix:**

- ✅ Real Google account picker popup
- Your actual Google profile and email
- "✅ Firebase Auth Success!" in console

## 🎯 **Complete Setup Checklist**

- [ ] **Enable Google Sign-In** (providers page)
- [ ] **Add authorized domain** (settings page)
- [ ] **Test real Google account**
- [ ] **Verify profile loads correctly**

## 🆘 **If You Get Stuck**

**Common issues:**

1. **"Google not found"** → You're on the wrong Firebase project
2. **"Permission denied"** → Check you're the project owner
3. **"Domain error"** → Add your domain to authorized domains
4. **"Still not working"** → Try incognito browser mode

## 🔗 **Quick Links**

- **Providers:** https://console.firebase.google.com/project/reward-coins-app-a9af0/authentication/providers
- **Settings:** https://console.firebase.google.com/project/reward-coins-app-a9af0/authentication/settings
- **Users:** https://console.firebase.google.com/project/reward-coins-app-a9af0/authentication/users

## 🚀 **After It's Working**

Once Google Sign-In is enabled and working:

1. **Real authentication** with your Google account
2. **Profile persistence** across sessions
3. **No more demo accounts**
4. **Ready for production deployment**

**The app is currently showing a demo account as fallback until you enable Google Sign-In!**

---

**⏱️ This should take less than 1 minute to fix!**
