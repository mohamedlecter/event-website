import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
    }
export default AdminRoute;
