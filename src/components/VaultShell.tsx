import React from 'react';
import { MainLayout } from './layout/MainLayout';
import { CommandPalette } from './ui/CommandPalette';

interface VaultShellProps {
  children: React.ReactNode;
}

export const VaultShell: React.FC<VaultShellProps> = ({ children }) => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-obsidian-bg selection:bg-dracula-purple/30">
      <CommandPalette />
      <MainLayout>
        {children}
      </MainLayout>
    </div>
  );
};
