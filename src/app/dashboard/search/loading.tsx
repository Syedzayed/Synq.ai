export default function SearchLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-20 bg-neutral-200 rounded-full" />
        <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-80 bg-neutral-200 rounded-full" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-20 bg-neutral-100 rounded-3xl w-full" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((idx) => (
          <div 
            key={idx} 
            className="h-80 rounded-3xl p-5 border bg-white flex flex-col justify-between"
            style={{ borderColor: "rgba(232,226,216,0.9)" }}
          >
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-2xl bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-neutral-200 rounded-full" />
                  <div className="h-3 w-36 bg-neutral-200 rounded-full" />
                </div>
              </div>
              <div className="h-16 bg-neutral-100 rounded-2xl w-full" />
            </div>
            <div className="h-10 bg-neutral-200 rounded-2xl w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
