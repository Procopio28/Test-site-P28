
import React from 'react';
import { Zombie } from '../types';
import { GAME_CONFIG } from '../constants';

interface ZombieComponentProps {
  zombie: Zombie;
}

export const ZombieComponent: React.FC<ZombieComponentProps> = ({ zombie }) => {
  const { row, x, isEating } = zombie;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${row * (100 / GAME_CONFIG.GRID_ROWS)}%`,
    width: `${100 / GAME_CONFIG.GRID_COLS}%`,
    height: `${100 / GAME_CONFIG.GRID_ROWS}%`,
    transition: 'left 0.1s linear',
    transform: 'translateX(-50%)',
  };

  return (
    <div style={style} className={`flex items-center justify-center ${isEating ? 'animate-pulse' : ''}`}>
      <div className="w-1/2 h-full bg-gray-500 rounded-lg border-2 border-gray-700 flex flex-col items-center">
        <div className="w-8 h-8 bg-green-900 rounded-full mt-2"></div>
      </div>
    </div>
  );
};
   