"use client"

import { useState, useMemo, useEffect } from "react";
import { Challenge, GlobalChallenge, LeaderboardEntry } from "@/lib/types";
import { ChallengeCard } from "@/components/ChallengeCard";
import { CreateChallengeModal } from "@/components/CreateChallengeModal";
import { BottomNav } from "@/components/BottomNav";
import { ProfileView } from "@/components/ProfileView";
import { ArenaView } from "@/components/ArenaView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Share2, QrCode, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeModal } from "@/components/QRCodeModal";
import { QRScannerModal } from "@/components/QRScannerModal";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { apiClient } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'profile' | 'arena'>('home');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareQR, setShowShareQR] = useState(false);
  const [showScannerQR, setShowScannerQR] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  const {
    loading,
    challenges,
    globalChallenges,
    profile,
    leaderboard,
    completedGlobalChallenges,
    toggleChallenge,
    toggleGlobalChallenge,
    createChallenge,
    loadChallenges,
  } = useApi();

  // Reload challenges when filter changes
  useEffect(() => {
    if (profile && activeTab === 'home') {
      loadChallenges(filterTab === 'all' ? undefined : filterTab);
    }
  }, [filterTab, profile, activeTab, loadChallenges]);

  const filteredChallenges = useMemo(() => {
    if (filterTab === 'all') return challenges;
    if (filterTab === 'active') return challenges.filter(c => !c.completed);
    return challenges.filter(c => c.completed);
  }, [challenges, filterTab]);

  const handleToggleChallenge = async (id: string) => {
    await toggleChallenge(id);
    // Reload challenges to get updated state
    await loadChallenges(filterTab === 'all' ? undefined : filterTab);
  };

  const handleToggleGlobalChallenge = async (id: string) => {
    await toggleGlobalChallenge(id);
  };

  const handleCreateChallenge = async (newChallenge: Omit<Challenge, 'id' | 'completed'>) => {
    try {
      await createChallenge(newChallenge);
      setShowCreateModal(false);
      await loadChallenges(filterTab === 'all' ? undefined : filterTab);
    } catch (error) {
      // Error already handled in createChallenge
    }
  };

  const handleShareChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowShareQR(true);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
    setActiveTab('home');
  };

  const handleScanSuccess = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.type === 'challenge') {
        if (!profile) return;
        
        // Check if challenge already exists
        const exists = challenges.find(c => c.id === parsed.id);
        if (exists) {
          toast.info('У вас уже есть этот челлендж!');
          return;
        }

        // Assign the scanned challenge
        try {
          await apiClient.assignChallenge(parsed.id, profile.id);
          await loadChallenges(filterTab === 'all' ? undefined : filterTab);
          toast.success(`Челлендж "${parsed.title}" добавлен! 🎉`);
        } catch (error: any) {
          if (error.message?.includes('already assigned')) {
            toast.info('У вас уже есть этот челлендж!');
          } else {
            throw error;
          }
        }
      } else if (parsed.type === 'profile') {
        // Show profile information
        toast.success(`Профиль участника: ${parsed.name}\n⭐ ${parsed.totalStars} звезд\n✅ ${parsed.completedChallenges} выполнено`);
      } else {
        toast.error('Неизвестный тип QR-кода');
      }
    } catch (err) {
      console.error('Error parsing QR data:', err);
      toast.error('Не удалось прочитать QR-код');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black">
                    <span className="text-[#3BDBEB]">Win</span>
                    {" "}
                    <span className="text-white">Place</span>
                    {" "}
                    <span className="neon-gradient-text">Arena</span>
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Push your limits, earn stars ⭐
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="neon-border relative z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('QR Scanner button clicked');
                      setShowScannerQR(true);
                    }}
                  >
                    <QrCode className="w-5 h-5 text-purple-400" />
                  </Button>
                  <Badge className="text-lg px-4 py-2 bg-purple-500/20 text-purple-400 border-purple-500/30 neon-glow">
                    {profile?.totalStars || 0} ⭐
                  </Badge>
                </div>
              </div>

              {/* Filter Tabs */}
              <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="all">
                    All ({challenges.length})
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    Active ({challenges.filter(c => !c.completed).length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Done ({challenges.filter(c => c.completed).length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Challenges List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-400" />
                  <p className="text-muted-foreground mt-4">Загрузка...</p>
                </div>
              ) : filteredChallenges.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Filter className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">No challenges here</p>
                    <p className="text-muted-foreground text-sm">
                      {filterTab === 'completed' 
                        ? 'Complete some challenges to see them here'
                        : 'Create your first challenge to get started'}
                    </p>
                  </div>
                </div>
              ) : (
                filteredChallenges.map(challenge => (
                  <div key={challenge.id} className="relative group">
                    <ChallengeCard
                      challenge={challenge}
                      onToggle={handleToggleChallenge}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareChallenge(challenge);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'arena' && profile && (
          <ArenaView
            globalChallenges={globalChallenges as GlobalChallenge[]}
            leaderboard={leaderboard}
            currentUserId={profile.id}
            completedGlobalChallenges={completedGlobalChallenges}
            onToggleGlobalChallenge={handleToggleGlobalChallenge}
          />
        )}

        {activeTab === 'profile' && profile && (
          <ProfileView profile={profile} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'create') {
            handleCreateClick();
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Modals */}
      <CreateChallengeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateChallenge={handleCreateChallenge}
      />

      {selectedChallenge && (
        <QRCodeModal
          open={showShareQR}
          onOpenChange={setShowShareQR}
          data={JSON.stringify({
            type: 'challenge',
            id: selectedChallenge.id,
            title: selectedChallenge.title,
            description: selectedChallenge.description,
            difficulty: selectedChallenge.difficulty,
            stars: selectedChallenge.stars,
          })}
          title="Share Challenge"
          description="Share this challenge with friends via QR code"
        />
      )}

      <QRScannerModal
        open={showScannerQR}
        onOpenChange={setShowScannerQR}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}