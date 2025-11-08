
import React from 'react';
import { Sun } from '../types';

interface SunComponentProps {
  sun: Sun;
  onCollect: (id: string) => void;
}

export const SunComponent: React.FC<SunComponentProps> = ({ sun, onCollect }) => {
  const { id, x, y, isFalling } = sun;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    width: '8%',
    height: '15%',
    transition: 'top 0.1s linear',
  };
  
  return (
    <div 
        style={style} 
        className="cursor-pointer animate-pulse"
        onClick={() => onCollect(id)}
    >
        <div className="w-full h-full bg-yellow-400 rounded-full border-4 border-yellow-200 shadow-lg flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-yellow-300 rounded-full"></div>
        </div>
    </div>
  );
};
   