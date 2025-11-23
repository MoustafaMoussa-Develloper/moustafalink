import React, { useState } from 'react';
import { generateImageFromText } from '../services/geminiService';
import { ImageAsset } from '../types';
import Button from './Button';
import SectionTitle from './SectionTitle';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface AiGeneratorProps {
  onSave: (image: ImageAsset) => void;
}

const AiGenerator: React.FC<AiGeneratorProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const result = await generateImageFromText(prompt);
      if (result) {
        setGeneratedImage(result);
        onSave({
          id: Date.now().toString(),
          url: result,
          type: 'generated',
          createdAt: Date.now(),
          prompt: prompt
        });
      } else {
          // Fallback message if model returns text only
          alert("لم يتمكن النموذج من توليد صورة. حاول تغيير الوصف.");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التوليد. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SectionTitle title="أطلق العنان لخيالك" subtitle="صف أي مشهد تتخيله وسيقوم مصطفى برسمه لك فوراً" />
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Input Side */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3 text-lg">وصف المشهد</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="رائد فضاء يركب حصاناً على سطح المريخ بأسلوب فن البكسل..."
                    className="w-full h-40 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none resize-none text-gray-700 bg-gray-50 text-lg leading-relaxed"
                />
            </div>
            <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating} 
                disabled={!prompt.trim()}
                className="w-full py-4 text-lg shadow-primary-500/40"
            >
                <Sparkles className="w-5 h-5" />
                توليد الصورة
            </Button>
            
            <p className="mt-4 text-xs text-gray-400 text-center">
                يتم استخدام نموذج Gemini 2.5 Flash المتطور للحصول على نتائج سريعة ومذهلة.
            </p>
        </div>

        {/* Output Side */}
        <div className="md:w-1/2 bg-gray-50 min-h-[400px] flex items-center justify-center p-6 border-r border-gray-100 relative">
            {generatedImage ? (
                <div className="relative group w-full h-full flex items-center justify-center">
                    <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="max-w-full max-h-[400px] rounded-2xl shadow-md object-contain" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl"></div>
                </div>
            ) : (
                <div className="text-center text-gray-400">
                    {isGenerating ? (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                            <p className="animate-pulse">جاري الرسم...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p>ستظهر نتيجتك الإبداعية هنا</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AiGenerator;