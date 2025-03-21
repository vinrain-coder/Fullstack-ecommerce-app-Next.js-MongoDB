import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <span className="text-lg font-semibold text-gray-700 animate-pulse">
          ShoePedi is loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
