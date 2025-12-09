"use client"

import { UserProfile } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trophy, Lock, Unlock, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { QRCodeModal } from "./QRCodeModal";

interface ProfileViewProps {
  profile: UserProfile;
}

export function ProfileView({ profile }: ProfileViewProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <Card className="glass-card neon-border overflow-hidden">
        <div className="relative h-32 neon-gradient" />
        <div className="relative px-6 pb-6">
          <div className="flex flex-col items-center -mt-16">
            <div className="w-32 h-32 rounded-full neon-gradient neon-glow flex items-center justify-center border-4 border-background">
              <span className="text-5xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold neon-gradient-text">{profile.name}</h2>
            {profile.canPublish && (
              <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Unlock className="w-3 h-3 mr-1" />
                Publisher Unlocked
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card p-6 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full neon-gradient flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold neon-gradient-text">{profile.completedChallenges}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </Card>

        <Card className="glass-card p-6 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full neon-gradient flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold neon-gradient-text">{profile.totalStars}</p>
            <p className="text-sm text-muted-foreground">Total Stars</p>
          </div>
        </Card>
      </div>

      {/* Publisher Status */}
      <Card className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          {profile.canPublish ? (
            <Unlock className="w-5 h-5 text-green-400" />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold">Community Publisher</h3>
            <p className="text-sm text-muted-foreground">
              {profile.canPublish
                ? "You can now publish challenges for others!"
                : `Complete ${5 - profile.completedChallenges} more challenges to unlock`}
            </p>
          </div>
        </div>

        {!profile.canPublish && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-semibold">{profile.completedChallenges}/5</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full neon-gradient transition-all duration-500"
                style={{ width: `${(profile.completedChallenges / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Share Profile */}
      <Button
        onClick={() => setShowQR(true)}
        className="w-full neon-gradient hover:opacity-90 font-semibold h-12"
      >
        <QrCode className="w-5 h-5 mr-2" />
        Share Profile QR Code
      </Button>

      <QRCodeModal
        open={showQR}
        onOpenChange={setShowQR}
        data={JSON.stringify({ 
          type: 'profile', 
          userId: profile.id, 
          name: profile.name,
          totalStars: profile.totalStars,
          completedChallenges: profile.completedChallenges
        })}
        title="Profile QR Code"
        description="Share this QR code to connect with others"
      />
    </div>
  );
}