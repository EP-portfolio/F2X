import React from 'react';
import { ViewState, Language } from '../types';
import { BookOpen, Calculator, Bot, Home, ClipboardList } from 'lucide-react';

interface NavBarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  language: Language;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate, language }) => {
  
  const labels = {
    fr: {
      home: 'Accueil',
      lesson: 'Cours',
      practice: 'Entraînement',
      assessment: 'Évaluation',
      tutor: 'Tuteur IA'
    },
    en: {
      home: 'Home',
      lesson: 'Lessons',
      practice: 'Practice',
      assessment: 'Assessment',
      tutor: 'AI Tutor'
    }
  };

  const t = labels[language];

  const navItems = [
    { view: ViewState.HOME, label: t.home, icon: Home, color: 'text-violet-600', bg: 'bg-violet-50' },
    { view: ViewState.LESSON, label: t.lesson, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { view: ViewState.PRACTICE, label: t.practice, icon: Calculator, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { view: ViewState.ASSESSMENT, label: t.assessment, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
    { view: ViewState.TUTOR, label: t.tutor, icon: Bot, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
  ];

  return (
    <nav className="sticky top-4 z-50 px-4 mb-6">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-full border border-white/50 px-6 py-3 flex justify-between items-center transition-all">
        
        {/* Logo */}
        <div className="flex-shrink-0 font-extrabold text-xl flex items-center gap-2 text-gray-800 tracking-tight cursor-pointer" onClick={() => onNavigate(ViewState.HOME)}>
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transform -rotate-3">
            <span className="font-mono text-xs font-bold">F2X</span>
          </div>
          <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
            Stat'Master
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? `${item.bg} ${item.color} shadow-sm scale-105`
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} className={isActive ? item.color : "text-gray-400"} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Nav Trigger (Simple Icon for now, could be expanded) */}
        <div className="md:hidden flex gap-2">
           {navItems.slice(1).map((item) => { // Skip Home on mobile bar to save space
             const Icon = item.icon;
             const isActive = currentView === item.view;
             return (
               <button 
                 key={item.view} 
                 onClick={() => onNavigate(item.view)}
                 className={`p-2 rounded-full ${isActive ? item.bg + ' ' + item.color : 'text-gray-400'}`}
               >
                 <Icon size={20} />
               </button>
             )
           })}
        </div>
      </div>
    </nav>
  );
};