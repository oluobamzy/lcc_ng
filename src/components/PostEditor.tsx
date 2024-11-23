import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Image, Save, X } from 'lucide-react';
import { Post } from '../types';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  tags: z.string().transform(str => str.split(',').map(tag => tag.trim())),
  slug: z.string().min(1, 'Slug is required'),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  postId?: string;
  onClose: () => void;
  onSave: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ postId, onClose, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        const post = postDoc.data() as Post;
        reset({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          tags: post.tags,
          slug: post.slug,
        });
        setFeaturedImage(post.featuredImage || '');
      }
    };

    loadPost();
  }, [postId, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFeaturedImage(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const postData = {
        ...data,
        featuredImage,
        author: user.uid,
        updatedAt: new Date(),
        published: false,
        ...(postId ? {} : { createdAt: new Date() }),
      };

      const docRef = doc(db, 'posts', postId || Date.now().toString());
      await setDoc(docRef, postData, { merge: true });
      
      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
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
              {postId ? 'Edit Post' : 'New Post'}
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
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                {...register('slug')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
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
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                {...register('content')}
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                {...register('tags')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
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
                <span>{loading ? 'Saving...' : 'Save Post'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};