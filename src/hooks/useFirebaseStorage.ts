import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, StorageError, updateMetadata } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface UploadProgress {
  progress: number;
  url: string | null;
  error: Error | null;
}

// Define specific error types for better handling
export enum StorageErrorType {
  UNAUTHORIZED = 'unauthorized',
  FILE_TOO_LARGE = 'file_too_large',
  INVALID_FILE_TYPE = 'invalid_file_type',
  GENERAL_ERROR = 'general_error',
}

interface StorageErrorInfo {
  type: StorageErrorType;
  message: string;
  originalError?: Error;
}

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  metadata: {
    contentType: string;
    size: number;
    name: string;
    fullPath: string;
    timeCreated: string;
    type: 'image' | 'video' | 'other';
    [key: string]: any;
  };
}

export const useFirebaseStorage = (path: string) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    url: null,
    error: null,
  });
  
  // Function to handle and classify storage errors
  const handleStorageError = (error: Error | StorageError): StorageErrorInfo => {
    const storageError = error as StorageError;
    
    // Check if it's a Firebase storage error
    if (storageError.code) {
      switch(storageError.code) {
        case 'storage/unauthorized':
          return {
            type: StorageErrorType.UNAUTHORIZED,
            message: 'You do not have permission to upload files.',
            originalError: error,
          };
        case 'storage/canceled':
          return {
            type: StorageErrorType.GENERAL_ERROR,
            message: 'Upload was cancelled.',
            originalError: error,
          };
        case 'storage/quota-exceeded':
          return {
            type: StorageErrorType.FILE_TOO_LARGE,
            message: 'Storage quota exceeded. Please contact the administrator.',
            originalError: error,
          };
        default:
          return {
            type: StorageErrorType.GENERAL_ERROR,
            message: `An error occurred: ${storageError.message}`,
            originalError: error,
          };
      }
    }
    
    // Generic error
    return {
      type: StorageErrorType.GENERAL_ERROR,
      message: error.message || 'An unknown error occurred',
      originalError: error,
    };
  };

  // Validate file before upload
  const validateFile = (file: File): StorageErrorInfo | null => {
    // Check file size (10MB limit)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      return {
        type: StorageErrorType.FILE_TOO_LARGE,
        message: `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return {
        type: StorageErrorType.INVALID_FILE_TYPE,
        message: `File type not supported. Allowed types: JPEG, PNG, GIF, WebP, MP4, QuickTime`,
      };
    }
    
    return null;
  };

  // Generate a video thumbnail
  const generateVideoThumbnail = async (videoFile: File): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.playsInline = true;
        video.muted = true;
        
        // Create a URL for the video file
        const videoUrl = URL.createObjectURL(videoFile);
        video.src = videoUrl;
        
        // Generate thumbnail when metadata is loaded
        video.onloadedmetadata = () => {
          // Seek to a frame at 25% of the video
          video.currentTime = Math.min(1, video.duration * 0.25);
          
          video.oncanplay = () => {
            try {
              // Create a canvas and draw the video frame
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                URL.revokeObjectURL(videoUrl);
                resolve(null);
                return;
              }
              
              // Draw the current frame to the canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Convert canvas to a data URL
              const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
              
              // Clean up
              URL.revokeObjectURL(videoUrl);
              resolve(thumbnailUrl);
            } catch (err) {
              console.error('Error generating thumbnail:', err);
              URL.revokeObjectURL(videoUrl);
              resolve(null);
            }
          };
          
          // Handle errors
          video.onerror = () => {
            console.error('Error loading video for thumbnail generation');
            URL.revokeObjectURL(videoUrl);
            resolve(null);
          };
          
          // Force video to load frame
          video.play().catch(() => {
            // Ignore play() errors - we just need the frame
          });
        };
        
        // Handle errors
        video.onerror = () => {
          console.error('Error loading video for thumbnail generation');
          URL.revokeObjectURL(videoUrl);
          resolve(null);
        };
      } catch (err) {
        console.error('Error in thumbnail generation:', err);
        resolve(null);
      }
    });
  };

  // Upload a data URL as a file
  const uploadDataUrl = async (dataUrl: string, fileName: string): Promise<string | null> => {
    try {
      // Convert data URL to a blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Upload the file
      const thumbnailRef = ref(storage, `${path}/thumbnails/${Date.now()}-${fileName}`);
      const uploadTask = uploadBytesResumable(thumbnailRef, file);
      
      return new Promise<string | null>((resolve) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Error uploading thumbnail:', error);
            resolve(null);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              console.error('Error getting thumbnail URL:', error);
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error in uploadDataUrl:', error);
      return null;
    }
  };

  const uploadFile = useCallback(
    async (file: File, metadata?: Record<string, any>): Promise<UploadResult> => {
      // First validate the file
      const validationError = validateFile(file);
      if (validationError) {
        setUploadProgress({ 
          progress: 0, 
          url: null, 
          error: new Error(validationError.message) 
        });
        throw new Error(validationError.message);
      }
      
      // Determine file type
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const fileType = isVideo ? 'video' : isImage ? 'image' : 'other';
      
      // For videos, generate a thumbnail
      let thumbnailUrl: string | null = null;
      if (isVideo) {
        thumbnailUrl = await generateVideoThumbnail(file);
      }
      
      // Upload the thumbnail if generated
      if (isVideo && thumbnailUrl) {
        const uploadedThumbnailUrl = await uploadDataUrl(thumbnailUrl, `thumb-${file.name}.jpg`);
        if (uploadedThumbnailUrl) {
          thumbnailUrl = uploadedThumbnailUrl;
        }
      }
      
      // Prepare custom metadata with tags, thumbnail URL, etc.
      const customMetadata = {
        ...(metadata || {}),
        fileType: fileType,
        ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
      };
      
      // Upload the main file
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      try {
        setUploadProgress({ progress: 0, url: null, error: null });
        
        // Create upload task with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file, {
          customMetadata
        });
        
        // Return a promise that resolves when the upload completes
        return new Promise<UploadResult>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Track upload progress
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setUploadProgress({ progress, url: null, error: null });
            },
            (error) => {
              // Handle errors
              const errorInfo = handleStorageError(error);
              setUploadProgress({ 
                progress: 0, 
                url: null, 
                error: new Error(errorInfo.message) 
              });
              reject(errorInfo);
            },
            async () => {
              // Upload completed successfully, get the download URL
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setUploadProgress({ progress: 100, url, error: null });
                
                // Return the result with URL, thumbnail, and metadata
                resolve({
                  url,
                  thumbnailUrl: thumbnailUrl || undefined,
                  metadata: {
                    contentType: file.type,
                    size: file.size,
                    name: file.name,
                    fullPath: uploadTask.snapshot.ref.fullPath,
                    timeCreated: new Date().toISOString(),
                    type: fileType as 'image' | 'video' | 'other',
                    ...customMetadata
                  }
                });
              } catch (downloadError) {
                const errorInfo = handleStorageError(downloadError as Error);
                setUploadProgress({ 
                  progress: 0, 
                  url: null, 
                  error: new Error(errorInfo.message) 
                });
                reject(errorInfo);
              }
            }
          );
        });
      } catch (error) {
        const errorInfo = handleStorageError(error as Error);
        setUploadProgress({ 
          progress: 0, 
          url: null, 
          error: new Error(errorInfo.message) 
        });
        throw errorInfo;
      }
    },
    [path]
  );

  // Update file metadata
  const updateFileMetadata = useCallback(
    async (filePath: string, newMetadata: { [key: string]: any }) => {
      try {
        const fileRef = ref(storage, filePath);
        
        // Convert metadata to { customMetadata: { ... } } format
        await updateMetadata(fileRef, {
          customMetadata: newMetadata
        });
        
        return { success: true };
      } catch (error) {
        const errorInfo = handleStorageError(error as Error);
        console.error('Error updating metadata:', errorInfo.message);
        return { 
          success: false, 
          error: errorInfo
        };
      }
    },
    []
  );

  const deleteFile = useCallback(
    async (fileUrl: string) => {
      const fileRef = ref(storage, fileUrl);
      try {
        await deleteObject(fileRef);
        return { success: true };
      } catch (error) {
        const errorInfo = handleStorageError(error as Error);
        console.error('Error deleting file:', errorInfo.message);
        return { 
          success: false, 
          error: errorInfo
        };
      }
    },
    []
  );

  return {
    uploadFile,
    deleteFile,
    updateFileMetadata,
    uploadProgress,
  };
};