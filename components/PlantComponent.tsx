
import React from 'react';
import { Plant, PlantType } from '../types';
import { GAME_CONFIG, PLANT_DEFINITIONS } from '../constants';

interface PlantComponentProps {
  plant: Plant;
}

export const PlantComponent: React.FC<PlantComponentProps> = ({ plant }) => {
  const { type, row, col, health } = plant;
  const def = PLANT_DEFINITIONS[type];
  const healthPercentage = (health / def.health) * 100;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${col * (100 / GAME_CONFIG.GRID_COLS)}%`,
    top: `${row * (100 / GAME_CONFIG.GRID_ROWS)}%`,
    width: `${100 / GAME_CONFIG.GRID_COLS}%`,
    height: `${100 / GAME_CONFIG.GRID_ROWS}%`,
    transition: 'opacity 0.5s',
    opacity: healthPercentage < 30 ? 0.5 : 1,
  };

  const plantColor: { [key in PlantType]: string } = {
    [PlantType.PEASHOOTER]: 'bg-green-500',
    [PlantType.SUNFLOWER]: 'bg-yellow-400',
    [PlantType.WALLNUT]: 'bg-yellow-800',
  };

  const plantHead: { [key in PlantType]: string } = {
    [PlantType.PEASHOOTER]: 'bg-green-700 w-1/2 h-1/2 rounded-full',
    [PlantType.SUNFLOWER]: 'bg-orange-500 w-3/4 h-3/4 rounded-full',
    [PlantType.WALLNUT]: 'bg-yellow-900 w-full h-full rounded-2xl',
  };

  return (
    <div style={style} className="flex items-center justify-center p-2">
      <div className={`relative w-full h-full flex items-center justify-center ${plantColor[type]} rounded-full`}>
        <div className={plantHead[type]}/>
      </div>
    </div>
  );
};
   