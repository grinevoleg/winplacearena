"use client"

import { useState, useMemo } from "react";
import { GlobalChallenge, LeaderboardEntry } from "@/lib/types";
import { GlobalChallengeCard } from "@/components/GlobalChallengeCard";
import { Leaderboard } from "@/components/Leaderboard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, TrendingUp } from "lucide-react";

interface ArenaViewProps {
  globalChallenges: GlobalChallenge[];
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
  completedGlobalChallenges: string[];
  onToggleGlobalChallenge: (id: string) => void;
}

export function ArenaView({ 
  globalChallenges, 
  leaderboard, 
  currentUserId,
  completedGlobalChallenges,
  onToggleGlobalChallenge 
}: ArenaViewProps) {
  const [viewTab, setViewTab] = useState<'challenges' | 'leaderboard'>('challenges');

  const activeGlobalChallenges = useMemo(() => {
    return globalChallenges.filter(c => {
      const daysLeft = Math.ceil((c.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysLeft >= 0;
    });
  }, [globalChallenges]);

  const completedCount = completedGlobalChallenges.length;
  const currentUserRank = leaderboard.find(e => e.id === currentUserId)?.rank || '-';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Trophy className="w-10 h-10 text-[#3BDBEB]" />
              <span>
                <span className="text-[#3BDBEB]">Win</span>
                {" "}
                <span className="text-white">Place</span>
                {" "}
                <span className="neon-gradient-text">Arena</span>
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Compete with others on global challenges
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card neon-border p-4 rounded-xl">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Flame className="w-4 h-4" />
              <span>Your Rank</span>
            </div>
            <div className="text-3xl font-black neon-gradient-text">
              #{currentUserRank}
            </div>
          </div>
          <div className="glass-card neon-border p-4 rounded-xl">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Completed</span>
            </div>
            <div className="text-3xl font-black neon-gradient-text">
              {completedCount}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as any)} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="challenges">
              Global Challenges ({activeGlobalChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              Leaderboard ({leaderboard.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {viewTab === 'challenges' && (
        <div className="space-y-4">
          {activeGlobalChallenges.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Trophy className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">No global challenges yet</p>
                <p className="text-muted-foreground text-sm">
                  Check back soon for new competitions
                </p>
              </div>
            </div>
          ) : (
            activeGlobalChallenges.map(challenge => (
              <GlobalChallengeCard
                key={challenge.id}
                challenge={challenge}
                onToggle={onToggleGlobalChallenge}
                userCompleted={completedGlobalChallenges.includes(challenge.id)}
              />
            ))
          )}
        </div>
      )}

      {viewTab === 'leaderboard' && (
        <div>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Trophy className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">No competitors yet</p>
                <p className="text-muted-foreground text-sm">
                  Be the first to complete global challenges
                </p>
              </div>
            </div>
          ) : (
            <Leaderboard 
              entries={leaderboard}
              currentUserId={currentUserId}
            />
          )}
        </div>
      )}
    </div>
  );
}