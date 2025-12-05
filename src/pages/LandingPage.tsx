import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-3xl text-center text-white max-w-4xl w-full shadow-2xl">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          Project Mockups
        </h1>
        <p className="text-slate-300 mb-12 text-lg">
          Selecteer een applicatie om de high-fidelity mockups te bekijken.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/cockpit"
            className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:border-white/30 transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
            <div className="text-2xl font-bold">Planningscockpit</div>
            <div className="text-sm text-slate-400">
              Webgebaseerde planningstool voor Managers & Werknemers. Dashboard, Taken en KPI's.
            </div>
          </Link>

          <Link
            to="/backoffice"
            className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:border-white/30 transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
            <div className="text-2xl font-bold">Back-office App</div>
            <div className="text-sm text-slate-400">
              Java-stijl Beheer Applicatie. Master Data Beheer voor Fabrieken, Werknemers en Taken.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
