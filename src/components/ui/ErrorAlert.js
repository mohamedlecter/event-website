const ErrorAlert = ({ message, className = '' }) => (
    <div className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 ${className}`}>
      <p>{message}</p>
    </div>
  );
  
  export default ErrorAlert;