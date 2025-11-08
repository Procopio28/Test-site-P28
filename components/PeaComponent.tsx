
import React from 'react';
import { Pea } from '../types';
import { GAME_CONFIG } from '../constants';

interface PeaComponentProps {
  pea: Pea;
}

export const PeaComponent: React.FC<PeaComponentProps> = ({ pea }) => {
  const { row, x } = pea;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${row * (100 / GAME_CONFIG.GRID_ROWS) + (100 / GAME_CONFIG.GRID_ROWS) / 3}%`,
    width: '20px',
    height: '20px',
    transition: 'left 0.1s linear',
  };

  return (
    <div style={style} className="bg-green-400 rounded-full border-2 border-green-800" />
  );
};
   