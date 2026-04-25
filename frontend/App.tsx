import React, { useState, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';
import { GLITCH_MESSAGES } from './constants';

const App: React.FC = () => {
  const [systemMessage, setSystemMessage] = useState(GLITCH_MESSAGES[0]);

  // Randomly change background glitch messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setSystemMessage(GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      
      {/* Background decorative elements */}
      <div className="fixed top-4 left-4 text-cyan-900/30 text-xs font-mono pointer-events-none select-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>{Math.random().toString(36).substring(2, 15)}</div>
        ))}
      </div>
      <div className="fixed bottom-4 right-4 text-fuchsia-900/30 text-xs font-mono pointer-events-none select-none text-right">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>{Math.random().toString(16).substring(2, 10).toUpperCase()}</div>
        ))}
      </div>

      {/* Main Terminal Window */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Sidebar - Decorative / Status */}
        <div className="hidden lg:flex col-span-3 flex-col gap-4">
          <div className="border border-cyan-800 p-4 bg-black/50 h-48 flex flex-col justify-between">
            <div className="text-cyan-500 text-sm border-b border-cyan-800 pb-1">SYS.LOG</div>
            <div className="text-fuchsia-400 text-xs font-mono mt-2 flex-1 overflow-hidden flex flex-col justify-end opacity-70">
              <div>> Boot sequence initiated...</div>
              <div>> Loading neural pathways...</div>
              <div>> Audio subsystem online.</div>
              <div className="animate-pulse">> {systemMessage}</div>
            </div>
          </div>
          
          <div className="border border-fuchsia-900 p-4 bg-black/50 flex-1 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
             <GlitchText text="WARNING" className="text-red-500 text-xl mb-2 block" />
             <p className="text-cyan-600 text-xs text-justify">
               UNAUTHORIZED ACCESS DETECTED IN SECTOR 7G. 
               BIOMETRIC SCANS INDICATE NON-STANDARD ENTITY. 
               PROCEED WITH CAUTION.
             </p>
          </div>
        </div>

        {/* Center - Game Area */}
        <div className="col-span-1 lg:col-span-6 flex flex-col">
          <div className="mb-6 text-center">
            <GlitchText as="h1" text="NEURAL_SNAKE_OS" className="text-5xl md:text-6xl text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
            <div className="text-fuchsia-500 tracking-[0.5em] text-sm mt-2">v2.0.4_BETA</div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <SnakeGame />
          </div>
        </div>

        {/* Right Sidebar - Music Player & Controls */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-8 justify-center lg:justify-start lg:pt-24">
          <MusicPlayer />
          
          <div className="border border-cyan-800 p-4 bg-black/50">
            <div className="text-cyan-500 text-sm border-b border-cyan-800 pb-1 mb-2">HARDWARE_METRICS</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-cyan-700">CPU_TEMP:</span>
                <span className="text-fuchsia-400">89°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-700">MEM_USAGE:</span>
                <span className="text-cyan-400">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-700">NET_UPLINK:</span>
                <span className="text-red-500 animate-pulse">OFFLINE</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
