import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Plus, Clock, Users, Eye, Star, TrendingUp, BookOpen, Heart } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Recipe } from "@shared/schema";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
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

  const { data: recipes, isLoading: recipesLoading, error } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
    retry: false,
  });

  const { data: publicRecipes } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes/public"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Recipes</h1>
              <p className="text-muted-foreground">Create, collaborate, and cook amazing recipes</p>
            </div>
            <Button 
              onClick={() => setLocation("/recipes/new")}
              className="recipe-button-primary shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Recipe
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center">
              <CardContent className="pt-4">
                <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">{(recipes as Recipe[])?.length || 0}</div>
                <div className="text-xs text-muted-foreground">My Recipes</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">12</div>
                <div className="text-xs text-muted-foreground">Collaborators</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">45</div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">8</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Recipes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Your Recipes</h2>
          
          {recipesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Failed to load recipes. Please try again.</p>
            </Card>
          ) : !recipes || (recipes as Recipe[]).length === 0 ? (
            <Card className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No recipes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first recipe to get started with collaborative cooking
                </p>
                <Button 
                  onClick={() => setLocation("/recipes/new")}
                  className="recipe-button-primary"
                >
                  Create Recipe
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(recipes as Recipe[]).map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="recipe-card cursor-pointer"
                  onClick={() => setLocation(`/recipes/${recipe.id}`)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {recipe.description}
                        </CardDescription>
                      </div>
                      {recipe.isPublic && (
                        <Badge variant="secondary" className="ml-2">
                          <Eye className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {recipe.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {recipe.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{recipe.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Public Recipes */}
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Discover Public Recipes</h2>
          
          {!publicRecipes || publicRecipes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No public recipes available yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {publicRecipes.slice(0, 8).map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="recipe-card cursor-pointer"
                  onClick={() => setLocation(`/recipes/${recipe.id}`)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base line-clamp-2">{recipe.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)}m</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
