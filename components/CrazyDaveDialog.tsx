
import React from 'react';

export const CrazyDaveDialog: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-yellow-800 border-4 border-yellow-600 p-8 rounded-lg text-center max-w-lg shadow-2xl">
        <h2 className="text-4xl font-bold text-white mb-6">You did it!</h2>
        <p className="text-2xl text-white italic">
          “Buddy, the tutorial is over. Get PVZ 2 for free in the App Store”
        </p>
      </div>
    </div>
  );
};
   