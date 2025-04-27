import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    country: event?.location?.country || "",
    city: event?.location?.city || "",
    standardPrice: event?.standardTicket?.price || 0,
    standardQuantity: event?.standardTicket?.quantity || 0,
    vipPrice: event?.vipTicket?.price || 0,
    vipQuantity: event?.vipTicket?.quantity || 0,
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
    category: event?.category || "music",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(event?.image || null);
  const [dateError, setDateError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check if the new date is in the past
    if (name === "date") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set today's time to 00:00:00 for comparison

      if (selectedDate < today) {
        setDateError("Event date cannot be in the past.");
      } else {
        setDateError("");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent submission if there's a date error
    if (dateError) {
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      country: formData.country,
      city: formData.city,
      standardPrice: Number(formData.standardPrice),
      standardQuantity: Number(formData.standardQuantity),
      vipPrice: Number(formData.vipPrice),
      vipQuantity: Number(formData.vipQuantity),
      date: formData.date,
      category: formData.category,
      image: formData.image,
    };

    onSubmit(eventData);
  };

  const categories = [
    "music",
    "sports",
    "art",
    "food",
    "business",
    "technology",
    "other",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {event ? "Edit Event" : "Create New Event"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Date & Time</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
                {dateError && (
                  <div className="text-red-500 text-sm mt-2">{dateError}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-40 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Standard Tickets</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="standardPrice"
                      value={formData.standardPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="standardQuantity"
                      value={formData.standardQuantity}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">VIP Tickets</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="vipPrice"
                      value={formData.vipPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="vipQuantity"
                      value={formData.vipQuantity}
                      onChange={handleChange}
                      min="0"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {event ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
