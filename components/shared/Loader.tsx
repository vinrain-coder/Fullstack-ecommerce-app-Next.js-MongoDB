import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white z-50 absolute top-0 left-0 right-0 bottom-0">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <span className="text-lg font-semibold text-gray-700 animate-pulse">
          ShoePedi is loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
