
import React from 'react';
import Spinner from './Spinner';

interface ResponseDisplayProps {
  response: string;
  isLoading: boolean;
  error: string | null;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
        <Spinner />
        <p className="mt-4">L'assistant IA réfléchit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
        <p className="font-bold">Erreur</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="text-center p-8 text-slate-500 dark:text-slate-400">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Bienvenue !</h3>
        <p>Posez une question sur le jardinage pour les débutants.</p>
        <p className="text-sm mt-2">Par exemple : "Comment planter des tomates cerises ?" ou "Quand faut-il arroser ses radis ?"</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-700">
       <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-400 mb-3">Réponse de l'assistant :</h3>
      <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
       {response}
      </div>
    </div>
  );
};

export default ResponseDisplay;
