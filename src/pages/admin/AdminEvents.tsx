import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { format } from 'date-fns';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { EventEditor } from '../../components/EventEditor';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  published: boolean;
}

export const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    const eventsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Event[];
    setEvents(eventsData);
    setLoading(false);
  };

  const togglePublish = async (eventId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'events', eventId), {
      published: !currentStatus
    });
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, published: !currentStatus } : event
    ));
  };

  const deleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteDoc(doc(db, 'events', eventId));
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleEdit = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedEventId(null);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    setIsEditorOpen(false);
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006297]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#006297]">Events</h1>
        <button
          onClick={handleCreate}
          className="bg-[#006297] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90"
        >
          <Plus className="w-5 h-5" />
          <span>New Event</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(event.date, 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{event.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{event.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => togglePublish(event.id, event.published)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {event.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(event.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditorOpen && (
        <EventEditor
          eventId={selectedEventId}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};