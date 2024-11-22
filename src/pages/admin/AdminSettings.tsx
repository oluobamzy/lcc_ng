import React from 'react';
import { useForm } from 'react-hook-form';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>();

  const onSubmit = async (data: SettingsForm) => {
    try {
      await setDoc(doc(db, 'settings', 'general'), data);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#006297] mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
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
    </div>
  );
};