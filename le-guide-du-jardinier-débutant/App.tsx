import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { getPlantDetails } from './services/geminiService';
import { SEASONAL_SUGGESTIONS, Plant, ALL_PLANTS } from './constants';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';


type View = 'home' | 'knowledgeBase' | 'seasonal' | 'community' | 'plantDetail';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// --- Icon Components ---
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// --- Button to go back ---
const BackButton: React.FC<{onClick: () => void; text: string;}> = ({onClick, text}) => (
    <button 
        onClick={onClick}
        className="mb-6 flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {text}
    </button>
);

// --- Home View Component ---
const HomeView: React.FC<{ onNavigate: (view: View) => void; }> = ({ onNavigate }) => (
    <div className="text-center py-10 px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">Bienvenue sur votre guide potager</h2>
        <p className="max-w-2xl mx-auto mb-12 text-slate-600 dark:text-slate-300">Choisissez une section pour commencer votre aventure de jardinage.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div onClick={() => onNavigate('seasonal')} className="p-6 bg-green-600/80 backdrop-blur-sm rounded-xl shadow-lg text-white hover:bg-green-700/90 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-center items-center h-20 w-20 rounded-full bg-black/20 mx-auto mb-4"><CalendarIcon /></div>
                <h3 className="text-xl font-bold mb-2">Suggestions par Saison</h3>
                <p className="text-green-100 text-sm opacity-90">Découvrez quoi planter en fonction de la saison.</p>
            </div>
            <div onClick={() => onNavigate('knowledgeBase')} className="p-6 bg-primary-600/80 backdrop-blur-sm rounded-xl shadow-lg text-white hover:bg-primary-700/90 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-center items-center h-20 w-20 rounded-full bg-black/20 mx-auto mb-4"><BookOpenIcon /></div>
                <h3 className="text-xl font-bold mb-2">Encyclopédie des Plantes</h3>
                <p className="text-primary-100 text-sm opacity-90">Explorez notre base de données de plantes.</p>
            </div>
            <div onClick={() => onNavigate('community')} className="p-6 bg-amber-600/80 backdrop-blur-sm rounded-xl shadow-lg text-white hover:bg-amber-700/90 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-center items-center h-20 w-20 rounded-full bg-black/20 mx-auto mb-4"><UsersIcon /></div>
                <h3 className="text-xl font-bold mb-2">Communauté des Jardiniers</h3>
                <p className="text-amber-100 text-sm opacity-90">Partagez vos photos et échangez avec d'autres passionnés.</p>
            </div>
        </div>
    </div>
);

// --- Plant Card Component ---
const PlantCard: React.FC<{ plant: Plant; onClick: () => void }> = ({ plant, onClick }) => (
  <div onClick={onClick} className="bg-white dark:bg-slate-700/50 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 flex items-start space-x-4 cursor-pointer hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-200 transform hover:scale-105">
    <span className="text-3xl pt-1">{plant.emoji}</span>
    <div>
      <h4 className="font-bold text-slate-800 dark:text-slate-100">{plant.name}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-300">{plant.description}</p>
    </div>
  </div>
);

// --- Knowledge Base View Component ---
const KnowledgeBaseView: React.FC<{ onNavigateToDetail: (plant: Plant) => void, onGoBack: () => void }> = ({ onNavigateToDetail, onGoBack }) => (
    <div className="w-full max-w-6xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <BackButton onClick={onGoBack} text="Retour à l'accueil" />
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Encyclopédie des Plantes</h2>
            <p className="text-slate-600 dark:text-slate-300">Cliquez sur une plante pour obtenir un guide de culture détaillé par notre IA.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {ALL_PLANTS.map((plant) => (
                <PlantCard key={plant.name} plant={plant} onClick={() => onNavigateToDetail(plant)} />
            ))}
        </div>
    </div>
);

