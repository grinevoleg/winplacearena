"use client"

import { Home, PlusCircle, User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: 'home' | 'create' | 'profile' | 'arena';
  onTabChange: (tab: 'home' | 'create' | 'profile' | 'arena') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="glass-card border-t border-border/50 backdrop-blur-xl">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => onTabChange('home')}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                activeTab === 'home' 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative transition-all",
                activeTab === 'home' && "scale-110"
              )}>
                <Home className="w-6 h-6" />
                {activeTab === 'home' && (
                  <div className="absolute inset-0 neon-glow rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => onTabChange('arena')}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                activeTab === 'arena' 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative transition-all",
                activeTab === 'arena' && "scale-110"
              )}>
                <Trophy className="w-6 h-6" />
                {activeTab === 'arena' && (
                  <div className="absolute inset-0 neon-glow rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">Arena</span>
            </button>

            <button
              onClick={() => onTabChange('create')}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeTab === 'create'
                  ? "scale-110"
                  : "hover:scale-105"
              )}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full neon-gradient flex items-center justify-center neon-glow">
                  <PlusCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="text-xs font-medium text-white">Create</span>
            </button>

            <button
              onClick={() => onTabChange('profile')}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                activeTab === 'profile'
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative transition-all",
                activeTab === 'profile' && "scale-110"
              )}>
                <User className="w-6 h-6" />
                {activeTab === 'profile' && (
                  <div className="absolute inset-0 neon-glow rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}