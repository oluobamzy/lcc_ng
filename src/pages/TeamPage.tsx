import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TeamMember } from '../types';
import { Mail, Phone, Facebook, Instagram, Twitter, Linkedin, X } from 'lucide-react';

export const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Simple query first - just get all team documents
        const q = query(collection(db, 'team'));
        const querySnapshot = await getDocs(q);
        
        console.log('Team query snapshot:', querySnapshot);
        console.log('Number of team documents:', querySnapshot.size);
        
        const allTeamData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Team document data:', { id: doc.id, ...data });
          
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        }) as TeamMember[];

        console.log('All team members:', allTeamData);
        
        // Filter active members and sort by order
        const activeTeamMembers = allTeamData
          .filter(member => {
            console.log(`Member ${member.name} active status:`, member.active);
            return member.active === true;
          })
          .sort((a, b) => {
            const orderA = Number(a.order) || 0;
            const orderB = Number(b.order) || 0;
            return orderA - orderB;
          });
        
        console.log('Active team members after filtering:', activeTeamMembers);
        
        setTeamMembers(activeTeamMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Add keyboard support for closing modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const openMemberModal = (member: TeamMember) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006297]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#006297] mb-4">Our Team</h1>
          <div className="w-24 h-1 bg-[#BAD975] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated team members who serve our community with passion and commitment.
          </p>
        </div>
        
        {teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No team members found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => openMemberModal(member)}
              >
                <div className="aspect-w-1 aspect-h-1 relative">
                  <img
                    src={member.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <div className="text-white opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-sm font-semibold">Click to view details</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#006297] mb-2">{member.name}</h3>
                  <p className="text-[#BAD975] font-semibold mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm line-clamp-3">{member.bio}</p>
                  
                  {/* Quick Contact Icons */}
                  <div className="flex space-x-3 justify-center mt-4 pt-4 border-t">
                    {member.email && <Mail className="w-4 h-4 text-gray-400" />}
                    {member.phone && <Phone className="w-4 h-4 text-gray-400" />}
                    {member.socialMedia.facebook && <Facebook className="w-4 h-4 text-gray-400" />}
                    {member.socialMedia.instagram && <Instagram className="w-4 h-4 text-gray-400" />}
                    {member.socialMedia.twitter && <Twitter className="w-4 h-4 text-gray-400" />}
                    {member.socialMedia.linkedin && <Linkedin className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Member Detail Modal */}
      {showModal && selectedMember && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-24 overflow-y-auto"
          onClick={(e) => {
            // Close modal when clicking the backdrop
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedMember.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={selectedMember.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedMember.name}</h2>
                <p className="text-[#BAD975] font-semibold text-lg">{selectedMember.position}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Biography */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#006297] mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedMember.bio}</p>
              </div>

              {/* Contact Information */}
              {(selectedMember.email || selectedMember.phone) && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#006297] mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    {selectedMember.email && (
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-[#006297] mr-3" />
                        <a 
                          href={`mailto:${selectedMember.email}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {selectedMember.email}
                        </a>
                      </div>
                    )}
                    {selectedMember.phone && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-[#006297] mr-3" />
                        <a 
                          href={`tel:${selectedMember.phone}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {selectedMember.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              {(selectedMember.socialMedia?.facebook || 
                selectedMember.socialMedia?.twitter || 
                selectedMember.socialMedia?.instagram || 
                selectedMember.socialMedia?.linkedin) && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#006297] mb-3">Connect With Me</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {selectedMember.socialMedia.facebook && (
                      <a
                        href={selectedMember.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="w-5 h-5 mr-2" />
                        Facebook
                      </a>
                    )}
                    {selectedMember.socialMedia.instagram && (
                      <a
                        href={selectedMember.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <Instagram className="w-5 h-5 mr-2" />
                        Instagram
                      </a>
                    )}
                    {selectedMember.socialMedia.twitter && (
                      <a
                        href={selectedMember.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-blue-400 text-white py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors"
                      >
                        <Twitter className="w-5 h-5 mr-2" />
                        Twitter
                      </a>
                    )}
                    {selectedMember.socialMedia.linkedin && (
                      <a
                        href={selectedMember.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 mr-2" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-[#006297] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
