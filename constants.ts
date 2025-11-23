import { Image, Wand2, Upload, LayoutGrid, Home } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'HOME', label: 'الرئيسية', icon: Home },
  { id: 'GALLERY', label: 'معرضي', icon: LayoutGrid },
  { id: 'EDITOR', label: 'المحرر الذكي', icon: Wand2 },
  { id: 'GENERATOR', label: 'تخيل وتوليد', icon: Image },
] as const;