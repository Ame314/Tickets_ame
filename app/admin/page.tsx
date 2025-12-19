"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Estadisticas {
  total_tickets: number;
  tickets_abiertos: number;
  tickets_en_proceso: number;
  tickets_resueltos: number;
  tickets_cerrados: number;
  tickets_por_prioridad: Record<string, number>;
}

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
  total_interacciones: number;
}

interface Usuario {
  usuario_id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  creado_en: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [vistaActual, setVistaActual] = useState<"dashboard" | "tickets" | "usuarios">("dashboard");
  const [loading, setLoading] = useState(true);

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
    
    if (user.rol !== "admin") {
      router.push("/dashboard");
      return;
    }

    cargarDatos(token);
  };

  const cargarDatos = async (token: string) => {
    try {
      // Cargar estadísticas
      const resStats = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estadisticas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resStats.ok) {
        const stats = await resStats.json();
        setEstadisticas(stats);
      }

      // Cargar tickets
      const resTickets = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resTickets.ok) {
        const ticketsData = await resTickets.json();
        setTickets(ticketsData);
      }

      // Cargar usuarios
      const resUsuarios = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resUsuarios.ok) {
        const usuariosData = await resUsuarios.json();
        setUsuarios(usuariosData);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const getEstadoBadge = (estado: string) => {
    const colores: Record<string, string> = {
      abierto: "bg-blue-500/20 text-blue-400",
      en_proceso: "bg-yellow-500/20 text-yellow-400",
      resuelto: "bg-green-500/20 text-green-400",
      cerrado: "bg-gray-500/20 text-gray-400",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando panel de administración...</div>
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
              <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
              <p className="text-slate-400 text-sm">Sistema de gestión de tickets</p>
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

      <div className="container mx-auto px-6 py-8">
        {/* Navegación */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setVistaActual("dashboard")}
            className={`px-6 py-3 rounded-lg transition font-semibold ${
              vistaActual === "dashboard"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setVistaActual("tickets")}
            className={`px-6 py-3 rounded-lg transition font-semibold ${
              vistaActual === "tickets"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            🎫 Tickets
          </button>
          <button
            onClick={() => setVistaActual("usuarios")}
            className={`px-6 py-3 rounded-lg transition font-semibold ${
              vistaActual === "usuarios"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            👥 Usuarios
          </button>
        </div>

        {/* Dashboard */}
        {vistaActual === "dashboard" && estadisticas && (
          <div className="space-y-6">
            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">{estadisticas.total_tickets}</div>
                <div className="text-purple-100">Total Tickets</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">{estadisticas.tickets_abiertos}</div>
                <div className="text-blue-100">Abiertos</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">{estadisticas.tickets_en_proceso}</div>
                <div className="text-yellow-100">En Proceso</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">{estadisticas.tickets_resueltos}</div>
                <div className="text-green-100">Resueltos</div>
              </div>
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">{estadisticas.tickets_cerrados}</div>
                <div className="text-gray-100">Cerrados</div>
              </div>
            </div>

            {/* Tickets por prioridad */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Tickets por Prioridad</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(estadisticas.tickets_por_prioridad).map(([prioridad, cantidad]) => (
                  <div key={prioridad} className={`${getPrioridadBadge(prioridad)} rounded-lg p-4`}>
                    <div className="text-2xl font-bold mb-1">{cantidad}</div>
                    <div className="text-sm capitalize">{prioridad}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usuarios activos */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Resumen de Usuarios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-500/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-400 mb-1">{usuarios.length}</div>
                  <div className="text-sm text-slate-300">Total Usuarios</div>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {usuarios.filter(u => u.activo).length}
                  </div>
                  <div className="text-sm text-slate-300">Usuarios Activos</div>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {usuarios.filter(u => u.rol === "admin").length}
                  </div>
                  <div className="text-sm text-slate-300">Administradores</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Tickets */}
        {vistaActual === "tickets" && (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
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
                    <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                      {ticket.descripcion}
                    </p>
                    <div className="flex gap-3 text-sm text-slate-400">
                      <span>👤 {ticket.nombre_usuario}</span>
                      {ticket.asignado_nombre && (
                        <span>👨‍💼 Asignado: {ticket.asignado_nombre}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(ticket.estado)}`}>
                      {ticket.estado.replace("_", " ")}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadBadge(ticket.prioridad)}`}>
                      {ticket.prioridad}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-400 pt-3 border-t border-slate-700">
                  <div className="flex gap-4">
                    {ticket.categoria && <span>📁 {ticket.categoria}</span>}
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
            ))}
          </div>
        )}

        {/* Lista de Usuarios */}
        {vistaActual === "usuarios" && (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left px-6 py-4 text-slate-300 font-semibold">ID</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-semibold">Nombre</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-semibold">Rol</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-semibold">Estado</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-semibold">Registrado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.usuario_id} className="border-t border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 text-slate-300">{usuario.usuario_id}</td>
                    <td className="px-6 py-4 text-white font-medium">{usuario.nombre}</td>
                    <td className="px-6 py-4 text-slate-400">{usuario.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.rol === "admin" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.activo 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(usuario.creado_en).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}