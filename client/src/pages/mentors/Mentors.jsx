import  { useState } from 'react';
import { useMentors } from '../../hooks/useMentors';

import NavBar from '../../components/navbar/NavBar';
import Footer from '../../components/footer/Footer';
import Search from '../../components/search/Search';
import FiltreButtons from '../../components/filtreButtons';
import Pagination from '../../components/Pagination';
import MentorCard from '../../components/mentorCard/MentorCard';
import MentorSkeleton from '../../components/mentorCard/MentorSkeleton';

const Mentors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    setData,
    displayedMentors,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    error,
    data
  } = useMentors(searchQuery);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-8">
          {[1, 2, 3].map((n) => (
            <MentorSkeleton key={n} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#007749] text-white rounded-lg font-medium hover:bg-[#00663d] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    if (displayedMentors.length === 0) {
      return (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No mentors found</h2>
          <p className="text-gray-600">We couldn't find any mentors matching your current search or filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); window.location.href='/mentors' }}
            className="mt-4 text-[#007749] font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-8">
          {displayedMentors.map((mentor) => (
            <MentorCard key={mentor._id} mentor={mentor} />
          ))}
        </div>
        
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <div className="max-w-screen-lg mx-auto px-4 pt-12 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Find Your Next <span className="text-[#007749]">Mentor</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our community of expert professionals and find the perfect match to guide your career growth.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Search onSearch={handleSearch} />
        </div>
      </div>

      <FiltreButtons setData={setData} />

      {/* Conditional rendering based on isLoading */}
      <div className="max-w-screen-lg mx-auto px-4 pb-20">
        {renderContent()}
      </div>
      
      <Footer />
    </div>
  );
};

export default Mentors;