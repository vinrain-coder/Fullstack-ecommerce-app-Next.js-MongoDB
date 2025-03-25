import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full justify-center items-center pointer-events-none flex flex-row gap-2">
      <span className="">
        <Loader2 className="animate-spin size-5 text-primary font-semibold" />
      </span>
      <span className="text-xl font-medium text-primary animate-pulse">
        ShoePedi is Loading...
      </span>
    </div>
  );
};

export default Loading;
