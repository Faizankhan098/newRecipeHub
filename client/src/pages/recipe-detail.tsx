import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation } from "@/components/navigation";
import { TimerWidget } from "@/components/timer-widget";
import { IngredientScaler } from "@/components/ingredient-scaler";
import { CollaborationPanel } from "@/components/collaboration-panel";
import { Clock, Users, Play, UserPlus, Share, Bookmark, Printer } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { RecipeWithDetails } from "@shared/schema";

export default function RecipeDetail() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [match, params] = useRoute("/recipes/:id");
  const [currentServings, setCurrentServings] = useState(4);
  const [activeTimer, setActiveTimer] = useState<{
    id: string;
    stepNumber: number;
    description: string;
    totalMinutes: number;
    remainingSeconds: number;
  } | null>(null);

  const recipeId = params?.id ? parseInt(params.id) : null;

  // Redirect to login if not authenticated and trying to access private recipe
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: recipe, isLoading: recipeLoading, error } = useQuery<RecipeWithDetails>({
    queryKey: ["/api/recipes", recipeId],
    enabled: !!recipeId,
    retry: false,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  useEffect(() => {
    if (recipe) {
      setCurrentServings(recipe.servings);
    }
  }, [recipe]);

  const startTimer = (stepNumber: number, minutes: number, description: string) => {
    if (activeTimer) {
      toast({
        title: "Timer already active",
        description: "Please stop the current timer before starting a new one.",
        variant: "destructive",
      });
      return;
    }

    const timerId = Date.now().toString();
    setActiveTimer({
      id: timerId,
      stepNumber,
      description,
      totalMinutes: minutes,
      remainingSeconds: minutes * 60,
    });
  };

  const stopTimer = () => {
    setActiveTimer(null);
  };

  const scaleQuantity = (originalQuantity: string, originalServings: number, newServings: number): string => {
    const ratio = newServings / originalServings;
    const numericPart = parseFloat(originalQuantity);
    
    if (isNaN(numericPart)) {
      return originalQuantity; // Return as-is if not a number
    }
    
    const scaledValue = numericPart * ratio;
    const textPart = originalQuantity.replace(numericPart.toString(), '');
    
    // Round to reasonable precision
    if (scaledValue < 1) {
      return `${Math.round(scaledValue * 100) / 100}${textPart}`;
    } else if (scaledValue < 10) {
      return `${Math.round(scaledValue * 10) / 10}${textPart}`;
    } else {
      return `${Math.round(scaledValue)}${textPart}`;
    }
  };

  if (isLoading || recipeLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded-xl"></div>
                <div className="h-32 bg-muted rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-muted rounded-xl"></div>
                <div className="h-48 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Recipe not found</h2>
            <p className="text-muted-foreground">The recipe you're looking for doesn't exist or you don't have permission to view it.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <Card className="recipe-card">
              {recipe.heroImageUrl && (
                <div className="w-full h-64 bg-cover bg-center rounded-t-xl" 
                     style={{ backgroundImage: `url(${recipe.heroImageUrl})` }} />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{recipe.title}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{recipe.description}</p>
                    
                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Collaboration Status */}
                  <div className="ml-6 text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex -space-x-2">
                        {recipe.collaborators.slice(0, 3).map((collab) => (
                          <Avatar key={collab.id} className="w-8 h-8 border-2 border-white">
                            <AvatarImage src={collab.user.profileImageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {collab.user.firstName?.[0]}{collab.user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {recipe.collaborators.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                              +{recipe.collaborators.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{recipe.collaborators.length} collaborators</p>
                  </div>
                </div>
                
                {/* Recipe Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Prep Time</p>
                    <p className="font-semibold">{recipe.prepTime || 0} min</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Cook Time</p>
                    <p className="font-semibold">{recipe.cookTime || 0} min</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Servings</p>
                    <p className="font-semibold">{currentServings}</p>
                  </div>
                  <div className="text-center">
                    <div className="h-5 w-5 text-primary mx-auto mb-1 flex items-center justify-center">
                      ⭐
                    </div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-semibold">4.8/5</p>
                  </div>
                </div>
                
                {/* Attribution */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Originally created by</span>
                    <span className="font-medium text-foreground">
                      {recipe.originalCreator.firstName} {recipe.originalCreator.lastName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Last updated 2 hours ago</span>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Ingredients */}
            <IngredientScaler
              ingredients={recipe.ingredients}
              originalServings={recipe.servings}
              currentServings={currentServings}
              onServingsChange={setCurrentServings}
              scaleQuantity={scaleQuantity}
            />

            {/* Instructions */}
            <Card className="recipe-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Instructions</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Total time: <span className="font-medium">{(recipe.prepTime || 0) + (recipe.cookTime || 0)} minutes</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div 
                      key={instruction.id} 
                      className={`flex space-x-4 p-4 rounded-lg transition-colors ${
                        activeTimer?.stepNumber === instruction.stepNumber 
                          ? 'timer-active' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          activeTimer?.stepNumber === instruction.stepNumber
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {instruction.stepNumber}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed mb-2">
                          {instruction.instruction}
                        </p>
                        {instruction.timerMinutes && (
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{instruction.timerMinutes} min</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startTimer(
                                instruction.stepNumber, 
                                instruction.timerMinutes!, 
                                instruction.instruction.substring(0, 50) + '...'
                              )}
                              disabled={!!activeTimer}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start Timer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Timer */}
            {activeTimer && (
              <TimerWidget
                timer={activeTimer}
                onTimerUpdate={setActiveTimer}
                onTimerComplete={stopTimer}
              />
            )}

            {/* Recipe Actions */}
            <Card className="recipe-card">
              <CardHeader>
                <CardTitle>Recipe Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Recipe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  Share Recipe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Recipe
                </Button>
              </CardContent>
            </Card>

            {/* Collaboration Panel */}
            <CollaborationPanel
              recipe={recipe}
              onInviteCollaborator={(email) => {
                toast({
                  title: "Invitation sent",
                  description: `Invitation sent to ${email}`,
                });
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
