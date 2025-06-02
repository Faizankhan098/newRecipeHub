import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Users, Timer, Utensils } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-primary">RecipeHub</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="recipe-button-primary"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Collaborate on Recipes Like Never Before
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, share, and perfect recipes together. Scale ingredients automatically, 
            use built-in timers, and collaborate with fellow food enthusiasts in real-time.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="recipe-button-primary text-lg px-8 py-4"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Recipe Collaboration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <ChefHat className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Recipe Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create detailed recipes with ingredients, instructions, and photos. 
                  Give credit to original creators automatically.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Real-time Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Invite collaborators by email and edit recipes together. 
                  See live updates as others make changes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Timer className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Built-in Timers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Each cooking step can include a timer. Get visual and audio alerts 
                  when it's time for the next step.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 text-primary mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  ×2
                </div>
                <CardTitle>Auto Scaling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatically scale ingredient quantities when you adjust 
                  the number of servings. No math required!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            How RecipeHub Works
          </h3>
          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-900">Create Your Recipe</h4>
                <p className="text-gray-600">Add ingredients, instructions, and cooking times. Upload photos to make it come alive.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-900">Invite Collaborators</h4>
                <p className="text-gray-600">Send email invitations to friends, family, or fellow chefs to collaborate on perfecting the recipe.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-900">Cook Together</h4>
                <p className="text-gray-600">Use built-in timers, scale ingredients for any serving size, and see real-time updates from collaborators.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">RecipeHub</span>
          </div>
          <p className="text-gray-600">
            The collaborative recipe platform for modern kitchens
          </p>
        </div>
      </footer>
    </div>
  );
}
