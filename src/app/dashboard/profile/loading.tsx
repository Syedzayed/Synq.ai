export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-20 bg-neutral-200 rounded-full" />
        <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-80 bg-neutral-200 rounded-full" />
      </div>

      {/* Profile Form Skeleton */}
      <div 
        className="rounded-3xl p-6 bg-white border space-y-6"
        style={{ borderColor: "rgba(232,226,216,0.9)" }}
      >
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-2xl bg-neutral-200" />
          <div className="flex-1 space-y-2.5 self-center">
            <div className="h-5 w-32 bg-neutral-200 rounded-full" />
            <div className="h-3.5 w-48 bg-neutral-200 rounded-full" />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          {[1, 2, 3].map((f) => (
            <div key={f} className="space-y-2">
              <div className="h-4 w-24 bg-neutral-200 rounded-full" />
              <div className="h-12 bg-neutral-100 rounded-2xl w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
