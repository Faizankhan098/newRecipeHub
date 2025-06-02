import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import { Clock, Users, Eye, Heart, BookOpen, TrendingUp, Star, Search } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Recipe } from "@shared/schema";

export default function Discover() {
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

  const { data: publicRecipes, isLoading: recipesLoading, error } = useQuery<Recipe[]>({
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

  const featuredRecipes = [
    {
      id: 'featured-1',
      title: 'Classic Chocolate Chip Cookies',
      description: 'The perfect crispy-chewy chocolate chip cookies that everyone loves. A family recipe passed down through generations.',
      servings: 24,
      prepTime: 15,
      cookTime: 12,
      tags: ['Dessert', 'Cookies', 'Classic'],
      heroImageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
      isPublic: true,
      rating: 4.9,
      totalRatings: 234
    },
    {
      id: 'featured-2',
      title: 'Creamy Mushroom Risotto',
      description: 'Rich and creamy arborio rice cooked with wild mushrooms and finished with parmesan cheese.',
      servings: 4,
      prepTime: 10,
      cookTime: 25,
      tags: ['Italian', 'Vegetarian', 'Comfort Food'],
      heroImageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
      isPublic: true,
      rating: 4.7,
      totalRatings: 156
    },
    {
      id: 'featured-3',
      title: 'Spicy Thai Green Curry',
      description: 'Authentic Thai green curry with coconut milk, vegetables, and your choice of protein.',
      servings: 4,
      prepTime: 20,
      cookTime: 15,
      tags: ['Thai', 'Spicy', 'Curry'],
      heroImageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
      isPublic: true,
      rating: 4.8,
      totalRatings: 89
    }
  ];

  const categories = [
    { name: 'Quick & Easy', icon: '⚡', count: 127, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Healthy', icon: '🥗', count: 89, color: 'bg-green-100 text-green-800' },
    { name: 'Comfort Food', icon: '🍲', count: 156, color: 'bg-orange-100 text-orange-800' },
    { name: 'Desserts', icon: '🧁', count: 203, color: 'bg-pink-100 text-pink-800' },
    { name: 'International', icon: '🌍', count: 178, color: 'bg-blue-100 text-blue-800' },
    { name: 'Vegetarian', icon: '🌱', count: 134, color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore thousands of recipes shared by our community of passionate home cooks
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search recipes, ingredients, or cuisines..." 
              className="pl-10 pr-4 py-3"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">Public Recipes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">8,329</div>
              <div className="text-sm text-muted-foreground">Active Cooks</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">45,678</div>
              <div className="text-sm text-muted-foreground">Recipe Favorites</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">12,456</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-foreground text-sm">{category.name}</div>
                  <Badge variant="secondary" className={`mt-2 ${category.color}`}>
                    {category.count} recipes
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Featured Recipes</h2>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Star className="h-3 w-3 mr-1" />
              Editor's Choice
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="recipe-card cursor-pointer overflow-hidden"
                onClick={() => setLocation(`/recipes/${recipe.id}`)}
              >
                <div className="relative">
                  <div 
                    className="w-full h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${recipe.heroImageUrl})` }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{recipe.rating}</span>
                      <span className="text-xs">({recipe.totalRatings})</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Recipes */}
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Community Recipes</h2>
          
          {recipesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-32 bg-muted"></div>
                  <CardHeader className="pb-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Failed to load community recipes. Please try again.</p>
            </Card>
          ) : !publicRecipes || (publicRecipes as Recipe[]).length === 0 ? (
            <Card className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No public recipes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share a recipe with the community!
                </p>
                <Button 
                  onClick={() => setLocation("/recipes/new")}
                  className="recipe-button-primary"
                >
                  Create First Public Recipe
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(publicRecipes as Recipe[]).map((recipe) => (
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