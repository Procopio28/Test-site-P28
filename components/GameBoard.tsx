
import React from 'react';
import { Plant, Zombie, Pea, Sun, PlantType } from '../types';
import { GAME_CONFIG } from '../constants';
import { PlantComponent } from './PlantComponent';
import { ZombieComponent } from './ZombieComponent';
import { PeaComponent } from './PeaComponent';
import { SunComponent } from './SunComponent';

interface GameBoardProps {
  plants: Plant[];
  zombies: Zombie[];
  peas: Pea[];
  suns: Sun[];
  onPlacePlant: (row: number, col: number) => void;
  onCollectSun: (id: string) => void;
  selectedPlant: PlantType | null;
}

const GridCell: React.FC<{ row: number; col: number; onPlacePlant: (row: number, col: number) => void; hasPlant: boolean; selectedPlant: PlantType | null }> = ({ row, col, onPlacePlant, hasPlant, selectedPlant }) => {
  const canPlace = selectedPlant && !hasPlant;
  return (
    <div
      className={`w-full h-full ${canPlace ? 'cursor-pointer hover:bg-white/20' : ''}`}
      onClick={() => onPlacePlant(row, col)}
    />
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({ plants, zombies, peas, suns, onPlacePlant, onCollectSun, selectedPlant }) => {
  return (
    <div className="relative bg-green-700 bg-opacity-80 border-8 border-yellow-800 shadow-lg" style={{ aspectRatio: `${GAME_CONFIG.GRID_COLS}/${GAME_CONFIG.GRID_ROWS}` }}>
      <div className="absolute inset-0 grid grid-cols-9 grid-rows-5">
        {[...Array(GAME_CONFIG.GRID_ROWS * GAME_CONFIG.GRID_COLS)].map((_, index) => {
          const row = Math.floor(index / GAME_CONFIG.GRID_COLS);
          const col = index % GAME_CONFIG.GRID_COLS;
          const isDark = (row + col) % 2 === 1;
          const hasPlant = plants.some(p => p.row === row && p.col === col);
          return (
            <div key={index} className={isDark ? 'bg-green-800/50' : 'bg-green-600/50'}>
               <GridCell row={row} col={col} onPlacePlant={onPlacePlant} hasPlant={hasPlant} selectedPlant={selectedPlant}/>
            </div>
          );
        })}
      </div>

      {plants.map(plant => <PlantComponent key={plant.id} plant={plant} />)}
      {zombies.map(zombie => <ZombieComponent key={zombie.id} zombie={zombie} />)}
      {peas.map(pea => <PeaComponent key={pea.id} pea={pea} />)}
      {suns.map(sun => <SunComponent key={sun.id} sun={sun} onCollect={onCollectSun} />)}
    </div>
  );
};
   