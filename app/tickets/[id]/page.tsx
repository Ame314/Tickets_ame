"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Ticket {
  ticket_id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  categoria: string;
  nombre_usuario: string;
  asignado_nombre: string;
  creado_en: string;
  actualizado_en: string;
}

interface Interaccion {
  interaccion_id: number;
  usuario_id: number;
  mensaje: string;
  es_interno: boolean;
  creado_en: string;
  nombre_usuario: string;
}

interface Usuario {
  usuario_id: number;
  rol: string;
}

export default function TicketDetallePage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [interacciones, setInteracciones] = useState<Interaccion[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [esInterno, setEsInterno] = useState(false);
  
  // Estados para edición
  const [editando, setEditando] = useState(false);
  const [estadoEdit, setEstadoEdit] = useState("");
  const [prioridadEdit, setPrioridadEdit] = useState("");

  useEffect(() => {
    verificarAutenticacion();
  }, [ticketId]);

  const verificarAutenticacion = () => {
    const token = localStorage.getItem("token");
    const usuarioData = localStorage.getItem("usuario");

    if (!token || !usuarioData) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(usuarioData);
    setUsuario(user);
    cargarTicket(token);
  };

  const cargarTicket = async (token: string) => {
    try {
      const resTicket = await fetch(`http://localhost:8000/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resTicket.ok) {
        const ticketData = await resTicket.json();
        setTicket(ticketData);
        setEstadoEdit(ticketData.estado);
        setPrioridadEdit(ticketData.prioridad);
      }

      const resInteracciones = await fetch(`http://localhost:8000/tickets/${ticketId}/interacciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resInteracciones.ok) {
        const interaccionesData = await resInteracciones.json();
        setInteracciones(interaccionesData);
      }
    } catch (error) {
      console.error("Error al cargar ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/interacciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mensaje: nuevoComentario,
          es_interno: esInterno,
        }),
      });

      if (res.ok) {
        setNuevoComentario("");
        setEsInterno(false);
        cargarTicket(token!);
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const actualizarTicket = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          estado: estadoEdit,
          prioridad: prioridadEdit,
        }),
      });

      if (res.ok) {
        setEditando(false);
        cargarTicket(token!);
      }
    } catch (error) {
      console.error("Error al actualizar ticket:", error);
    }
  };

  const volver = () => {
    if (usuario?.rol === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colores: Record<string, string> = {
      abierto: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      en_proceso: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      resuelto: "bg-green-500/20 text-green-400 border-green-500/50",
      cerrado: "bg-gray-500/20 text-gray-400 border-gray-500/50",
      cancelado: "bg-red-500/20 text-red-400 border-red-500/50",
    };
    return colores[estado] || colores.abierto;
  };

  const getPrioridadBadge = (prioridad: string) => {
    const colores: Record<string, string> = {
      urgente: "bg-red-500/20 text-red-400 border-red-500/50",
      alta: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      media: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      baja: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    };
    return colores[prioridad] || colores.media;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando ticket...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Ticket no encontrado</div>
          <button
            onClick={volver}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={volver}
                className="text-purple-400 hover:text-purple-300 mb-2 flex items-center gap-2"
              >
                ← Volver
              </button>
              <h1 className="text-2xl font-bold text-white">
                Ticket #{ticket.ticket_id}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Información del Ticket */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 mb-6 border border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{ticket.titulo}</h2>
            <div className="flex gap-2">
              {!editando ? (
                <>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getEstadoBadge(ticket.estado)}`}>
                    {ticket.estado.replace("_", " ").toUpperCase()}
                  </span>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getPrioridadBadge(ticket.prioridad)}`}>
                    {ticket.prioridad.toUpperCase()}
                  </span>
                  {usuario?.rol === "admin" && (
                    <button
                      onClick={() => setEditando(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm"
                    >
                      Editar
                    </button>
                  )}
                </>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={estadoEdit}
                    onChange={(e) => setEstadoEdit(e.target.value)}
                    className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm border border-slate-600"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <select
                    value={prioridadEdit}
                    onChange={(e) => setPrioridadEdit(e.target.value)}
                    className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm border border-slate-600"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                  <button
                    onClick={actualizarTicket}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditando(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-300 mb-4 whitespace-pre-line">{ticket.descripcion}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700 text-sm">
            <div>
              <div className="text-slate-400">Creado por</div>
              <div className="text-white font-medium">{ticket.nombre_usuario}</div>
            </div>
            {ticket.asignado_nombre && (
              <div>
                <div className="text-slate-400">Asignado a</div>
                <div className="text-white font-medium">{ticket.asignado_nombre}</div>
              </div>
            )}
            {ticket.categoria && (
              <div>
                <div className="text-slate-400">Categoría</div>
                <div className="text-white font-medium">{ticket.categoria}</div>
              </div>
            )}
            <div>
              <div className="text-slate-400">Creado</div>
              <div className="text-white font-medium">
                {new Date(ticket.creado_en).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">
            Comentarios ({interacciones.length})
          </h3>

          {/* Lista de comentarios */}
          <div className="space-y-4 mb-6">
            {interacciones.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No hay comentarios aún</p>
            ) : (
              interacciones.map((interaccion) => (
                <div
                  key={interaccion.interaccion_id}
                  className={`p-4 rounded-lg ${
                    interaccion.es_interno
                      ? "bg-yellow-500/10 border border-yellow-500/30"
                      : "bg-slate-700/50 border border-slate-600"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {interaccion.nombre_usuario}
                      </span>
                      {interaccion.es_interno && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                          INTERNO
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-sm">
                      {new Date(interaccion.creado_en).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-line">{interaccion.mensaje}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulario nuevo comentario */}
          <form onSubmit={agregarComentario} className="space-y-4">
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Escribe tu comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
            />
            
            <div className="flex justify-between items-center">
              {usuario?.rol === "admin" && (
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={esInterno}
                    onChange={(e) => setEsInterno(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700"
                  />
                  <span className="text-sm">Nota interna (solo visible para admins)</span>
                </label>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition font-semibold"
              >
                Agregar Comentario
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

