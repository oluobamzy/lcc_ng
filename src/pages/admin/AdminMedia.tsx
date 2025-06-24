import React, { useState, useEffect, useRef } from 'react';
import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc as docRef, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { storage, db } from '../../lib/firebase';
import { Trash2, Upload, Search, Play, ExternalLink, FileVideo, File, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext'; // Import auth context

interface MediaFile {
  id?: string;
  name: string;
  url: string;
  path: string;
  type: string;
  size: number;
  createdAt?: Date;
  thumbnail?: string;
}

export const AdminMedia = () => {
  const { user } = useAuth(); // Get the current authenticated user
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only fetch files if user is authenticated
    if (user) {
      fetchFiles();
    }
  }, [user]);
 
  const fetchFiles = async () => {
    setError(null);
    try {
      // Get files from Firestore for better metadata management
      const mediaCollection = collection(db, 'media');
      const mediaQuery = query(mediaCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(mediaQuery);
      
      const fileList = querySnapshot.docs.map(doc => {
        const data = doc.data() as MediaFile;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? (data.createdAt as any).toDate() : new Date(),
        };
      });
      
      setFiles(fileList);
    } catch (error: any) {
      console.error('Failed to fetch files:', error.code, error.message, error?.serverResponse);
      
      // Provide more specific error messages based on error code
      if (error.code === 'permission-denied') {
        setError('Permission denied: You don\'t have access to these files. Please check your Firebase rules.');
      } else if (error.code === 'storage/unauthorized') {
        setError('Storage access denied: Please check your Firebase storage rules.');
      } else if (error.code === 'storage/unknown') {
        setError('Storage error: Unknown Firebase storage error. This could be due to CORS settings or incorrect bucket configuration.');
        console.error('Firebase Storage Error Details:', error);
      } else if (error.code === 'storage/invalid-argument') {
        setError('Invalid storage reference: The storage bucket might not be configured correctly.');
      } else {
        setError(`Error fetching media: ${error.message}`);
      }
    }
  };
  

  const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'other';
  };
  
  const generateUniqueFileName = (file: File): string => {
    // Get file extension
    const fileExt = file.name.split('.').pop();
    // Create unique name using timestamp and random string
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    // Return unique filename with original extension
    return `${uniqueId}.${fileExt}`;
  };
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null;
    
    if ('dataTransfer' in event) {
      files = event.dataTransfer?.files || null;
    } else {
      files = event.target.files;
    }
    
    if (!files?.length) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Handle multiple file uploads in sequence
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = getFileType(file);
      const uniqueName = generateUniqueFileName(file);
      const storageRef = ref(storage, `media/${uniqueName}`);
      
      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Create promise to handle upload
      await new Promise<string>((resolve, reject) => {
        // Listen for state changes
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload failed:', error);
            if (error.code === 'storage/unauthorized') {
              setError('Permission denied: Please check if you have write access to Firebase Storage.');
            } else if (error.code === 'storage/quota-exceeded') {
              setError('Storage quota exceeded: Your Firebase storage quota has been exceeded.');
            } else {
              setError(`Upload failed: ${error.message}`);
            }
            reject(error);
          },
          async () => {
            // Upload completed successfully, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // If it's a video, try to generate thumbnail
            let thumbnailUrl = undefined;
            if (fileType === 'video') {
              try {
                // In a real app, you might want to use a cloud function for this
                // This is just a placeholder concept
                thumbnailUrl = downloadURL + '?thumb=true';
              } catch (err) {
                console.error('Failed to generate thumbnail:', err);
              }
            }
            
            // Store metadata in Firestore
            await addDoc(collection(db, 'media'), {
              name: uniqueName,
              originalName: file.name,
              url: downloadURL,
              path: `media/${uniqueName}`,
              type: fileType,
              size: file.size,
              createdAt: serverTimestamp(),
              thumbnail: thumbnailUrl
            });
            
            resolve(downloadURL);
          }
        );
      });
    }
    
    await fetchFiles();
    setUploading(false);
    setUploadProgress(0);
    
    // Reset file input
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  const handleDelete = async (path: string) => {
    // Set the path as the one to confirm, this will open the confirmation dialog
    setShowDeleteConfirm(path);
  };
  
  const confirmDelete = async (path: string) => {
    const fileRef = ref(storage, path);
    try {
      // Find the Firestore document with this path
      const mediaCollection = collection(db, 'media');
      const q = query(mediaCollection);
      const querySnapshot = await getDocs(q);
      
      // Find the document that matches the path
      const docToDelete = querySnapshot.docs.find(
        doc => doc.data().path === path
      );
      
      // Delete from Storage
      await deleteObject(fileRef);
      
      // Delete from Firestore if found
      if (docToDelete) {
        await deleteDoc(docRef(db, 'media', docToDelete.id));
      }
      
      // Update state
      setFiles((prevFiles) => prevFiles.filter((file) => file.path !== path));
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setShowDeleteConfirm(null);
    }
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Removed unused getFileIcon function as its value was never read.

  return (
    <div 
      className="relative min-h-screen" 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#006297]">Media Library</h1>
          <p className="text-gray-500">Manage your media files</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search media..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006297]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex rounded-lg overflow-hidden">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm ${filter === 'all' ? 'bg-[#006297] text-white' : 'bg-gray-100'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('images')}
              className={`px-3 py-2 text-sm ${filter === 'images' ? 'bg-[#006297] text-white' : 'bg-gray-100'}`}
            >
              Images
            </button>
            <button 
              onClick={() => setFilter('videos')}
              className={`px-3 py-2 text-sm ${filter === 'videos' ? 'bg-[#006297] text-white' : 'bg-gray-100'}`}
            >
              Videos
            </button>
          </div>
          
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#006297] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90 cursor-pointer shadow-md"
            aria-label="Upload a new media file"
          >
            <Upload className="w-5 h-5" />
            <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            <input
              ref={uploadInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              multiple
              accept="image/*,video/*"
            />
          </motion.label>
        </div>
      </motion.div>
      
      {/* Upload Progress */}
      {uploading && (
        <motion.div 
          className="mb-8 bg-white p-4 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Uploading files...</h3>
            <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className="bg-[#006297] h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${uploadProgress}%` }}
            ></motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Drag overlay */}
      <AnimatePresence>
        {dragActive && (
          <motion.div 
            className="absolute inset-0 bg-[#006297] bg-opacity-90 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center text-white">
              <Upload className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Drop your files here</h2>
              <p>Upload images and videos to your media library</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!files.length && !uploading ? (
        <motion.div 
          className="text-center py-16 bg-white rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Upload className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 mb-6">No media uploaded yet.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#006297] text-white px-6 py-2 rounded-lg"
            onClick={() => uploadInputRef.current?.click()}
          >
            Upload your first file
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {files
            .filter(file => {
              // Filter by type
              if (filter === 'images' && file.type !== 'image') return false;
              if (filter === 'videos' && file.type !== 'video') return false;
              
              // Filter by search term
              if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
              
              return true;
            })
            .map((file) => (
              <motion.div 
                key={file.path} 
                className="relative group bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {file.type === 'image' ? (
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={file.url}
                      alt={`Media file ${file.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : file.type === 'video' ? (
                  <div className="aspect-square bg-gray-100 relative">
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt={`Thumbnail for ${file.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <FileVideo className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <File className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="truncate pr-2">
                      <h3 className="font-medium truncate">{file.name.split('-').slice(1).join('-')}</h3>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size || 0)}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2, color: "#ef4444" }}
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(file.path)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Overlay for quick preview */}
                <motion.div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                >
                  <motion.a 
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-90 rounded-full p-3 m-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExternalLink className="w-5 h-5 text-[#006297]" />
                  </motion.a>
                </motion.div>
              </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center mb-4 text-red-500">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold">Confirm Deletion</h3>
              </div>
              
              <p className="mb-6">Are you sure you want to delete this media file? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => confirmDelete(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
