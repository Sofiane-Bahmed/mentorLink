
const MessagesSkeleton = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden animate-pulse">
      {/* Navbar Placeholder (Matches Navbar height/style) */}
      <div className="h-16 bg-white border-b border-gray-200 shrink-0"></div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto flex md:p-4 lg:p-6 gap-0 md:gap-4 lg:gap-6 overflow-hidden w-full h-full">
          
          {/* Contact List Skeleton */}
          <div className="w-full md:w-80 lg:w-96 flex flex-col h-full shrink-0 bg-white border-r md:border-none md:rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-100 rounded w-10"></div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window Skeleton */}
          <div className="hidden md:flex flex-1 flex-col h-full bg-white md:rounded-2xl shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100"></div>
                <div className="w-8 h-8 rounded-lg bg-gray-100"></div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50/50">
              <div className="flex justify-start">
                <div className="max-w-[70%] space-y-2">
                  <div className="h-10 bg-white border border-gray-100 rounded-2xl rounded-tl-none w-64 shadow-sm"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 ml-1"></div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] space-y-2 items-end flex flex-col">
                  <div className="h-12 bg-[#007749]/10 rounded-2xl rounded-tr-none w-72 shadow-sm"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 mr-1"></div>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[70%] space-y-2">
                  <div className="h-16 bg-white border border-gray-100 rounded-2xl rounded-tl-none w-56 shadow-sm"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 ml-1"></div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] space-y-2 items-end flex flex-col">
                  <div className="h-10 bg-[#007749]/10 rounded-2xl rounded-tr-none w-48 shadow-sm"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 mr-1"></div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="h-12 bg-gray-50 rounded-xl w-full flex items-center px-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessagesSkeleton;
