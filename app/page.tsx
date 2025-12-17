"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si ya hay sesión activa
    const token = localStorage.getItem("token");
    const usuarioData = localStorage.getItem("usuario");

    if (token && usuarioData) {
      const usuario = JSON.parse(usuarioData);
      // Redirigir según el rol
      if (usuario.rol === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/50">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Sistema de
            <span className="block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Gestión de Tickets
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Plataforma completa para la gestión de soporte técnico con panel de
            administración y seguimiento en tiempo real
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 backdrop-blur-lg hover:bg-slate-700/50 text-white font-semibold rounded-xl transition duration-200 border border-slate-700 hover:border-purple-500/50"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>

        {/* Características */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Gestión Eficiente
            </h3>
            <p className="text-slate-400">
              Crea, asigna y da seguimiento a tickets de soporte con facilidad
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Roles y Permisos
            </h3>
            <p className="text-slate-400">
              Sistema de roles para administradores y usuarios con permisos
              específicos
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Reportes en Tiempo Real
            </h3>
            <p className="text-slate-400">
              Estadísticas y métricas actualizadas para mejor toma de decisiones
            </p>
          </div>
        </div>

        {/* Features adicionales */}
        <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Características del Sistema
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "🎫 Gestión completa de tickets",
              "💬 Sistema de comentarios",
              "🔔 Notificaciones en tiempo real",
              "📊 Dashboard con estadísticas",
              "🔒 Autenticación segura JWT",
              "👥 Gestión de usuarios",
              "📈 Priorización de tickets",
              "🏷️ Categorización personalizada",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-slate-300"
              >
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50">
            <p className="text-slate-400 mb-4">
              ¿Necesitas probar el sistema? Usa estas credenciales:
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <p className="text-purple-400 font-semibold mb-2">
                  👤 Usuario Demo
                </p>
                <p className="text-sm text-slate-300">user@demo.com</p>
                <p className="text-sm text-slate-400">User123!</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <p className="text-indigo-400 font-semibold mb-2">
                  👨‍💼 Administrador
                </p>
                <p className="text-sm text-slate-300">admin@soporte.com</p>
                <p className="text-sm text-slate-400">Admin123!</p>
              </div>
            </div>
          </div>

          <p className="text-slate-500 text-sm mt-8">
            Sistema de Gestión de Tickets © 2025 - Arquitectura de Datos
          </p>
        </div>
      </div>
    </div>
  );
}