import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

// Wrap any admin-only page in this: <AdminRoute><AddTrain /></AdminRoute>
// - Not logged in at all -> bounce to /login
// - Logged in but not an admin -> bounce to /dashboard (no error page needed,
//   since a regular user hitting this by accident should just land somewhere normal)
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
