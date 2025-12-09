"use client"

import { Challenge } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: Challenge;
  onToggle: (id: string) => void;
}

const difficultyColors = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  extreme: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function ChallengeCard({ challenge, onToggle }: ChallengeCardProps) {
  const daysLeft = Math.ceil((challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        challenge.completed ? "glass-card opacity-70" : "glass-card neon-glow"
      )}
      onClick={() => onToggle(challenge.id)}
    >
      <div className="absolute inset-0 neon-gradient opacity-5" />
      
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-xs font-semibold", difficultyColors[challenge.difficulty])}>
                {challenge.difficulty.toUpperCase()}
              </Badge>
              {challenge.isAI && (
                <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
            <h3 className={cn(
              "font-bold text-lg leading-tight",
              challenge.completed && "line-through opacity-60"
            )}>
              {challenge.title}
            </h3>
          </div>
          
          {challenge.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {/* Description */}
        <p className={cn(
          "text-sm text-muted-foreground line-clamp-2",
          challenge.completed && "opacity-60"
        )}>
          {challenge.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-yellow-400">{challenge.stars}</span>
            </div>
            <div className={cn(
              "flex items-center gap-1.5",
              isOverdue && !challenge.completed && "text-red-400"
            )}>
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {isOverdue ? "Overdue" : `${daysLeft}d`}
              </span>
            </div>
          </div>
          
          {challenge.createdBy && (
            <span className="text-xs text-muted-foreground">
              by {challenge.createdBy}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
