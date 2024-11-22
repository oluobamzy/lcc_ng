import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../types';
import { formatDate } from '../utils/formatters';
import { Calendar, User } from 'lucide-react';

export const SinglePostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const q = query(
        collection(db, 'posts'),
        where('slug', '==', slug),
        where('published', '==', true)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const postData = querySnapshot.docs[0].data() as Post;
        setPost({
          ...postData,
          id: querySnapshot.docs[0].id,
          createdAt: postData.createdAt.toDate(),
          updatedAt: postData.updatedAt.toDate(),
        });
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006297]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg shadow-md mb-8"
          />
        )}
        
        <h1 className="text-4xl font-bold text-[#006297] mb-4">{post.title}</h1>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-8">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {post.author}
          </span>
        </div>

        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#BAD975] text-[#006297] px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};