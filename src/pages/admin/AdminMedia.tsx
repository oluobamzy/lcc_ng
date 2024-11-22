import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { Trash2, Upload } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  path: string;
}

export const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const storageRef = ref(storage, 'media');
    const result = await listAll(storageRef);
    
    const filePromises = result.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return {
        name: item.name,
        url,
        path: item.fullPath,
      };
    });

    const fileList = await Promise.all(filePromises);
    setFiles(fileList);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    setUploading(true);
    const file = event.target.files[0];
    const storageRef = ref(storage, `media/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      await fetchFiles();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    const fileRef = ref(storage, path);
    try {
      await deleteObject(fileRef);
      setFiles(files.filter(file => file.path !== path));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#006297]">Media Library</h1>
        <label className="bg-[#006297] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90 cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>Upload File</span>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div key={file.path} className="relative group">
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                onClick={() => handleDelete(file.path)}
                className="text-white p-2 hover:text-red-500"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};