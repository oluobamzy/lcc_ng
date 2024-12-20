import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    console.log({ name, email, subject, message });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#006297] mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-[#006297]" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">Osogbo, Osun, State</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-[#006297]" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">(234) 803-859-3965</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-[#006297]" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">bunmiakinyosolaministries@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-[#006297]" />
                  <div>
                    <h3 className="font-medium">Service Times</h3>
                    <p className="text-gray-600">Sundays: 9:00 AM & 11:00 AM</p>
                    <p className="text-gray-600">Wednesdays: 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
                  name='name'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
                  name='email'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
                  name='subject'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name='message'
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006297] focus:ring focus:ring-[#006297] focus:ring-opacity-50"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#006297] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};