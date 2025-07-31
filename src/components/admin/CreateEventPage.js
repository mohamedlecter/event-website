import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createEvent} from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";

const CreateEventPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreate = async (eventData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createEvent(eventData);
      navigate("/admin/events"); // Redirect back to event list
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/events");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        </div>

        {error && (
          <ErrorAlert
            message={error}
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}

        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Creating your event...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <EventForm 
              onSubmit={handleCreate} 
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventPage;
