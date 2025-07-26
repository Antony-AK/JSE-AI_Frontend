const SkeletonJobApplicationTracker = () => {
  return (
    <div className="w-full mb-5 -space-y-6 rounded-xl bg-white border border-gray-400/20">
      <div className="h-[720px] overflow-x-hidden overflow-y-auto scrollbar-custom px-4 pt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start h-48 animate-pulse bg-white relative justify-between border-y rounded-s-xl border-gray-400/20 px-4 py-5">
            <div className="flex flex-col min-w-[400px] space-y-3 ms-3 mb-2">
              <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>

              <div className="flex flex-col gap-2 mt-6">
                {[1, 2].map((_, i) => (
                  <div key={i} className="grid grid-cols-[120px_1fr] gap-2">
                    <div className="h-4 bg-gray-300 w-28 rounded"></div>
                    <div className="h-4 bg-gray-200 w-64 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-start mr-2 items-center mt-6">
              <div className="relative w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-20 mt-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonJobApplicationTracker;
