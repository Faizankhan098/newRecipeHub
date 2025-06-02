import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Users, Timer, Utensils, Star, Play, Sparkles, GitBranch } from "lucide-react";

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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              GitHub for Recipes
            </Badge>
            <h2 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Collaborate on Recipes<br />
              <span className="text-primary">Like Never Before</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create, share, and perfect recipes together. Scale ingredients automatically, 
              use built-in timers, and collaborate with fellow food enthusiasts in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="recipe-button-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Play className="h-5 w-5 mr-2" />
                Get Started Free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4"
              >
                <GitBranch className="h-5 w-5 mr-2" />
                See How It Works
              </Button>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-sm font-medium text-gray-600">RecipeHub - Chocolate Chip Cookies</div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Grandma's Chocolate Chip Cookies</h3>
                        <p className="text-sm text-gray-600">by Sarah Johnson • 2 collaborators</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">2 cups all-purpose flour</span>
                        <Badge variant="outline" className="text-xs">Auto-scaled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">1 cup butter, softened</span>
                        <Badge variant="outline" className="text-xs">Auto-scaled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-primary/5 border-l-4 border-primary rounded-lg">
                        <span className="text-sm font-medium">Step 3: Bake for 10 minutes</span>
                        <Badge className="text-xs bg-primary text-white">
                          <Timer className="h-3 w-3 mr-1" />
                          Timer: 8:24
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Live Collaboration</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">S</div>
                          <span className="text-xs text-blue-800">Sarah updated ingredients</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium">M</div>
                          <span className="text-xs text-blue-800">Mike added timer to step 3</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-2xl">🔢</div>
                        <span className="text-sm font-medium text-green-900">Smart Scaling</span>
                      </div>
                      <p className="text-xs text-green-800">Serves: 12 → 24 cookies</p>
                      <p className="text-xs text-green-700 mt-1">All ingredients automatically doubled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
