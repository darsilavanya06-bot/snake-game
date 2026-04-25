import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { audioService } from '../services/audioService';
import { GlitchText } from './GlitchText';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(10).fill(10));

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setVisualizerBars(prev => prev.map(() => Math.random() * 100));
      }, 100);
    } else {
      setVisualizerBars(Array(10).fill(10));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    const newState = audioService.toggle();
    setIsPlaying(newState);
  };

  const handleSkip = (direction: 1 | -1) => {
    let newIdx = currentTrackIdx + direction;
    if (newIdx >= TRACKS.length) newIdx = 0;
    if (newIdx < 0) newIdx = TRACKS.length - 1;
    
    setCurrentTrackIdx(newIdx);
    audioService.setTrack(newIdx);
    if (isPlaying) {
      audioService.play(newIdx);
    }
  };

  const currentTrack = TRACKS[currentTrackIdx];

  return (
    <div className="border-2 border-fuchsia-600 bg-black/80 p-4 relative overflow-hidden group">
      {/* Background Glitch Element */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4 border-b border-cyan-500/50 pb-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />
          <span className="text-sm uppercase tracking-widest">Audio_Subsystem</span>
        </div>
        <div className="text-xs text-fuchsia-500 animate-pulse">
          {isPlaying ? 'ACTIVE' : 'STANDBY'}
        </div>
      </div>

      <div className="mb-6">
        <GlitchText 
          text={currentTrack.title} 
          className="text-xl text-fuchsia-400 block truncate" 
        />
        <div className="text-cyan-600 text-xs mt-1 font-mono">
          ID: {currentTrack.id} // DUR: {currentTrack.duration}
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex items-end gap-1 h-12 mb-6 border-b border-fuchsia-900 pb-1">
        {visualizerBars.map((height, i) => (
          <div 
            key={i} 
            className="flex-1 bg-cyan-500 transition-all duration-75"
            style={{ 
              height: `${height}%`,
              opacity: isPlaying ? 0.8 : 0.2,
              boxShadow: isPlaying ? '0 0 8px #00ffff' : 'none'
            }}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-6">
        <button 
          onClick={() => handleSkip(-1)}
          className="text-cyan-500 hover:text-fuchsia-400 transition-colors focus:outline-none active:scale-95"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={handlePlayPause}
          className="w-12 h-12 flex items-center justify-center border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all focus:outline-none active:scale-95 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        <button 
          onClick={() => handleSkip(1)}
          className="text-cyan-500 hover:text-fuchsia-400 transition-colors focus:outline-none active:scale-95"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};
