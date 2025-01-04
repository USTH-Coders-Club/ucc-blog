export default function Loading() {
  return (
    <div className="flex flex-col lg:flex-row font-[family-name:var(--font-manrope)] p-4 md:p-12 lg:p-24 gap-8 lg:gap-20 h-full animate-pulse">
        <div className="w-full lg:w-3/4 p-4 lg:p-8 bg-gray-200 rounded">
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-1/4 bg-gray-300 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="w-full lg:w-1/4 flex flex-col gap-8 lg:gap-16">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div>
              <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}