import { Navigate } from 'react-router-dom';
import { getUserFromLocalStorage } from '../../asset/AuthContext';

const PrivateRoute = ({ children }) => {
  const  user  = getUserFromLocalStorage();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
