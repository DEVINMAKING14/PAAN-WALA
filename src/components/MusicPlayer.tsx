import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  ListMusic,
  X,
  Plus,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Track } from '../types';
import { soundEngine } from '../services/soundEngine';
import { VisitorCounter } from './VisitorCounter';

interface MusicPlayerProps {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onHoverState: (label: string, variant?: 'music' | 'default') => void;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYLIST_ID = 'PLTBWDmQlAknQ';
const INITIAL_VIDEO_ID = 'eM8Mjuq4MwQ';

// All 10 curated tracks directly from YouTube Playlist PLTBWDmQlAknQ
const INITIAL_TRACKS: Track[] = [
  {
    id: 'eM8Mjuq4MwQ',
    title: 'Aankhein Khuli Song | Mohabbatein',
    artist: 'Lata Mangeshkar, Udit Narayan • YRF',
    youtubeId: 'eM8Mjuq4MwQ',
    duration: '6:06',
  },
  {
    id: 'zWPsjhBaRb0',
    title: 'Humko Humise Chura Lo | Mohabbatein',
    artist: 'Lata Mangeshkar, Udit Narayan • YRF',
    youtubeId: 'zWPsjhBaRb0',
    duration: '7:52',
  },
  {
    id: 'kzTWRX9Dhrg',
    title: 'Chalte Chalte | Mohabbatein',
    artist: 'Udbhav, Manohar Shetty, Ishaan • YRF',
    youtubeId: 'kzTWRX9Dhrg',
    duration: '7:38',
  },
  {
    id: 'OpLD97fG9Hw',
    title: 'Soni Soni (Holi Song) | Mohabbatein',
    artist: 'Udit Narayan, Jaspinder Narula • YRF',
    youtubeId: 'OpLD97fG9Hw',
    duration: '9:07',
  },
  {
    id: 'bC7RmYYMqTw',
    title: 'Pairon Mein Bandhan Hai | Mohabbatein',
    artist: 'Udbhav, Manohar Shetty, Sonali • YRF',
    youtubeId: 'bC7RmYYMqTw',
    duration: '7:01',
  },
  {
    id: '1cWR8QVhJLE',
    title: 'Zinda Rehti Hain Mohabbatein',
    artist: 'Lata Mangeshkar, Udit Narayan • YRF',
    youtubeId: '1cWR8QVhJLE',
    duration: '2:25',
  },
  {
    id: '5KkkDRCj3l8',
    title: 'Hansta Hua Noorani Chehra | Parasmani',
    artist: 'Lata Mangeshkar, Kamal Barot • Rajshri',
    youtubeId: '5KkkDRCj3l8',
    duration: '4:02',
  },
  {
    id: 'vejr2_PXVQo',
    title: 'Gori Tera Gaon Bada Pyara | Chitchor',
    artist: 'K. J. Yesudas • Rajshri',
    youtubeId: 'vejr2_PXVQo',
    duration: '5:08',
  },
  {
    id: '4qwFpKmYH4k',
    title: 'Aane Se Uske Aaye Bahar | Jeene Ki Raah',
    artist: 'Mohammed Rafi • Rajshri',
    youtubeId: '4qwFpKmYH4k',
    duration: '4:15',
  },
  {
    id: 'aSqwfhYAoxs',
    title: 'Sawan Ka Mahina | Milan',
    artist: 'Mukesh, Lata Mangeshkar • Rajshri',
    youtubeId: 'aSqwfhYAoxs',
    duration: '5:27',
  },
];

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isSoundEnabled,
  onToggleSound,
  onHoverState,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(366);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [nowPlayingTitle, setNowPlayingTitle] = useState('Aankhein Khuli Song | Mohabbatein');
  const [nowPlayingArtist, setNowPlayingArtist] = useState('Lata Mangeshkar, Udit Narayan • YRF');

