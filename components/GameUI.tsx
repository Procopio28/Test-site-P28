
import React from 'react';
import { PlantType } from '../types';
import { PLANT_DEFINITIONS } from '../constants';

interface PlantCardProps {
  plantType: PlantType;
  onSelectPlant: (type: PlantType) => void;
  sun: number;
  isSelected: boolean;
  cooldown: number;
}

const PlantCard: React.FC<PlantCardProps> = ({ plantType, onSelectPlant, sun, isSelected, cooldown }) => {
  const def = PLANT_DEFINITIONS[plantType];
  const canAfford = sun >= def.cost;
  const isCoolingDown = cooldown > 0;
  const rechargePercentage = isCoolingDown ? ((def.recharge - cooldown) / def.recharge) * 100 : 100;

  const plantStyles: { [key in PlantType]: string } = {
    [PlantType.PEASHOOTER]: 'bg-green-500 border-green-700',
    [PlantType.SUNFLOWER]: 'bg-yellow-400 border-yellow-600',
    [PlantType.WALLNUT]: 'bg-yellow-800 border-yellow-900',
  };

  return (
    <div
      onClick={() => !isCoolingDown && canAfford && onSelectPlant(plantType)}
      className={`relative w-16 h-20 p-1 border-4 rounded-md shadow-md transition-all duration-200
        ${isSelected ? 'border-yellow-400 scale-110' : 'border-gray-600'}
        ${canAfford && !isCoolingDown ? 'cursor-pointer hover:border-yellow-300' : 'opacity-50 cursor-not-allowed'}`}
    >
      <div className={`w-full h-full rounded-sm flex items-center justify-center ${plantStyles[plantType]}`}>
        {/* Simple visual representation */}
      </div>
       {!isCoolingDown && <span className="absolute bottom-0 right-1 text-white font-bold text-lg" style={{ WebkitTextStroke: '1px black' }}>{def.cost}</span>}
      {isCoolingDown && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="absolute bottom-0 left-0 h-full bg-gray-400/50" style={{ width: `${rechargePercentage}%` }}></div>
        </div>
      )}
    </div>
  );
};

interface GameUIProps {
  sun: number;
  onSelectPlant: (type: PlantType) => void;
  selectedPlant: PlantType | null;
  plantCooldowns: { [key in PlantType]?: number };
}

export const GameUI: React.FC<GameUIProps> = ({ sun, onSelectPlant, selectedPlant, plantCooldowns }) => {
  return (
    <div className="w-full bg-gray-800 bg-opacity-70 p-2 mb-2 flex items-center rounded-t-lg">
      <div className="bg-gray-900/50 p-2 rounded-lg flex items-center justify-center w-28 h-20">
        <span className="text-yellow-400 text-4xl font-bold">{sun}</span>
      </div>
      <div className="flex gap-2 ml-4">
        {(Object.keys(PLANT_DEFINITIONS) as PlantType[]).map(type => (
          <PlantCard
            key={type}
            plantType={type}
            onSelectPlant={onSelectPlant}
            sun={sun}
            isSelected={selectedPlant === type}
            cooldown={plantCooldowns[type] || 0}
          />
        ))}
      </div>
    </div>
  );
};
   