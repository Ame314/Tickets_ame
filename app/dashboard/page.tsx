"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  usuario_id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface Ticket {
  ticket_id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  categoria: string;
  creado_en: string;
  total_interacciones: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarNuevoTicket, setMostrarNuevoTicket] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  
  // Formulario nuevo ticket
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    verificarAutenticacion();
  }, []);

  const verificarAutenticacion = () => {
    const token = localStorage.getItem("token");
    const usuarioData = localStorage.getItem("usuario");

    if (!token || !usuarioData) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(usuarioData);
    
    if (user.rol === "admin") {
      router.push("/admin");
      return;
    }

    setUsuario(user);
    cargarTickets(token);
  };

  const cargarTickets = async (token: string, estado?: string) => {
    try {
      const url = estado && estado !== "todos" 
        ? `${process.env.NEXT_PUBLIC_API_URL}/tickets?estado=${estado}`
        : `${process.env.NEXT_PUBLIC_API_URL}/tickets`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Error al cargar tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const crearTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          prioridad,
          categoria: categoria || null,
        }),
      });

      if (res.ok) {
        setMostrarNuevoTicket(false);
        setTitulo("");
        setDescripcion("");
        setPrioridad("media");
        setCategoria("");
        cargarTickets(token!);
      }
    } catch (error) {
      console.error("Error al crear ticket:", error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const getEstadoBadge = (estado: string) => {
    const colores: Record<string, string> = {
      abierto: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      en_proceso: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      resuelto: "bg-green-500/20 text-green-400 border-green-500/50",
      cerrado: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    };
    return colores[estado] || colores.abierto;
  };

  const getPrioridadBadge = (prioridad: string) => {
    const colores: Record<string, string> = {
      urgente: "bg-red-500/20 text-red-400",
      alta: "bg-orange-500/20 text-orange-400",
      media: "bg-blue-500/20 text-blue-400",
      baja: "bg-gray-500/20 text-gray-400",
    };
    return colores[prioridad] || colores.media;
  };

  const filtrarTickets = (estado: string) => {
    setFiltroEstado(estado);
    const token = localStorage.getItem("token");
    if (token) {
      cargarTickets(token, estado !== "todos" ? estado : undefined);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
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
              <h1 className="text-2xl font-bold text-white">Mis Tickets</h1>
              <p className="text-slate-400 text-sm">Bienvenido, {usuario?.nombre}</p>
            </div>
            <button
              onClick={cerrarSesion}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition border border-red-500/50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Acciones y Filtros */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => filtrarTickets("todos")}
              className={`px-4 py-2 rounded-lg transition ${
                filtroEstado === "todos"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => filtrarTickets("abierto")}
              className={`px-4 py-2 rounded-lg transition ${
                filtroEstado === "abierto"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Abiertos
            </button>
            <button
              onClick={() => filtrarTickets("en_proceso")}
              className={`px-4 py-2 rounded-lg transition ${
                filtroEstado === "en_proceso"
                  ? "bg-yellow-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              En Proceso
            </button>
            <button
              onClick={() => filtrarTickets("resuelto")}
              className={`px-4 py-2 rounded-lg transition ${
                filtroEstado === "resuelto"
                  ? "bg-green-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Resueltos
            </button>
          </div>

          <button
            onClick={() => setMostrarNuevoTicket(!mostrarNuevoTicket)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition font-semibold"
          >
            + Nuevo Ticket
          </button>
        </div>

        {/* Formulario Nuevo Ticket */}
        {mostrarNuevoTicket && (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 mb-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Crear Nuevo Ticket</h2>
            <form onSubmit={crearTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripción
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prioridad
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value)}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Categoría (opcional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  Crear Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarNuevoTicket(false)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Tickets */}
        <div className="grid gap-4">
          {tickets.length === 0 ? (
            <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
              <p className="text-slate-400 text-lg">No hay tickets para mostrar</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition cursor-pointer"
                onClick={() => router.push(`/tickets/${ticket.ticket_id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      #{ticket.ticket_id} - {ticket.titulo}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {ticket.descripcion}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(ticket.estado)}`}>
                      {ticket.estado.replace("_", " ")}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadBadge(ticket.prioridad)}`}>
                      {ticket.prioridad}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-400">
                  <div className="flex gap-4">
                    {ticket.categoria && (
                      <span>📁 {ticket.categoria}</span>
                    )}
                    <span>💬 {ticket.total_interacciones} comentarios</span>
                  </div>
                  <span>
                    {new Date(ticket.creado_en).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}