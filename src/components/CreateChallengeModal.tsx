"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { Challenge, Difficulty } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface CreateChallengeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChallenge: (challenge: Omit<Challenge, 'id' | 'completed'>) => void;
}

export function CreateChallengeModal({ open, onOpenChange, onCreateChallenge }: CreateChallengeModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [duration, setDuration] = useState("7");

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    
    try {
      const generated = await apiClient.generateChallenge({
        difficulty: difficulty,
      });
      
      setTitle(generated.title);
      setDescription(generated.description);
      setDifficulty(generated.difficulty as Difficulty);
      setDuration("7");
    } catch (error) {
      console.error('Failed to generate AI challenge:', error);
      toast.error('Failed to generate challenge');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreate = () => {
    if (!title || !description) return;

    const stars = {
      easy: 3,
      medium: 5,
      hard: 8,
      extreme: 10,
    }[difficulty];

    onCreateChallenge({
      title,
      description,
      difficulty,
      stars,
      deadline: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000),
      isAI: false,
    });

    setTitle("");
    setDescription("");
    setDifficulty("medium");
    setDuration("7");
    onOpenChange(false);
  };

  const handleCreateAI = () => {
    if (!title || !description) return;

    const stars = {
      easy: 3,
      medium: 5,
      hard: 8,
      extreme: 10,
    }[difficulty];

    onCreateChallenge({
      title,
      description,
      difficulty,
      stars,
      deadline: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000),
      isAI: true,
    });

    setTitle("");
    setDescription("");
    setDifficulty("medium");
    setDuration("7");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card neon-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold neon-gradient-text">
            Create Challenge
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">
              <Plus className="w-4 h-4 mr-2" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                placeholder="Enter challenge title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your challenge"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/50 min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger id="difficulty" className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (3⭐)</SelectItem>
                    <SelectItem value="medium">Medium (5⭐)</SelectItem>
                    <SelectItem value="hard">Hard (8⭐)</SelectItem>
                    <SelectItem value="extreme">Extreme (10⭐)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration" className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCreate}
              className="w-full neon-gradient hover:opacity-90 font-semibold"
              disabled={!title || !description}
            >
              Create Challenge
            </Button>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="text-center space-y-4 py-8">
              <div className="w-20 h-20 mx-auto rounded-full neon-gradient flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <p className="text-muted-foreground">
                Let AI generate a creative challenge for you
              </p>
              <Button
                onClick={handleGenerateAI}
                className="neon-gradient hover:opacity-90 font-semibold"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Challenge
                  </>
                )}
              </Button>
            </div>

            {title && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-title">Challenge Title</Label>
                  <Input
                    id="ai-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-description">Description</Label>
                  <Textarea
                    id="ai-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-secondary/50 min-h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                      <SelectTrigger id="ai-difficulty" className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (3⭐)</SelectItem>
                        <SelectItem value="medium">Medium (5⭐)</SelectItem>
                        <SelectItem value="hard">Hard (8⭐)</SelectItem>
                        <SelectItem value="extreme">Extreme (10⭐)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-duration">Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="ai-duration" className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleCreateAI}
                  className="w-full neon-gradient hover:opacity-90 font-semibold"
                >
                  Create AI Challenge
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
