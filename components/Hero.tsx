import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from './Button';
import { AppSection } from '../types';

interface HeroProps {
  onNavigate: (section: AppSection) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl mx-4 my-6 lg:mx-8 min-h-[500px] flex items-center justify-center border border-gray-100">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-100 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-100 blur-3xl opacity-30 bg-orange-100"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-6 border border-primary-100">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium text-sm">أهلاً بك في المستقبل</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
          استوديو <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">مصطفى</span> للإبداع
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          حول خيالك إلى واقع باستخدام أحدث تقنيات الذكاء الاصطناعي. ارفع صورك، عدلها، أو أنشئ صوراً جديدة كلياً بلمسة زر واحدة.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={() => onNavigate(AppSection.GENERATOR)} className="w-full sm:w-auto text-lg py-4 px-8">
            ابدأ الابتكار الآن
          </Button>
          <button 
            onClick={() => onNavigate(AppSection.GALLERY)}
            className="flex items-center gap-2 text-gray-600 font-medium hover:text-primary-600 transition-colors"
          >
            استعراض المعرض <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;