  const playerRef = useRef<any>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Sync React State with YouTube Player Data
  const syncWithPlayer = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    try {
      // 1. Get playlist video IDs
      if (typeof player.getPlaylist === 'function') {
        const ids: string[] = player.getPlaylist();
        if (Array.isArray(ids) && ids.length > 0) {
          setPlaylist((prev) => {
            if (prev.length === ids.length && prev[0].youtubeId === ids[0]) {
              return prev;
            }
            return ids.map((id, index) => {
              const existing = prev.find((p) => p.youtubeId === id);
              if (existing) return existing;
              return {
                id: id || `track-${index}`,
                title: `Playlist Track #${index + 1}`,
                artist: 'YouTube Retro Session',
                youtubeId: id,
                duration: '5:00',
              };
            });
          });
        }
      }

      // 2. Get current playlist index
      if (typeof player.getPlaylistIndex === 'function') {
        const idx = player.getPlaylistIndex();
        if (typeof idx === 'number' && idx >= 0) {
          setCurrentTrackIndex(idx);
        }
      }

      // 3. Get current video data (Title & Author)
      if (typeof player.getVideoData === 'function') {
        const videoData = player.getVideoData();
        if (videoData && videoData.title) {
          setNowPlayingTitle(videoData.title);
          if (videoData.author) {
            setNowPlayingArtist(videoData.author);
          }
          // Update title in playlist array if placeholder
          setPlaylist((prev) =>
            prev.map((t, i) => {
              if (i === player.getPlaylistIndex() || t.youtubeId === videoData.video_id) {
                return {
                  ...t,
                  title: videoData.title,
                  artist: videoData.author || t.artist,
                };
              }
              return t;
            })
          );
        }
      }

      // 4. Get Duration
      if (typeof player.getDuration === 'function') {
        const dur = Math.floor(player.getDuration());
        if (dur > 0) setDuration(dur);
      }

      // 5. Get Current Time
      if (typeof player.getCurrentTime === 'function') {
        const cur = Math.floor(player.getCurrentTime());
        if (cur >= 0) setCurrentTime(cur);
      }
    } catch (err) {
      console.warn('Sync error:', err);
    }
  }, []);

  // Initialize official YouTube IFrame Player API
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const setupYT = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        if (!document.getElementById('yt-iframe-api-script')) {
          const tag = document.createElement('script');
          tag.id = 'yt-iframe-api-script';
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
          createPlayer();
        };
      }
    };

    const createPlayer = () => {
      if (playerRef.current) return;

      const playerContainer = document.getElementById('yt-playlist-stream-target');
      if (!playerContainer) return;

      playerRef.current = new window.YT.Player('yt-playlist-stream-target', {
        height: '160',
        width: '240',
        playerVars: {
          listType: 'playlist',
          list: PLAYLIST_ID,
          autoplay: 0,
          controls: 0,
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
          loop: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            try {
              // Cue the complete playlist
              event.target.cuePlaylist({
                listType: 'playlist',
                list: PLAYLIST_ID,
                index: 0,
                startSeconds: 0,
              });
              event.target.setLoop(true);
              if (isSoundEnabled) {
                event.target.unMute();
                event.target.setVolume(100);
              } else {
                event.target.mute();
              }
              setTimeout(() => syncWithPlayer(), 500);
            } catch (e) {
              console.warn('Playlist cue error:', e);
            }
          },
          onStateChange: (event: any) => {
            // -1: UNSTARTED, 0: ENDED, 1: PLAYING, 2: PAUSED, 3: BUFFERING, 5: CUED
            if (event.data === 1) {
              setIsPlaying(true);
              syncWithPlayer();
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              // Song finished! YouTube playlist auto-advances, ensure sync
              setTimeout(() => syncWithPlayer(), 400);
            } else if (event.data === 3 || event.data === -1 || event.data === 5) {
              syncWithPlayer();
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player Error:', event.data);
            // If track error in playlist, advance to next
            if (event.data === 150 || event.data === 101 || event.data === 2) {
              if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
                playerRef.current.nextVideo();
              }
            }
          },
        },
      });
    };

    setupYT();

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [syncWithPlayer, isSoundEnabled]);

  // Sync mute state when global sound is toggled
  useEffect(() => {
    if (playerRef.current && isPlayerReady) {
      try {
        if (isSoundEnabled) {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
        } else {
          playerRef.current.mute();
        }
      } catch (err) {
        console.warn('Mute error:', err);
      }
    }
  }, [isSoundEnabled, isPlayerReady]);

  // Periodic state poller while playing for smooth seekbar, duration, & timecode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        syncWithPlayer();
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, syncWithPlayer]);

  // Fetch real track metadata for playlist tracks using oEmbed
  useEffect(() => {
    const fetchMetadata = async () => {
      playlist.forEach(async (track, index) => {
        if (track.title.startsWith('Playlist Track #') && track.youtubeId) {
          try {
            const res = await fetch(
              `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${track.youtubeId}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.title) {
                setPlaylist((prev) =>
                  prev.map((t, idx) =>
                    idx === index
                      ? {
                          ...t,
                          title: data.title,
                          artist: data.author_name || t.artist,
                        }
                      : t
                  )
                );
              }
            }
          } catch (e) {
            // ignore network err
          }
        }
      });
    };

    if (playlist.length > 0) {
      fetchMetadata();
    }
  }, [playlist.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. Play / Pause Control
  const handleTogglePlay = () => {
    soundEngine.playRadioTuningSound();
    const player = playerRef.current;
    if (!player) return;

    try {
      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
      } else {
        if (isSoundEnabled) {
          player.unMute();
          player.setVolume(100);
        }
        player.playVideo();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('Play toggle error:', err);
    }
  };

  // 2. Next Song Control (Official Playlist Advance)
  const handleNextTrack = () => {
    soundEngine.playSubtleClick();
    const player = playerRef.current;
    if (!player) return;

    try {
      if (typeof player.nextVideo === 'function') {
        player.nextVideo();
        setIsPlaying(true);
        setTimeout(() => syncWithPlayer(), 400);
      }
    } catch (err) {
      console.warn('Next track error:', err);
    }
  };

  // 3. Previous Song Control
  const handlePrevTrack = () => {
    soundEngine.playSubtleClick();
    const player = playerRef.current;
    if (!player) return;

    try {
      if (currentTime > 4 && typeof player.seekTo === 'function') {
        player.seekTo(0, true);
        setCurrentTime(0);
      } else if (typeof player.previousVideo === 'function') {
        player.previousVideo();
        setIsPlaying(true);
        setTimeout(() => syncWithPlayer(), 400);
      }
    } catch (err) {
      console.warn('Prev track error:', err);
    }
  };

  // 4. Select Exact Track from Playlist
  const handleSelectTrack = (index: number) => {
    soundEngine.playRadioTuningSound();
    const player = playerRef.current;
    if (!player) return;

    try {
      if (typeof player.playVideoAt === 'function') {
        player.playVideoAt(index);
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setTimeout(() => syncWithPlayer(), 400);
      }
    } catch (err) {
      console.warn('Select track error:', err);
    }
  };

  // 5. Shuffle Playlist
  const handleToggleShuffle = () => {
    soundEngine.playSubtleClick();
    const nextShuffle = !isShuffle;
    setIsShuffle(nextShuffle);
    const player = playerRef.current;
    if (player && typeof player.setShuffle === 'function') {
      try {
        player.setShuffle(nextShuffle);
      } catch (err) {
        console.warn('Shuffle error:', err);
      }
    }
  };

  // 6. Scrub / Seek Bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = Math.floor(newPercent * duration);
    setCurrentTime(targetSeconds);

    const player = playerRef.current;
    if (player && typeof player.seekTo === 'function') {
      try {
        player.seekTo(targetSeconds, true);
      } catch (err) {
        console.warn('Seek error:', err);
      }
    }
  };

  // Add Custom Track or Video
  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    let youtubeId = customUrl.trim();
    if (customUrl.includes('v=')) {
      const match = customUrl.match(/v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) youtubeId = match[1];
    } else if (customUrl.includes('youtu.be/')) {
      const match = customUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) youtubeId = match[1];
    }

    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: 'Custom Session Track',
      artist: 'Added YouTube Stream',
      youtubeId: youtubeId,
      duration: '4:30',
    };

    setPlaylist([newTrack, ...playlist]);
    setCustomUrl('');
    setShowAddUrl(false);

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById(youtubeId);
      setIsPlaying(true);
      setTimeout(() => syncWithPlayer(), 500);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Offscreen YouTube IFrame Stream Host - Keep in DOM to avoid browser background throttling */}
      <div className="fixed -bottom-96 -left-96 opacity-0 pointer-events-none z-0">
        <div id="yt-playlist-stream-target" />
      </div>

      {/* Playlist Queue Modal (Floating above player) */}
      {isQueueOpen && (
        <div
          id="music-queue-panel"
          className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90vw] max-w-sm rounded-2xl border border-white/25 bg-black/90 p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <ListMusic className="h-3.5 w-3.5 text-white" />
              <span className="font-semibold text-xs tracking-wide text-white">YouTube Playlist</span>
              <span className="text-[10px] text-neutral-400">({playlist.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href={`https://www.youtube.com/watch?v=${INITIAL_VIDEO_ID}&list=${PLAYLIST_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[9px] font-medium text-white hover:bg-white/20 transition-colors"
                title="Open YouTube Playlist in new tab"
              >
                <span>YouTube</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
              <button
                onClick={() => setShowAddUrl(!showAddUrl)}
                className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] uppercase font-bold text-white hover:bg-white/25 transition-colors cursor-pointer"
              >
                + Add
              </button>
              <button
                onClick={() => setIsQueueOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {showAddUrl && (
            <form onSubmit={handleAddTrack} className="mt-2.5 flex gap-1.5">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="YouTube Link / ID..."
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-white placeholder-neutral-500 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-black hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Add
              </button>
            </form>
          )}

          <div className="mt-2 max-h-52 overflow-y-auto no-scrollbar space-y-1">
            {playlist.map((track, idx) => {
              const isSelected = currentTrackIndex === idx;
              return (
                <div
                  key={track.id || idx}
                  onClick={() => handleSelectTrack(idx)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/20 text-white font-semibold border border-white/40 shadow-sm'
                      : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`font-mono text-[9px] ${
                        isSelected ? 'text-white font-bold' : 'text-neutral-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="truncate text-left">
                      <p className="truncate text-white font-medium">{track.title}</p>
                      <p className="text-[9px] text-neutral-400 truncate">{track.artist}</p>
                    </div>
                  </div>
                  {isSelected && isPlaying ? (
                    <span className="flex items-center gap-0.5 shrink-0 ml-2">
                      <span className="h-2 w-0.5 bg-white animate-bounce" />
                      <span className="h-3 w-0.5 bg-white animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-0.5 bg-white animate-bounce [animation-delay:0.4s]" />
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] text-neutral-400 shrink-0 ml-2">
                      {track.duration || 'Play'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COMPACT FROSTED GLASS MUSIC PILL PLAYER (WHITE GLASSMORPHISM) */}
      <div
        id="frosted-music-pill-container"
        className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-[390px] sm:max-w-[420px] pointer-events-auto select-none flex flex-col items-center gap-1.5"
      >
        <div className="relative w-full flex items-center justify-between rounded-full border border-white/30 bg-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2 text-white shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
          {/* Subtle Clean Translucent Backlight Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 via-black/20 to-white/5 pointer-events-none" />

          {/* Left: Album Artwork Circle Badge */}
          <div className="relative flex items-center gap-2.5 min-w-0 flex-1 pr-1.5">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden p-0.5">
              {/* Spinning Heartbroken Records Motif */}
              <div
                className={`flex flex-col items-center justify-center text-center transition-transform ${
                  isPlaying ? 'animate-[spin_7s_linear_infinite]' : ''
                }`}
              >
                <div className="text-[4px] font-black tracking-tighter text-black uppercase leading-none">
                  HEARTBROKEN
                </div>
                <div className="my-0.5 h-2.5 w-4.5 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-600">
                  <div className="h-1 w-1 rounded-full bg-white" />
                </div>
                <div className="text-[4px] font-black tracking-tighter text-black uppercase leading-none">
                  RECORDS
                </div>
              </div>
            </div>

            {/* Middle: Title, Artist, Seekbar & Duration */}
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-[11px] sm:text-xs font-bold text-white tracking-tight leading-tight">
                {nowPlayingTitle}
              </h4>
              <p className="truncate text-[9px] sm:text-[10px] text-neutral-300 font-medium">
                {nowPlayingArtist}
              </p>

              {/* Interactive Scrub Bar */}
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="group relative mt-1 h-1 w-full rounded-full bg-white/20 cursor-pointer overflow-hidden py-1 -my-1"
              >
                <div className="h-0.5 sm:h-1 w-full bg-white/25 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-150 group-hover:bg-white"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Time Elapsed / Duration */}
              <div className="mt-0.5 flex items-center justify-between text-[8.5px] sm:text-[9px] text-neutral-300 font-sans">
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <span className="font-mono text-[8px] text-white/80 uppercase font-bold tracking-wider">
                  {isPlaying ? 'PLAYING' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Controls Stack */}
          <div className="relative flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1.5 border-l border-white/15">
            {/* Shuffle Button */}
            <button
              onClick={handleToggleShuffle}
              onMouseEnter={() => onHoverState(isShuffle ? 'SHUFFLE ON' : 'SHUFFLE', 'default')}
              onMouseLeave={() => onHoverState('')}
              className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-all cursor-pointer ${
                isShuffle
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
              }`}
              title="Shuffle Playlist"
            >
              <Shuffle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </button>

            {/* Previous Button */}
            <button
              onClick={handlePrevTrack}
              onMouseEnter={() => onHoverState('PREVIOUS', 'default')}
              onMouseLeave={() => onHoverState('')}
              className="p-1 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Previous Track in Playlist"
            >
              <SkipBack className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
            </button>

            {/* Main Play / Pause Button */}
            <button
              onClick={handleTogglePlay}
              onMouseEnter={() => onHoverState(isPlaying ? 'PAUSE' : 'PLAY', 'music')}
              onMouseLeave={() => onHoverState('')}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
              ) : (
                <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextTrack}
              onMouseEnter={() => onHoverState('NEXT', 'default')}
              onMouseLeave={() => onHoverState('')}
              className="p-1 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Next Track in Playlist"
            >
              <SkipForward className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
            </button>

            {/* Playlist Queue Button */}
            <button
              onClick={() => {
                soundEngine.playSubtleClick();
                setIsQueueOpen(!isQueueOpen);
              }}
              onMouseEnter={() => onHoverState('PLAYLIST', 'default')}
              onMouseLeave={() => onHoverState('')}
              className={`p-1 transition-all cursor-pointer ${
                isQueueOpen ? 'text-white bg-white/20 rounded-full' : 'text-white/80 hover:text-white hover:scale-110'
              }`}
              title="Playlist Queue"
            >
              <ListMusic className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Live Visitor Counter */}
        <VisitorCounter onHoverState={onHoverState} />
      </div>
    </>
  );
};
