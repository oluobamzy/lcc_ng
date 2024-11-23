import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc, getDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Image, Save, X } from 'lucide-react';
import { slugify } from '../utils/formatters';



const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  details: z.string().min(1, 'Details are required'),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventEditorProps {
  eventId?: string | null;
  onClose: () => void;
  onSave: () => void;
}

export const EventEditor: React.FC<EventEditorProps> = ({ eventId, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        const event = eventDoc.data();
        reset({
          title: event.title,
          description: event.description,
          date: new Date(event.date.seconds * 1000).toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          details: event.details,
        });
        setImage(event.image || '');
      }
    };

    loadEvent();
  }, [eventId, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const storageRef = ref(storage, `events/${Date.now()}-${file.name}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setImage(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      const eventData = {
        ...data,
        image,
        date: new Date(data.date),
        slug: slugify(data.title),
        published: false,
        updatedAt: new Date(),
        ...(eventId ? {} : { createdAt: new Date() }),
      };

      const docRef = doc(db, 'events', eventId || Date.now().toString());
      await setDoc(docRef, eventData, { merge: true });
      
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#006297]">
              {eventId ? 'Edit Event' : 'New Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Featured Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="cursor-pointer bg-gray-50 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center space-x-2">
                  <Image className="w-5 h-5" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {image && (
                  <img
                    src={image}
                    alt="Featured"
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  {...register('time')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  {...register('location')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Details</label>
              <textarea
                {...register('details')}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
              {errors.details && (
                <p className="mt-1 text-sm text-red-600">{errors.details.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#006297] text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Event'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};