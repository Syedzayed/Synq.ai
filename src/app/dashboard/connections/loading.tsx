export default function ConnectionsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-20 bg-neutral-200 rounded-full" />
        <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-80 bg-neutral-200 rounded-full" />
      </div>

      {/* Sections Skeleton */}
      {[1, 2].map((sec) => (
        <div key={sec} className="space-y-4">
          <div className="h-4 w-32 bg-neutral-200 rounded-full" />
          <div className="space-y-3">
            {[1, 2].map((idx) => (
              <div 
                key={idx} 
                className="h-20 rounded-2xl p-4 bg-white border flex items-center justify-between"
                style={{ borderColor: "rgba(232,226,216,0.8)" }}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-neutral-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-neutral-200 rounded-full" />
                    <div className="h-3 w-40 bg-neutral-200 rounded-full" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-neutral-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
