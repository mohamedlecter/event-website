import { Link, NavLink, useNavigate } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <p>&copy; 2023 EventHub. All rights reserved.</p>
            <nav className="space-x-6">
            <NavLink to="/privacy-policy" className="hover:text-gray-400">
                Privacy Policy
            </NavLink>
            <NavLink to="/terms-of-service" className="hover:text-gray-400">
                Terms of Service
            </NavLink>
            </nav>
        </div>
        </footer>
    );
}

export default Footer;