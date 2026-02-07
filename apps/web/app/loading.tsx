export default function Loading() {
  return (
    <div className="min-h-screen bg-neo-yellow flex flex-col items-center justify-center gap-8">
      <div className="relative">
        {/* Spinning Box */}
        <div className="w-24 h-24 bg-neo-cyan border-4 border-black animate-spin-slow shadow-[8px_8px_0px_0px_#000]"></div>
        
        {/* Inner Static Box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-neo-pink border-4 border-black animate-bounce"></div>
        </div>
      </div>
      
      <div className="text-4xl font-black tracking-tighter animate-pulse">
        LOADING...
      </div>
    </div>
  );
}
