/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CursorState } from './types';
import { PaanShopHero } from './components/PaanShopHero';
import { soundEngine } from './services/soundEngine';

export default function App() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [, setCursorState] = useState<CursorState>({
    active: false,
    label: '',
    variant: 'default',
  });

  const handleHoverState = (label: string, variant: CursorState['variant'] = 'default') => {
    setCursorState({
      active: !!label,
      label,
      variant,
    });
  };

  const handleToggleSound = () => {
    const nextState = !isSoundEnabled;
    setIsSoundEnabled(nextState);
    soundEngine.setMuted(!nextState);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* Single Immersive Fullscreen Scene */}
      <PaanShopHero
        onHoverState={handleHoverState}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
      />
    </main>
  );
}


