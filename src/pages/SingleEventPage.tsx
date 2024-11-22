import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  details: string;
  slug: string;
}

export const SingleEventPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;

      const q = query(
        collection(db, 'events'),
        where('slug', '==', slug)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const eventData = querySnapshot.docs[0].data() as Event;
        setEvent({
          ...eventData,
          id: querySnapshot.docs[0].id,
          date: eventData.date.toDate(),
        });
      }
      setLoading(false);
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006297]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg shadow-md mb-8"
          />
        )}
        
        <h1 className="text-4xl font-bold text-[#006297] mb-6">{event.title}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="w-6 h-6 text-[#006297] mb-2" />
              <span className="text-sm text-gray-500">Date</span>
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 text-[#006297] mb-2" />
              <span className="text-sm text-gray-500">Time</span>
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-6 h-6 text-[#006297] mb-2" />
              <span className="text-sm text-gray-500">Location</span>
              <span className="font-medium">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">{event.description}</p>
          {event.details.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};