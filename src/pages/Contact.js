import React, {useState} from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend or email service
    setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Contact Us</h1>
        <p className="text-gray-600 mb-8 text-center">Have a question, suggestion, or partnership idea? Fill out the form below or reach us directly!</p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition"
              disabled={submitted}
            >
              {submitted ? "Message Sent!" : "Send Message"}
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6 text-gray-700">
            <div>
              <span className="font-semibold">Email:</span> contact@e-tickets.online
            </div>
            <div>
              <span className="font-semibold">Phone:</span> +220 736 0361
            </div>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-yellow-500" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
