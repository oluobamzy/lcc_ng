import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { Download, Trash2, Upload, X, Eye, Check, File, Play, Upload as UploadIcon } from 'lucide-react';
import { useFirebaseStorage } from '../../hooks/useFirebaseStorage';
import { verifyFirebaseStorage } from '../../utils/firebase-utils';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

interface MediaLibraryProps {
  onSelect?: (file: MediaFile) => void;
  selectable?: boolean;
  editable?: boolean;
  className?: string;
}

export function MediaLibrary({
  onSelect,
  selectable = false,
  editable = true,
  className = ''
}: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean; error?: string; warning?: string} | null>(null);
  const { uploadFile, deleteFile, uploadProgress: fileUploadProgress } = useFirebaseStorage('media');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    checkFirebaseConnection();
    fetchFiles();
  }, []);

  const checkFirebaseConnection = async () => {
    const status = await verifyFirebaseStorage();
    setConnectionStatus(status);
    
    if (!status.success) {
      console.error('Firebase Storage connection issue:', status.error);
    }
  };

  const fetchFiles = async () => {
    if (!connectionStatus?.success) {
      console.log('Skipping file fetch due to storage connection issues');
      return;
    }
    
    try {
      console.log('Attempting to fetch files from media directory');
      // First check if the media folder exists
      try {
        const storageRef = ref(storage, 'media');
        const result = await listAll(storageRef);
        console.log('Files fetched successfully:', result.items.length);
        
        const filePromises = result.items.map(async (item) => {
          try {
            const url = await getDownloadURL(item);
            const metadata = {
              contentType: item.name.endsWith('.jpg') || item.name.endsWith('.jpeg') ? 'image/jpeg' : 
                           item.name.endsWith('.png') ? 'image/png' :
                           item.name.endsWith('.gif') ? 'image/gif' :
                           item.name.endsWith('.mp4') ? 'video/mp4' : 
                           'application/octet-stream',
              size: 0 // This would normally come from the file metadata
            };
            
            return {
              id: item.name,
              name: item.name,
              url,
              path: item.fullPath,
              type: metadata.contentType?.split('/')[0] || 'unknown',
              size: metadata.size || 0,
              uploadedAt: new Date()
            };
          } catch (itemError) {
            console.error(`Error processing item ${item.name}:`, itemError);
            return null;
          }
        });

        const fileList = (await Promise.all(filePromises)).filter(file => file !== null) as MediaFile[];
        setFiles(fileList);
      } catch (listError: any) {
        console.error('Error listing files:', listError);
        if (listError.code) {
          console.error(`Firebase error code: ${listError.code}`);
        }
        throw listError;
      }
    } catch (error: any) {
      console.error('Error fetching files:', error);
      // Check for specific Firebase errors
      if (error.code === 'storage/unauthorized') {
        console.error('Access denied. Check Firebase Storage rules.');
        setUploadError('Access denied to Firebase Storage. Check your storage rules.');
      } else if (error.code === 'storage/object-not-found') {
        console.log('Media folder does not exist yet. This is normal for new projects.');
        setFiles([]);
        // Don't set an error for this case as it's expected for new projects
      } else if (error.code === 'storage/unknown') {
        console.error('Unknown Firebase error. Check Firebase project settings and credentials.');
        setUploadError('Storage connection error. Check your Firebase project configuration and CORS settings.');
      } else if (error.code === 'storage/invalid-argument') {
        console.error('Invalid storage reference. The storage bucket might not be configured correctly.');
        setUploadError('Storage configuration error. Please check your Firebase storage settings.');
      } else {
        setUploadError(`Unhandled storage error: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    const file = event.target.files[0];
    
    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        // Update local state from the hook's state
        setUploadProgress(fileUploadProgress.progress);
        if (fileUploadProgress.progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
      
      // Use our custom hook to upload and get the URL back
      const url = await uploadFile(file);
      
      // After successful upload, refresh the file list
      await fetchFiles();
      
      // Clean up interval
      clearInterval(progressInterval);
      
      return url;
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!editable) return;
    
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteFile(file.path);
      setFiles(files.filter(f => f.path !== file.path));
      if (selectedFile?.path === file.path) {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleSelect = (file: MediaFile) => {
    if (!selectable) return;
    
    setSelectedFile(file);
    if (onSelect) {
      onSelect(file);
    }
    
    if (isModalOpen) {
      setIsModalOpen(false); 
    }
  };

  // Preview modal for media files
  const openPreview = (file: MediaFile) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const isImage = (file: MediaFile) => {
    return file.type === 'image';
  };
  
  const isVideo = (file: MediaFile) => {
    return file.type === 'video';
  };

  // New drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!editable) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;
    
    // Check if files are media
    const mediaFiles = droppedFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (mediaFiles.length === 0) {
      setUploadError('Only image and video files are allowed.');
      return;
    }
    
    // Upload each file
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      let completedUploads = 0;
      
      for (const file of mediaFiles) {
        try {
          await uploadFile(file);
          completedUploads++;
          setUploadProgress(Math.round((completedUploads / mediaFiles.length) * 100));
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
        }
      }
      
      // Refresh the file list
      await fetchFiles();
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [editable, uploadFile]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Media Library</h2>
        {editable && (
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              onChange={handleUpload}
              accept="image/*, video/*"
            />
            <label
              htmlFor="file-upload"
              className="bg-[#006297] hover:bg-[#004e77] text-white px-4 py-2 rounded-md flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Upload size={18} />
              <span>Upload</span>
            </label>
          </div>
        )}
      </div>
      
      {/* Connection Status Messages */}
      {connectionStatus && !connectionStatus.success && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div>
              <h3 className="text-red-800 font-medium">Firebase Storage Error</h3>
              <p className="text-sm text-red-700 mt-1">{connectionStatus.error}</p>
              <p className="text-sm text-red-700 mt-2">
                Please check your Firebase configuration in the environment variables. 
                Make sure the storage bucket is correctly set up and the rules allow read/write access.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {connectionStatus && connectionStatus.success && connectionStatus.warning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex">
            <div>
              <h3 className="text-yellow-800 font-medium">Firebase Storage Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">{connectionStatus.warning}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-blue-800 font-medium">Uploading file...</h3>
            <span className="text-blue-800">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div>
              <h3 className="text-red-800 font-medium">Upload Error</h3>
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Drag and Drop Area */}
      {editable && (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-[#006297] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-3">
            <div className="flex justify-center">
              <UploadIcon className={`w-12 h-12 ${isDragging ? 'text-[#006297]' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              {isDragging ? 'Drop files to upload' : 'Drag and drop files here'}
            </h3>
            <p className="text-sm text-gray-500">
              Supports images and videos up to 10MB
            </p>
          </div>
        </div>
      )}
      
      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((file) => (
          <motion.div 
            key={file.path} 
            className={`relative group rounded-lg overflow-hidden shadow-md
              ${selectable && selectedFile?.path === file.path ? 'ring-2 ring-[#006297]' : ''}
            `}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {/* File Preview */}
            <div 
              className="aspect-w-16 aspect-h-12 bg-gray-100 cursor-pointer"
              onClick={() => openPreview(file)}
            >
              {isImage(file) ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="object-cover w-full h-full"
                />
              ) : isVideo(file) ? (
                <div className="relative">
                  <video
                    src={file.url}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white bg-black/50 rounded-full p-3" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <File className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-3">
                <button
                  onClick={() => openPreview(file)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="Preview"
                >
                  <Eye className="w-5 h-5 text-gray-800" />
                </button>
                
                {selectable && (
                  <button
                    onClick={() => handleSelect(file)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Select"
                  >
                    <Check className="w-5 h-5 text-[#006297]" />
                  </button>
                )}
                
                <a
                  href={file.url}
                  download={file.name}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="Download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-5 h-5 text-gray-800" />
                </a>
                
                {editable && (
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* File name */}
            <div className="p-2 bg-white">
              <p className="text-sm truncate" title={file.name}>
                {file.name}
              </p>
            </div>
          </motion.div>
        ))}
        
        {files.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No media files found.</p>
            {editable && (
              <p className="mt-2 text-sm">Upload files to get started.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Preview Modal */}
      {isModalOpen && selectedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">{selectedFile.name}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-auto flex-1">
              {isImage(selectedFile) ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="object-contain max-h-[70vh] w-full"
                />
              ) : isVideo(selectedFile) ? (
                <video 
                  src={selectedFile.url} 
                  controls 
                  className="w-full max-h-[70vh]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-10">
                  <File className="h-20 w-20 text-gray-400 mb-4" />
                  <p>Preview not available</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  {new Date(selectedFile.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <a
                  href={selectedFile.url}
                  download={selectedFile.name}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </a>
                
                {editable && (
                  <button
                    onClick={() => {
                      handleDelete(selectedFile);
                      setIsModalOpen(false);
                    }}
                    className="px-3 py-1 text-red-500 bg-red-50 rounded hover:bg-red-100 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                )}
                
                {selectable && (
                  <button
                    onClick={() => {
                      handleSelect(selectedFile);
                      setIsModalOpen(false);
                    }}
                    className="px-3 py-1 bg-[#006297] text-white rounded hover:bg-opacity-90"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}


