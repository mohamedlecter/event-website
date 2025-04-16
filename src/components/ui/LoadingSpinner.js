const LoadingSpinner = ({ small = false }) => (
    <div className={`flex justify-center items-center ${small ? 'py-1' : 'py-8'}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${small ? 'h-5 w-5' : 'h-12 w-12'}`}></div>
    </div>
  );
  
  export default LoadingSpinner;