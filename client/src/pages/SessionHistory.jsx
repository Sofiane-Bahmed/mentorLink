import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSessionHistory } from '../api/sessionService';
import NavBar from '../components/navbar/NavBar';
import Footer from '../components/footer/Footer';
import Pagination from '../components/Pagination';
import { MdHistory, MdCalendarToday, MdAccessTime, MdPerson, MdSearch, MdVideocam } from 'react-icons/md';

const SessionHistory = () => {
  const { user: localUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  useEffect(() => {
    if (localUser?.userId) {
      fetchSessions();
    }
  }, [localUser, page]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getSessionHistory(localUser.userId, localUser.userRole, page, limit);
      setSessions(data.sessions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const partner = localUser.userRole === 'mentor' ? session.aprenant : session.mentor;
    const fullName = `${partner?.firstName} ${partner?.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#E6F2ED] rounded-2xl border border-[#007749]/10">
                <MdHistory className="text-3xl text-[#007749]" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Session History</h1>
            </div>
            <p className="text-gray-500 font-medium ml-1">
              Browse and search through your past mentorship sessions.
            </p>
          </div>

          <div className="relative group min-w-[300px]">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl transition-colors group-focus-within:text-[#007749]" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#007749]/5 focus:border-[#007749] transition-all font-medium text-gray-700 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Partner</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Time</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-6">
                        <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => {
                    const partner = localUser.userRole === 'mentor' ? session.aprenant : session.mentor;
                    const date = new Date(session.date).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    });

                    return (
                      <tr key={session._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={partner?.image?.url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(partner?.firstName + ' ' + partner?.lastName) + '&background=E6F2ED&color=007749'}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
                                onError={(e) => {
                                  e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(partner?.firstName + ' ' + partner?.lastName) + '&background=E6F2ED&color=007749';
                                }}
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#007749] border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-[#007749] transition-colors leading-tight">
                                {partner?.firstName} {partner?.lastName}
                              </p>
                              <p className="text-xs text-gray-400 font-medium mt-0.5">{partner?.mail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-600 font-semibold">
                            <MdCalendarToday className="text-gray-300" />
                            {date}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-600 font-semibold">
                            <MdAccessTime className="text-gray-300" />
                            {session.startTime}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-100">
                            Completed
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2.5 text-gray-400 hover:text-[#007749] hover:bg-[#E6F2ED] rounded-xl transition-all">
                            <MdVideocam size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="max-w-xs mx-auto">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                          <MdHistory className="text-4xl text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No sessions found</h3>
                        <p className="text-gray-400 font-medium">You haven't participated in any mentorship sessions yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SessionHistory;
