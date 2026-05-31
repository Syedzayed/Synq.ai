export default function NotificationsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-20 bg-neutral-200 rounded-full" />
        <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-80 bg-neutral-200 rounded-full" />
      </div>

      {/* Tabs Skeleton */}
      <div className="h-10 w-44 bg-neutral-200 rounded-2xl" />

      {/* List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((idx) => (
          <div 
            key={idx} 
            className="h-16 rounded-2xl p-4 bg-white border flex items-center justify-between"
            style={{ borderColor: "rgba(232,226,216,0.8)" }}
          >
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-neutral-200" />
              <div className="space-y-2 self-center">
                <div className="h-4 w-40 bg-neutral-200 rounded-full" />
                <div className="h-3 w-64 bg-neutral-200 rounded-full" />
              </div>
            </div>
            <div className="h-3.5 w-12 bg-neutral-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
