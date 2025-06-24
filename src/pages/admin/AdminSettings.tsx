
import { useForm } from 'react-hook-form';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';

interface SettingsForm {
  churchName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export const AdminSettings = () => {
  const { register, handleSubmit, setValue } = useForm<SettingsForm>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const settingsRef = doc(db, 'settings', 'general');
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
          const data = settingsDoc.data() as SettingsForm;
          
          // Set form values
          setValue('churchName', data.churchName || '');
          setValue('address', data.address || '');
          setValue('phone', data.phone || '');
          setValue('email', data.email || '');
          setValue('socialMedia.facebook', data.socialMedia?.facebook || '');
          setValue('socialMedia.instagram', data.socialMedia?.instagram || '');
          setValue('socialMedia.youtube', data.socialMedia?.youtube || '');
        } else {
          // If the document doesn't exist yet, we'll use empty values
          // This happens when settings are accessed for the first time
          console.log('Settings document does not exist yet. Will be created on save.');
        }
      } catch (err: any) {
        console.error('Error loading settings:', err);
        
        if (err.code === 'permission-denied') {
          setError('Permission denied: You don\'t have access to settings. Please check Firestore rules.');
        } else {
          setError('Failed to load settings: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [user, setValue]);

  const onSubmit = async (data: SettingsForm) => {
    if (!user) return;
    
    setError(null);
    setSaveSuccess(false);
    setLoading(true);
    
    try {
      // Make sure we create the document if it doesn't exist (use merge option)
      await setDoc(doc(db, 'settings', 'general'), data, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err: any) {
      console.error('Error saving settings:', err);
      
      if (err.code === 'permission-denied') {
        setError('Permission denied: You don\'t have access to save settings. Please check Firestore rules.');
      } else {
        setError('Failed to save settings: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#006297] mb-6">Settings</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006297]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">
              <p>Settings saved successfully!</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Church Name</label>
            <input
              type="text"
              {...register('churchName', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              {...register('address', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                {...register('phone', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
              <input
                type="url"
                {...register('socialMedia.facebook')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
              <input
                type="url"
                {...register('socialMedia.instagram')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
              <input
                type="url"
                {...register('socialMedia.youtube')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#006297] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};