# Firebase Storage Troubleshooting Guide

You're experiencing Firebase Storage errors with code 400 (Bad Request). Here are steps to resolve these issues:

## 1. Check Environment Variables

Ensure these environment variables are correctly set in your `.env` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 2. Verify Firebase Project Setup

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Storage" in the sidebar menu
4. Make sure Storage is enabled
5. Check if you have the "media" folder created (it's okay if it doesn't exist yet)

## 3. Check Firebase Storage Rules

We've created a `storage.rules` file with these permissions:
- Read access is allowed to everyone
- Write access is allowed for authenticated users only

Make sure these rules are deployed to Firebase:

```bash
firebase deploy --only storage
```

## 4. CORS Configuration

We've updated your firebase.json to include proper CORS settings. Deploy these settings:

```bash
firebase deploy --only storage
```

## 5. Authentication State

The Storage error can happen if you're trying to upload files when not properly authenticated. Make sure:
- The user is logged in before attempting uploads
- The auth state is properly initialized before accessing the Media Library

## 6. Bucket Name Verification

Verify that your storage bucket name is correct:

```javascript
console.log(storage.app.options.storageBucket);
```

## 7. Testing the Connection

We've added a utility to test your Firebase Storage connection. Check your browser console for detailed error messages.

If issues persist, please check the Firebase Storage documentation: https://firebase.google.com/docs/storage/web/start
