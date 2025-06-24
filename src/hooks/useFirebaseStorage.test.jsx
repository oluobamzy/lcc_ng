import { useFirebaseStorage } from './useFirebaseStorage';

// This is a placeholder for tests
// In a real project, you would add Jest or React Testing Library tests here
export function TestUpload() {
  const { uploadFile, uploadProgress } = useFirebaseStorage('test');
  
  const handleUpload = async (file) => {
    if (!file) return;
    try {
      const url = await uploadFile(file);
      console.log('Uploaded file to:', url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <div>
      <h1>Test Firebase Upload</h1>
      <p>Progress: {uploadProgress.progress}%</p>
      <input 
        type="file" 
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])} 
      />
    </div>
  );
}
