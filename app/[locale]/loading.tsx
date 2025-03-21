const Loading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <span className="text-xl font-semibold animate-pulse text-primary">
          ShoePedi is loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
