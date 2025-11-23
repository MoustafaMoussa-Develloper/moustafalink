import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
      <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 rounded-full"></div>
    </div>
  );
};

export default SectionTitle;