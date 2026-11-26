
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./AdminPrestamos.css";

function AdminPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [filtro, setFiltro] = useState("");
  const [procesando, setProcesando] = useState(null);

  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [observaciones, setObservaciones] = useState(
    "Entregado en buen estado"
  );

  const navigate = useNavigate();

  async function cargarPrestamos() {
    setLoading(true);
    setError("");

    try {
      const endpoint = filtro
        ? `/api/loans/books?estatus=${filtro}`
        : "/api/loans/books";

      const data = await apiRequest(endpoint);
      setPrestamos(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPrestamos();
  }, [filtro]);

  function abrirModal(prestamo) {
    setPrestamoSeleccionado(prestamo);
    setObservaciones("Entregado en buen estado");
    setMensaje("");
  }

  function cerrarModal() {
    if (procesando !== null) return;

    setPrestamoSeleccionado(null);
    setObservaciones("Entregado en buen estado");
  }

  async function confirmarDevolucion(event) {
    event.preventDefault();

    if (!prestamoSeleccionado) return;

    const id = prestamoSeleccionado.loanId;

    setProcesando(id);
    setMensaje("");

    try {
      await apiRequest(`/api/loans/books/${id}/return`, {
        method: "PATCH",
        body: { observaciones },
      });

      setPrestamoSeleccionado(null);
      setMensaje("Devolución registrada correctamente.");

      await cargarPrestamos();
    } catch (err) {
      setMensaje(err.message || "No se pudo registrar la devolución.");
    } finally {
      setProcesando(null);
    }
  }

  return (
    <main>
      <header className="admin-usuarios-header">
        <div>
          <h1>Gestión de préstamos</h1>
          <p>Consulta los préstamos y registra las devoluciones.</p>
        </div>

        <button
          className="admin-usuarios-boton"
          onClick={() => navigate("/admin")}
        >
          Volver al panel
        </button>
      </header>

      <section className="admin-prestamos-filtro">
        <label htmlFor="filtro-estatus">Filtrar préstamos:</label>

        <select
          id="filtro-estatus"
          value={filtro}
          onChange={(event) => setFiltro(event.target.value)}
        >
          <option value="">Todos los préstamos</option>
          <option value="PRESTADO">Prestados</option>
          <option value="DEVUELTO">Devueltos</option>
        </select>
      </section>

      {mensaje && (
        <p className="admin-usuarios-mensaje">{mensaje}</p>
      )}

      {loading && <p>Cargando préstamos...</p>}

      {error && (
        <p className="admin-usuarios-mensaje">{error}</p>
      )}

      {!loading && !error && (
        <section>
          <h2>Préstamos encontrados ({prestamos.length})</h2>

          {prestamos.length === 0 ? (
            <p className="admin-usuarios-mensaje">
              No hay préstamos para mostrar.
            </p>
          ) : (
            <div className="admin-usuarios-grid">
              {prestamos.map((prestamo) => (
                <article
                  className="admin-usuario-card"
                  key={prestamo.loanId}
                >
                  <h3>{prestamo.libro}</h3>

                  <p><strong>Préstamo:</strong> #{prestamo.loanId}</p>
                  <p><strong>Autor:</strong> {prestamo.autor}</p>
                  <p><strong>ISBN:</strong> {prestamo.isbn}</p>
                  <p><strong>Usuario:</strong> {prestamo.usuario}</p>
                  <p><strong>Matrícula:</strong> {prestamo.matricula}</p>
                  <p><strong>Estado:</strong> {prestamo.estatus}</p>

                  <p>
                    <strong>Fecha de préstamo:</strong>{" "}
                    {prestamo.fechaPrestamo || "No disponible"}
                  </p>

                  <p>
                    <strong>Devolución estimada:</strong>{" "}
                    {prestamo.fechaDevolucionEstimada || "No disponible"}
                  </p>

                  <p>
                    <strong>Devolución real:</strong>{" "}
                    {prestamo.fechaDevolucionReal || "Pendiente"}
                  </p>

                  <p>
                    <strong>Vencido:</strong>{" "}
                    {prestamo.vencido ? "Sí" : "No"}
                  </p>

                  <p>
                    <strong>Observaciones:</strong>{" "}
                    {prestamo.observaciones || "Sin observaciones"}
                  </p>

                  {prestamo.estatus === "PRESTADO" && (
                    <button
                      className="admin-usuarios-boton"
                      onClick={() => abrirModal(prestamo)}
                    >
                      Registrar devolución
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {prestamoSeleccionado && (
        <div className="admin-prestamos-modal-fondo">
          <form
            className="admin-prestamos-modal"
            onSubmit={confirmarDevolucion}
          >
            <h2>Registrar devolución</h2>

            <p>
              Estás registrando la devolución del libro:
            </p>

            <p>
              <strong>{prestamoSeleccionado.libro}</strong>
            </p>

            <p>
              <strong>Usuario:</strong>{" "}
              {prestamoSeleccionado.usuario}
            </p>

            <label htmlFor="observaciones">
              Observaciones de la devolución:
            </label>

            <textarea
              id="observaciones"
              value={observaciones}
              onChange={(event) => setObservaciones(event.target.value)}
              placeholder="Escribe las observaciones..."
              rows="4"
            />

            <div className="admin-prestamos-modal-botones">
              <button
                type="button"
                className="admin-prestamos-cancelar"
                onClick={cerrarModal}
                disabled={procesando !== null}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-usuarios-boton"
                disabled={procesando !== null}
              >
                {procesando !== null
                  ? "Registrando..."
                  : "Confirmar devolución"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default AdminPrestamos;
