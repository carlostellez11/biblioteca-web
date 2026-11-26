import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Catalogo from "./pages/Catalogo";
import SolicitudPrestamo from "./pages/SolicitudPrestamo";
import MisPrestamos from "./pages/MisPrestamos";
import Admin from "./pages/Admin";
import AdminLibros from "./pages/AdminLibros";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminPrestamos from "./pages/AdminPrestamos";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Registro />} />

        <Route
          path="/catalogo"
          element={
            <RutaProtegida>
              <Catalogo />
            </RutaProtegida>
          }
        />

        <Route
          path="/solicitud-prestamo"
          element={
            <RutaProtegida>
              <SolicitudPrestamo />
            </RutaProtegida>
          }
        />

        <Route
          path="/mis-prestamos"
          element={
            <RutaProtegida>
              <MisPrestamos />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin"
          element={
            <RutaProtegida soloAdmin>
              <Admin />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/libros"
          element={
            <RutaProtegida soloAdmin>
              <AdminLibros />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <RutaProtegida soloAdmin>
              <AdminUsuarios />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/prestamos"
          element={
            <RutaProtegida soloAdmin>
              <AdminPrestamos />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
