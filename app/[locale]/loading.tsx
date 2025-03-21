const Loading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <span className="text-lg font-semibold animate-pulse">
          ShoePedi is loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
