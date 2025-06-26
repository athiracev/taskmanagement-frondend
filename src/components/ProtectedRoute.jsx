import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;

  if (role && user.user.role !== role) {
    return <Navigate to={`/${user.user.role}`} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
