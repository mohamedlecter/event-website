import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

const EventForm = ({ event, onSubmit, onCancel, isSubmitting }) => {
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must not exceed 100 characters"),
    
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters"),
    
    country: Yup.string()
      .required("Country is required")
      .min(2, "Country must be at least 2 characters"),
    
    city: Yup.string()
      .required("City is required")
      .min(2, "City must be at least 2 characters"),
    
    date: Yup.date()
      .required("Date is required")
      .min(new Date(), "Event date cannot be in the past"),
    
    category: Yup.string()
      .required("Category is required")
      .oneOf(
        ["music", "sports", "art", "food", "business", "technology", "other"],
        "Invalid category selected"
      ),
    
    standardPrice: Yup.number()
      .required("Standard ticket price is required")
      .min(0, "Price must be greater than or equal to 0")
      .max(10000, "Price must not exceed 10000"),
    
    standardQuantity: Yup.number()
      .required("Standard ticket quantity is required")
      .min(1, "Quantity must be at least 1")
      .max(10000, "Quantity must not exceed 10000")
      .integer("Quantity must be a whole number"),
    
    vipPrice: Yup.number()
      .required("VIP ticket price is required")
      .min(0, "Price must be greater than or equal to 0")
      .max(10000, "Price must not exceed 10000"),
    
    vipQuantity: Yup.number()
      .required("VIP ticket quantity is required")
      .min(1, "Quantity must be at least 1")
      .max(10000, "Quantity must not exceed 10000")
      .integer("Quantity must be a whole number"),
    
    image: Yup.mixed()
      .test("fileSize", "Image size should be less than 5MB", (value) => {
        if (!value) return true; // Allow empty for edit mode
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Please upload an image file", (value) => {
        if (!value) return true; // Allow empty for edit mode
        return value.type.startsWith("image/");
      }),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
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

      // Clear image error
      setErrors(prev => ({
        ...prev,
        image: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    const eventData = {
      ...formData,
      standardPrice: Number(formData.standardPrice),
      standardQuantity: Number(formData.standardQuantity),
      vipPrice: Number(formData.vipPrice),
      vipQuantity: Number(formData.vipQuantity),
    };

    onSubmit(eventData);
  };

  const categories = [
    { value: "music", label: "Music" },
    { value: "sports", label: "Sports" },
    { value: "art", label: "Art & Culture" },
    { value: "food", label: "Food & Drink" },
    { value: "business", label: "Business" },
    { value: "technology", label: "Technology" },
    { value: "other", label: "Other" },
  ];

  const inputClassName = "w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const errorClassName = "text-red-500 text-sm mt-1";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
        {/* Basic Information */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-2">
            <div className="h-6 sm:h-8 w-1 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                  ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                  ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                  ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Describe your event"
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                  ${errors.country ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter country"
              />
              {errors.country && (
                <p className="mt-1.5 text-sm text-red-500">{errors.country}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                  ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1.5 text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                  ${errors.date ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.date && (
                <p className="mt-1.5 text-sm text-red-500">{errors.date}</p>
              )}
            </div>
          </div>
        </div>

        {/* Event Image */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-2">
            <div className="h-6 sm:h-8 w-1 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Event Image</h3>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {previewImage ? "Change Image" : "Upload Image"}
            </label>
            {errors.image && (
              <p className="mt-2 text-sm text-red-500">{errors.image}</p>
            )}
          </div>
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Preview"
                className="h-40 sm:h-48 w-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Ticket Information */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-2">
            <div className="h-6 sm:h-8 w-1 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Ticket Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Standard Tickets */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900">Standard Tickets *</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="standardPrice"
                      value={formData.standardPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-3 sm:pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                        ${errors.standardPrice ? 'border-red-500' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.standardPrice && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.standardPrice}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="standardQuantity"
                    value={formData.standardQuantity}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                      ${errors.standardQuantity ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.standardQuantity && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.standardQuantity}</p>
                  )}
                </div>
              </div>
            </div>

            {/* VIP Tickets */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900">VIP Tickets *</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="vipPrice"
                      value={formData.vipPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-3 sm:pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                        ${errors.vipPrice ? 'border-red-500' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.vipPrice && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.vipPrice}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="vipQuantity"
                    value={formData.vipQuantity}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 sm:px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base
                      ${errors.vipQuantity ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.vipQuantity && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.vipQuantity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {event ? "Updating..." : "Creating..."}
              </span>
            ) : (
              event ? "Update Event" : "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
