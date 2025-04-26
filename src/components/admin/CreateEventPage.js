import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";

const CreateEventPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (eventData) => {
    try {
      setIsSubmitting(true);
      await createEvent(eventData);
      navigate("/admin/events"); // Redirect back to event list
    } catch (err) {
      console.error(err.message);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/events");
  };

  return (
    <>
      {isSubmitting ? (
        <div className="flex justify-center items-center h-screen">
          <p>Creating event...</p>
        </div>
      ) : (
        <EventForm onSubmit={handleCreate} onCancel={handleCancel} />
      )}
    </>
  );
};

export default CreateEventPage;
