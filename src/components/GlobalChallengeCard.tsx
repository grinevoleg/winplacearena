"use client"

import { GlobalChallenge } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, TrendingUp, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalChallengeCardProps {
  challenge: GlobalChallenge;
  onToggle: (id: string) => void;
  userCompleted: boolean;
}

const difficultyColors = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  extreme: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function GlobalChallengeCard({ challenge, onToggle, userCompleted }: GlobalChallengeCardProps) {
  const daysLeft = Math.ceil((challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;
  const completionRate = challenge.participantsCount > 0 
    ? Math.round((challenge.completedCount / challenge.participantsCount) * 100)
    : 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        userCompleted ? "glass-card opacity-70" : "glass-card neon-glow"
      )}
      onClick={() => onToggle(challenge.id)}
    >
      <div className="absolute inset-0 neon-gradient opacity-5" />
      
      {/* Global Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 font-bold shadow-lg">
          <TrendingUp className="w-3 h-3 mr-1" />
          GLOBAL
        </Badge>
      </div>
      
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-xs font-semibold", difficultyColors[challenge.difficulty])}>
                {challenge.difficulty.toUpperCase()}
              </Badge>
            </div>
            <h3 className={cn(
              "font-bold text-lg leading-tight pr-20",
              userCompleted && "line-through opacity-60"
            )}>
              {challenge.title}
            </h3>
          </div>
          
          {userCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {/* Description */}
        <p className={cn(
          "text-sm text-muted-foreground line-clamp-2",
          userCompleted && "opacity-60"
        )}>
          {challenge.description}
        </p>

        {/* Stats Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Completion Rate</span>
            <span className="font-semibold text-foreground">{completionRate}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-yellow-400">{challenge.stars}</span>
            </div>
            <div className={cn(
              "flex items-center gap-1.5",
              isOverdue && !userCompleted && "text-red-400"
            )}>
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {isOverdue ? "Overdue" : `${daysLeft}d`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-400">
              <Users className="w-4 h-4" />
              <span className="font-medium">{challenge.participantsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
