import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { Utensils, Plus, LogOut, User, Settings } from "lucide-react";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white dark:bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">RecipeHub</h1>
            </Link>
          </div>
          
          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  My Recipes
                </a>
              </Link>
              <Link href="/discover">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === '/discover' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Discover
                </a>
              </Link>
              <Link href="/collaborations">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === '/collaborations' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Collaborations
                </a>
              </Link>
            </div>
          )}
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={() => setLocation("/recipes/new")}
                  className="recipe-button-primary hidden sm:flex"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Recipe
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.email || 'User'} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.firstName?.[0]}{user?.lastName?.[0] || user?.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user?.firstName && user?.lastName && (
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                        )}
                        {user?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => window.location.href = '/api/logout'}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="recipe-button-primary"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
