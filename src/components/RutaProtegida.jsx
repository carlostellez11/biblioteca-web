import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaProtegida({ children, soloAdmin = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (soloAdmin && user.rol?.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/catalogo" replace />;
  }

  return children;
}

export default RutaProtegida;