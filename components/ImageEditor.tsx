import React, { useState } from 'react';
import { ImageAsset } from '../types';
import { editImageWithGemini, blobToBase64 } from '../services/geminiService';
import Button from './Button';
import SectionTitle from './SectionTitle';
import { Wand2, Download, RefreshCw, Undo2 } from 'lucide-react';

interface ImageEditorProps {
  initialImage: ImageAsset | null;
  onSave: (image: ImageAsset) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onSave }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage ? initialImage.url : null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>(initialImage ? [initialImage.url] : []);

  const handleEdit = async () => {
    if (!currentImage || !prompt.trim()) return;

    setIsProcessing(true);
    try {
      // Extract base64 from data URL
      const base64Data = currentImage.split(',')[1];
      const result = await editImageWithGemini(base64Data, prompt);
      
      if (result) {
        setCurrentImage(result);
        setHistory(prev => [...prev, result]);
        
        // Auto-save to gallery
        const newAsset: ImageAsset = {
          id: Date.now().toString(),
          url: result,
          type: 'edited',
          createdAt: Date.now(),
          prompt: prompt
        };
        onSave(newAsset);
        setPrompt(''); // clear prompt after success
      }
    } catch (error) {
      alert("حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentImage(newHistory[newHistory.length - 1]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await blobToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64}`;
        setCurrentImage(dataUrl);
        setHistory([dataUrl]);
        
        onSave({
          id: Date.now().toString(),
          url: dataUrl,
          type: 'uploaded',
          createdAt: Date.now()
        });
      } catch (err) {
        console.error("File reading failed", err);
      }
    }
  };

  if (!currentImage && !initialImage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SectionTitle title="المحرر الذكي" subtitle="قم برفع صورة للبدء في التعديل عليها باستخدام الذكاء الاصطناعي" />
        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:bg-gray-50 transition-colors">
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wand2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">اختر صورة للتعديل</h3>
          <p className="text-gray-500 mb-6">ندعم ملفات JPG و PNG</p>
          <label className="cursor-pointer inline-block">
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
            <span className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
              رفع صورة من جهازي
            </span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SectionTitle title="استوديو التعديل" subtitle="اكتب تعليماتك للذكاء الاصطناعي ليقوم بتنفيذها على الصورة" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <label className="block text-gray-700 font-bold mb-3">ماذا تريد أن تغير؟</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: اجعل السماء تمطر، أضف قطة في الزاوية، حول الصورة لنمط كرتوني..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none h-32 text-gray-700 bg-gray-50"
            />
            <div className="mt-4 flex flex-col gap-3">
              <Button 
                onClick={handleEdit} 
                isLoading={isProcessing} 
                disabled={!prompt.trim()}
                className="w-full"
              >
                <Wand2 className="w-4 h-4" />
                تطبيق التعديلات
              </Button>
              <div className="flex gap-2">
                 <Button 
                  variant="outline" 
                  onClick={handleUndo} 
                  disabled={history.length <= 1 || isProcessing}
                  className="flex-1"
                >
                  <Undo2 className="w-4 h-4" />
                  تراجع
                </Button>
                <label className="flex-1">
                   <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                   <div className="w-full h-full flex items-center justify-center px-4 py-2.5 rounded-xl font-medium border-2 border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer text-center transition-all">
                      <RefreshCw className="w-4 h-4 ml-2" />
                      جديد
                   </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl text-white shadow-lg">
             <h4 className="font-bold text-lg mb-2">نصيحة مصطفى 💡</h4>
             <p className="text-primary-100 text-sm leading-relaxed">
               للحصول على أفضل النتائج، كن دقيقاً في وصف التعديل. بدلاً من "غير الخلفية"، جرب "غير الخلفية إلى غابة استوائية وقت الغروب".
             </p>
          </div>
        </div>

        {/* Image Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 h-[600px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            {currentImage && (
              <img 
                src={currentImage} 
                alt="Edited" 
                className="max-w-full max-h-full rounded-xl object-contain shadow-sm"
              />
            )}
          </div>
          <div className="mt-4 flex justify-end">
             <a 
               href={currentImage || '#'} 
               download={`mustafa-edit-${Date.now()}.png`}
               className={`flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 ${!currentImage ? 'pointer-events-none opacity-50' : ''}`}
             >
               <Download className="w-5 h-5" />
               تحميل الصورة عالية الدقة
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;