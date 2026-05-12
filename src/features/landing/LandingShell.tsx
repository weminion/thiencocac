'use client';

import { useState } from 'react';
import Nav from './Nav';
import AuthModal from './AuthModal';

export default function LandingShell() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <Nav onOpenAuth={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