// --- Seasonal View Component ---
const SeasonalView: React.FC<{ onNavigateToDetail: (plant: Plant) => void, onGoBack: () => void }> = ({ onNavigateToDetail, onGoBack }) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const seasons: { id: Season; name: string; image: string }[] = [
    { id: 'spring', name: 'Printemps', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070&auto=format&fit=crop' },
    { id: 'summer', name: 'Été', image: 'https://images.unsplash.com/photo-1470240731273-7821a6e23582?q=80&w=2070&auto=format&fit=crop' },
    { id: 'autumn', name: 'Automne', image: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2070&auto=format&fit=crop' },
    { id: 'winter', name: 'Hiver', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=2128&auto=format&fit=crop' },
  ];
  const getTypeColor = (type: Plant['type']) => (
    {'Légume': 'bg-green-200 text-green-800', 'Fleur': 'bg-pink-200 text-pink-800', 'Fruit': 'bg-red-200 text-red-800'}[type] || 'bg-slate-200 text-slate-800'
  );

  return (
    <div className="w-full max-w-6xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <BackButton onClick={onGoBack} text="Retour à l'accueil" />
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Suggestions par Saison</h2>
            <p className="text-slate-600 dark:text-slate-300">Cliquez sur une saison pour découvrir les plantes à cultiver.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {seasons.map((season) => (
                <div key={season.id} onClick={() => setSelectedSeason(season.id)} className={`relative h-24 rounded-lg text-white cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md overflow-hidden ${selectedSeason === season.id ? 'ring-4 ring-offset-2 ring-primary-500 dark:ring-offset-slate-800' : ''}`}>
                    <img src={season.image} alt={season.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="font-bold text-xl">{season.name}</span>
                    </div>
                </div>
            ))}
        </div>
        {selectedSeason && (
            <div className="animate-fade-in">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center capitalize">À planter en {seasons.find(s => s.id === selectedSeason)?.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {SEASONAL_SUGGESTIONS[selectedSeason].map((plant) => (
                        <PlantCard key={plant.name} plant={plant} onClick={() => onNavigateToDetail(plant)} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

// --- Plant Detail View Component ---
const PlantDetailView: React.FC<{ plant: Plant, onGoBack: () => void }> = ({ plant, onGoBack }) => {
    const [details, setDetails] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getPlantDetails(plant.name);
                setDetails(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [plant]);

    return (
        <div className="w-full max-w-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
            <BackButton onClick={onGoBack} text="Retour" />
            <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                    <span className="text-5xl mr-4">{plant.emoji}</span>{plant.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">Guide de culture pour débutant</p>
            </div>

            {isLoading && <div className="flex justify-center p-8"><Spinner /></div>}
            {error && <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert"><p className="font-bold">Erreur</p><p>{error}</p></div>}
            {details && <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(details) }}></div>}
        </div>
    );
};


// --- Placeholder Community View ---
const CommunityView: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => (
    <div className="w-full max-w-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <BackButton onClick={onGoBack} text="Retour à l'accueil" />
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Communauté des Jardiniers</h2>
            <p className="text-slate-600 dark:text-slate-300">Cette section est en cours de construction.</p>
        </div>
    </div>
);

// --- Main App Component ---
const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [previousView, setPreviousView] = useState<View>('home');

    const handleNavigate = (newView: View) => {
        setPreviousView(view);
        setView(newView);
    };

    const handleSelectPlant = (plant: Plant) => {
        setPreviousView(view);
        setSelectedPlant(plant);
        setView('plantDetail');
    };

    const handleGoBack = () => {
        setView(previousView);
    };

    const renderView = () => {
        switch (view) {
            case 'knowledgeBase': return <KnowledgeBaseView onNavigateToDetail={handleSelectPlant} onGoBack={() => handleNavigate('home')} />;
            case 'seasonal': return <SeasonalView onNavigateToDetail={handleSelectPlant} onGoBack={() => handleNavigate('home')} />;
            case 'community': return <CommunityView onGoBack={() => handleNavigate('home')} />;
            case 'plantDetail': return selectedPlant ? <PlantDetailView plant={selectedPlant} onGoBack={handleGoBack} /> : <HomeView onNavigate={handleNavigate} />;
            case 'home':
            default: return <HomeView onNavigate={handleNavigate} />;
        }
    };
  
    const backgroundImageUrl = "https://images.unsplash.com/photo-1593933512130-58342be3b2d1?q=80&w=2574&auto=format&fit=crop";

    return (
        <div className="min-h-screen flex flex-col font-sans bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            <div className="min-h-screen flex flex-col bg-white/50 dark:bg-black/60 backdrop-blur-sm">
                <Header />
                <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
                    {renderView()}
                </main>
                <footer className="text-center p-4 text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    <p>Développé avec React, TypeScript & l'API Gemini.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
