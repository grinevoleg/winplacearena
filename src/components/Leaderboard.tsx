"use client"

import { LeaderboardEntry } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400 fill-orange-400" />;
  return null;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return "from-yellow-500/30 to-yellow-600/30 border-yellow-500/50";
  if (rank === 2) return "from-gray-400/30 to-gray-500/30 border-gray-400/50";
  if (rank === 3) return "from-orange-400/30 to-orange-500/30 border-orange-400/50";
  return "";
};

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const isCurrentUser = entry.id === currentUserId;
        const isTopThree = entry.rank <= 3;

        return (
          <Card
            key={entry.id}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              isCurrentUser && "ring-2 ring-purple-500",
              isTopThree ? `glass-card border-2 bg-gradient-to-r ${getRankColor(entry.rank)}` : "glass-card"
            )}
          >
            {isCurrentUser && (
              <div className="absolute inset-0 neon-gradient opacity-10" />
            )}
            
            <div className="relative p-4 flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-12 flex flex-col items-center">
                {getRankIcon(entry.rank) || (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0",
                isTopThree ? "neon-gradient text-white" : "bg-muted text-foreground"
              )}>
                {entry.avatar || entry.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base truncate">
                    {entry.name}
                  </h4>
                  {isCurrentUser && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {entry.completedCount} challenges completed
                  </span>
                </div>
              </div>

              {/* Badge for top 3 */}
              {isTopThree && (
                <div className="flex-shrink-0">
                  <div className={cn(
                    "px-3 py-1 rounded-full font-bold text-sm",
                    entry.rank === 1 && "bg-yellow-500/20 text-yellow-400 neon-glow",
                    entry.rank === 2 && "bg-gray-400/20 text-gray-300",
                    entry.rank === 3 && "bg-orange-400/20 text-orange-400"
                  )}>
                    TOP {entry.rank}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
