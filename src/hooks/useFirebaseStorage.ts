import { useState, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface UploadProgress {
  progress: number;
  url: string | null;
  error: Error | null;
}

export const useFirebaseStorage = (path: string) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    url: null,
    error: null,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
      
      try {
        setUploadProgress({ progress: 0, url: null, error: null });
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        
        setUploadProgress({ progress: 100, url, error: null });
        return url;
      } catch (error) {
        setUploadProgress({ progress: 0, url: null, error: error as Error });
        throw error;
      }
    },
    [path]
  );

  const deleteFile = useCallback(
    async (fileUrl: string) => {
      const fileRef = ref(storage, fileUrl);
      try {
        await deleteObject(fileRef);
        return true;
      } catch (error) {
        console.error('Error deleting file:', error);
        return false;
      }
    },
    []
  );

  return {
    uploadFile,
    deleteFile,
    uploadProgress,
  };
};