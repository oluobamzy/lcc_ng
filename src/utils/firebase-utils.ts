import { storage } from '../lib/firebase';
import { ref, listAll } from 'firebase/storage';

/**
 * Utility function to verify Firebase Storage connection
 * @returns A promise that resolves to an object with connection status and error message
 */
export const verifyFirebaseStorage = async () => {
  try {
    console.log('Verifying Firebase Storage connection...');
    
    // Check if the storage bucket is properly configured
    if (!storage || !storage.app) {
      return { 
        success: false, 
        error: 'Firebase Storage is not properly initialized' 
      };
    }
    
    // Get the bucket name from the storage
    const bucketName = storage.app.options.storageBucket;
    if (!bucketName) {
      return { 
        success: false, 
        error: 'Firebase Storage bucket name is missing in configuration. Check your environment variables (VITE_FIREBASE_STORAGE_BUCKET).' 
      };
    }
    
    console.log(`Storage bucket: ${bucketName}`);
    
    // Validate storage bucket format
    if (!bucketName.includes('.appspot.com') && !bucketName.endsWith('.app')) {
      console.warn(`Storage bucket name "${bucketName}" may be invalid. It should typically end with .appspot.com or similar`);
    }
    
    // Try to list files to test the connection
    try {
      // First try to access the root (which requires less permissions)
      const rootRef = ref(storage, '');
      await listAll(rootRef);
      
      console.log('Firebase Storage connection successful');
      
      // Try to access the media folder specifically
      const mediaRef = ref(storage, 'media');
      try {
        await listAll(mediaRef);
        console.log('Media folder access successful');
      } catch (mediaError: any) {
        // If we can access the root but not the media folder, the folder might not exist
        if (mediaError.code === 'storage/object-not-found') {
          console.log('Media folder does not exist yet - this is normal if no files have been uploaded');
          return { 
            success: true, 
            warning: 'The "media" folder does not exist yet in storage. It will be created automatically when uploading files.' 
          };
        } else {
          console.error('Media folder access error:', mediaError);
          return { 
            success: false, 
            error: `Media folder access error: ${mediaError.message}`,
            code: mediaError.code
          };
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Firebase Storage connection error:', error);
      
      // Provide more specific guidance based on error code
      if (error.code === 'storage/unknown') {
        return {
          success: false,
          error: 'Unknown Firebase Storage error. This often indicates a configuration issue with your Firebase Storage bucket or CORS settings.',
          code: error.code,
          details: 'Check that your Firebase project is properly set up, storage bucket exists, and CORS is configured correctly.'
        };
      } else if (error.code === 'storage/unauthorized') {
        return {
          success: false,
          error: 'Unauthorized access to Firebase Storage. Check your storage rules.',
          code: error.code
        };
      } else if (error.code === 'storage/invalid-argument') {
        return {
          success: false,
          error: 'Invalid storage reference. Your storage bucket may not be properly configured.',
          code: error.code,
          details: 'Verify the storage bucket name in your environment variables and Firebase console.'
        };
      }
      
      return { 
        success: false, 
        error: error.message,
        code: error.code 
      };
    }
  } catch (error: any) {
    console.error('Error verifying Firebase Storage:', error);
    return { 
      success: false, 
      error: `Unexpected error: ${error.message}` 
    };
  }
};
