import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";
import { FiLock, FiMail, FiPhone, FiUser, FiUserPlus } from "react-icons/fi";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    mobileNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1"); // default to US or any code you want

  // Fetch country codes on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd"
        );
        const data = await res.json();
        const valid = data
          .filter(
            (c) =>
              c.idd &&
              c.idd.root &&
              typeof c.idd.root === "string" &&
              c.idd.root.length > 0
          )
          .map((c) => ({
            name: c.name.common,
            code:
              c.idd.suffixes && c.idd.suffixes.length > 0
                ? `${c.idd.root}${c.idd.suffixes[0]}`
                : c.idd.root,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(valid);

        // Set Gambia as default if present, else first country
        const gambia = valid.find(
          (c) => c.name === "Gambia" && c.code === "+220"
        );
        setSelectedCountryCode(gambia ? gambia.code : valid[0]?.code || "+1");
      } catch (err) {
        console.error("Failed to fetch country codes", err);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await register({
        ...userData,
        mobileNumber: selectedCountryCode + userData.mobileNumber.trim(),
      });
      if (result.success) {
        navigate("/events");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C6D6D8C2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us to start booking events
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={userData.name}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>

            {/* Country code and mobile number */}
            <div className="flex">
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="rounded-l-lg block px-3 py-2.5 border border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] sm:text-sm"
                style={{ minWidth: 110 }}
                required
              >
                {countries.map((country) => (
                  <option
                    key={`${country.code}-${country.name}`}
                    value={country.code}
                  >
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                autoComplete="tel"
                required
                value={userData.mobileNumber}
                onChange={handleChange}
                className="appearance-none rounded-r-lg relative block w-full px-3 py-2.5 border border-gray-300 border-l-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] focus:z-10 sm:text-sm"
                placeholder="Mobile Number"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={userData.email}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={userData.password}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-[#FBA415] hover:bg-[#FBA415]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FBA415] transition-colors duration-200"
            >
              {isSubmitting ? (
                <LoadingSpinner small />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FiUserPlus className="h-5 w-5 text-gray-900 group-hover:text-gray-900" />
                  </span>
                  Register
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#FBA415] hover:text-[#FBA415]/80"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
