export default function MessagesLoading() {
  return (
    <div className="h-[600px] flex items-center justify-center bg-[#FDFBF7] animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-neutral-200" />
        <div className="h-4 w-40 bg-neutral-200 rounded-full" />
      </div>
    </div>
  );
}
