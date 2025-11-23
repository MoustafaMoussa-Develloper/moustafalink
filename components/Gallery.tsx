import React from 'react';
import { ImageAsset } from '../types';
import SectionTitle from './SectionTitle';
import { Download, Edit, Trash2 } from 'lucide-react';

interface GalleryProps {
  images: ImageAsset[];
  onSelectForEdit: (image: ImageAsset) => void;
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onSelectForEdit, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <span className="text-4xl">📂</span>
        </div>
        <h3 className="text-xl font-bold text-gray-600">المعرض فارغ حالياً</h3>
        <p className="text-gray-400 mt-2">قم برفع الصور أو توليدها لتظهر هنا</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SectionTitle title="معرض أعمالك" subtitle="جميع الصور التي قمت برفعها أو إنشائها محفوظة هنا" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img src={img.url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
               <div className="flex gap-2 justify-center mb-4">
                  <button 
                    onClick={() => onSelectForEdit(img)}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-primary-600 transition-colors"
                    title="تعديل"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <a 
                    href={img.url} 
                    download={`mustafa-gallery-${img.id}.png`}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-green-600 transition-colors"
                    title="تحميل"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => onDelete(img.id)}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-red-600 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
               {img.prompt && (
                 <p className="text-white text-xs line-clamp-2 text-center opacity-80">{img.prompt}</p>
               )}
            </div>
            
            <div className="p-3 flex justify-between items-center bg-white border-t border-gray-50">
              <span className={`text-xs px-2 py-1 rounded-md font-medium
                ${img.type === 'uploaded' ? 'bg-blue-100 text-blue-700' : 
                  img.type === 'generated' ? 'bg-purple-100 text-purple-700' : 
                  'bg-orange-100 text-orange-700'}`}>
                {img.type === 'uploaded' ? 'رفع' : img.type === 'generated' ? 'توليد' : 'تعديل'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(img.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;