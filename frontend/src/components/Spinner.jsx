const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      {/* Tailwind spinner animation */}
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 font-medium">{message}</p>
    </div>
  );
};

export default Spinner;
