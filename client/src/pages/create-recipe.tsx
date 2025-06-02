import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function CreateRecipe() {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Recipe</h1>
          <p className="text-muted-foreground">
            Share your culinary creation with the world. Add detailed ingredients, 
            step-by-step instructions, and invite collaborators to perfect it together.
          </p>
        </div>

        <RecipeForm
          onSuccess={(recipe) => {
            toast({
              title: "Recipe created!",
              description: "Your recipe has been created successfully.",
            });
            setLocation(`/recipes/${recipe.id}`);
          }}
          onError={(error) => {
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
            toast({
              title: "Error",
              description: "Failed to create recipe. Please try again.",
              variant: "destructive",
            });
          }}
        />
      </main>
    </div>
  );
}
