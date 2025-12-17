import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { Lesson } from './components/Lesson';
import { Practice } from './components/Practice';
import { Assessment } from './components/Assessment';
import { AiTutor } from './components/AiTutor';
import { ViewState, Language } from './types';
import { GraduationCap, ArrowRight, ClipboardList, Languages, BookOpen, Calculator, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [language, setLanguage] = useState<Language | null>(null);

  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-violet-100 to-fuchsia-100">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 text-center border border-white">
           <div className="inline-block p-6 bg-white rounded-full mb-8 shadow-lg shadow-violet-100">
              <Languages size={48} className="text-violet-600" />
           </div>
           <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Bienvenue</h1>
           <p className="text-gray-500 mb-10 font-medium text-lg">Choisis ta langue / Choose your language</p>
           
           <div className="grid gap-4">
              <button 
                onClick={() => setLanguage('fr')} 
                className="group relative w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-between overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <span className="flex items-center gap-4 relative z-10 text-xl">
                   <span className="text-3xl">🇫🇷</span> Français
                 </span>
                 <ArrowRight className="relative z-10 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              
              <button 
                onClick={() => setLanguage('en')} 
                className="group w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 hover:border-violet-200 font-bold py-5 px-8 rounded-2xl transition-all flex items-center justify-between"
              >
                 <span className="flex items-center gap-4 text-xl">
                   <span className="text-3xl">🇬🇧</span> English
                 </span>
                 <ArrowRight className="text-gray-300 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.LESSON: return <Lesson language={language} />;
      case ViewState.PRACTICE: return <Practice language={language} />;
      case ViewState.ASSESSMENT: return <Assessment language={language} />;
      case ViewState.TUTOR: return <AiTutor language={language} />;
      case ViewState.HOME:
      default:
        const t = language === 'fr' ? {
          title: "Stat'Master", subtitle: "Deviens un as des", topic: "Statistiques",
          desc: "L'app ultime pour réviser ton Brevet. Cours interactifs, exos infinis et un prof IA cool.",
          btnStart: "C'est parti !",
          cards: [
            { id: ViewState.LESSON, title: "Cours", desc: "Comprends tout en 5 min", icon: BookOpen, color: "bg-blue-50 text-blue-600 border-blue-100" },
            { id: ViewState.PRACTICE, title: "Entraînement", desc: "Exos illimités & graphiques", icon: Calculator, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { id: ViewState.ASSESSMENT, title: "Évaluation", desc: "Scan tes devoirs par IA", icon: ClipboardList, color: "bg-amber-50 text-amber-600 border-amber-100" },
            { id: ViewState.TUTOR, title: "Tuteur IA", desc: "Une question ? Je réponds", icon: Bot, color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
          ]
        } : {
          title: "Stat'Master", subtitle: "Master the", topic: "Statistics",
          desc: "The ultimate app to ace your exams. Interactive lessons, infinite practice, and a cool AI tutor.",
          btnStart: "Let's Go!",
          cards: [
            { id: ViewState.LESSON, title: "Lessons", desc: "Understand in 5 mins", icon: BookOpen, color: "bg-blue-50 text-blue-600 border-blue-100" },
            { id: ViewState.PRACTICE, title: "Practice", desc: "Unlimited exercises", icon: Calculator, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { id: ViewState.ASSESSMENT, title: "Assessment", desc: "AI Homework Scan", icon: ClipboardList, color: "bg-amber-50 text-amber-600 border-amber-100" },
            { id: ViewState.TUTOR, title: "AI Tutor", desc: "Ask me anything", icon: Bot, color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
          ]
        };

        return (
          <div className="max-w-5xl mx-auto p-6 space-y-16 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-8 py-10">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mb-4 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Adapté Brevet 2026</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
                {t.subtitle} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">{t.topic}</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                {t.desc}
              </p>
              
              <button 
                onClick={() => setCurrentView(ViewState.LESSON)}
                className="group bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3 mx-auto"
              >
                {t.btnStart} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Grid Menu */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.cards.map((card) => {
                const Icon = card.icon;
                return (
                  <button 
                    key={card.id}
                    onClick={() => setCurrentView(card.id as ViewState)}
                    className={`p-6 rounded-3xl text-left border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group bg-white ${card.color.replace('bg-', 'hover:border-')}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${card.color}`}>
                       <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed">{card.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 selection:bg-fuchsia-200 selection:text-fuchsia-900">
      <NavBar currentView={currentView} onNavigate={setCurrentView} language={language} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="py-8 text-center text-gray-400 text-sm font-medium">
        <p>&copy; 2024 Stat'Master</p>
      </footer>
    </div>
  );
};

export default App;