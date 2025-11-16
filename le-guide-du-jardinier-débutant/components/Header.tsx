
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-md backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
          Le Guide du Jardinier Débutant
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Votre assistant IA pour un potager réussi
        </p>
      </div>
    </header>
  );
};

export default Header;
