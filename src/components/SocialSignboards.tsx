import React from 'react';
import { Instagram, Github, Mail } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface SocialSignboardsProps {
  onHoverState: (label: string, variant?: 'link' | 'default') => void;
}

export const SocialSignboards: React.FC<SocialSignboardsProps> = ({ onHoverState }) => {
  const links = [
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: Instagram,
    },
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com',
      icon: Github,
    },
    {
      id: 'email',
      name: 'Email',
      url: 'mailto:namantiwari1414@gmail.com',
      icon: Mail,
    },
  ];

  return (
    <div
      id="social-signboards-stack"
      className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto select-none"
    >
      <div className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-white/25 bg-white/10 p-1 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playSubtleClick()}
              onMouseEnter={() => onHoverState(link.name.toUpperCase(), 'link')}
              onMouseLeave={() => onHoverState('')}
              className="group flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-95 shadow-sm"
              title={link.name}
            >
              <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:scale-110 text-white" />
              <span className="hidden xs:inline sm:inline font-medium tracking-wider text-[10px] sm:text-[11px] uppercase">
                {link.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};



