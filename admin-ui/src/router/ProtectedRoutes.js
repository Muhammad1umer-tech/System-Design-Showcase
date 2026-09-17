import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, permissions }) => {
  const isAuthenticated = useSelector(state => state.counter.isAuthenticated);
  const userPermissions = useSelector(state => state.counter.userPermissions);
  console.log(isAuthenticated, userPermissions)
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (permissions && permissions.length > 0 && !permissions.some(permission => userPermissions.includes(permission))) {
    return <Navigate to="/error" />;
  }

  return<div style={{paddingRight:'30px',paddingLeft:'30px',paddingTop:'100px'}}>{element}</div> 
};

export default ProtectedRoute;
