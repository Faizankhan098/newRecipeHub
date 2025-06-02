import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserPlus, RefreshCw, Send } from "lucide-react";
import type { RecipeWithDetails } from "@shared/schema";

interface CollaborationPanelProps {
  recipe: RecipeWithDetails;
  onInviteCollaborator: (email: string) => void;
}

export function CollaborationPanel({ recipe, onInviteCollaborator }: CollaborationPanelProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    setIsInviting(true);
    try {
      await onInviteCollaborator(inviteEmail);
      setInviteEmail("");
    } finally {
      setIsInviting(false);
    }
  };

  const handleSync = () => {
    // In a real app, this would trigger a refetch of the recipe data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Collaborators */}
      <Card className="recipe-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Collaborators</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleSync}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Sync
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recipe.collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={collaborator.user.profileImageUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {collaborator.user.firstName?.[0]}{collaborator.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {collaborator.user.firstName} {collaborator.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {collaborator.role === "owner" ? "Owner" : "Can edit"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {collaborator.role === "owner" && (
                    <Badge variant="secondary" className="text-xs">
                      Creator
                    </Badge>
                  )}
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      Math.random() > 0.5 ? 'bg-green-500' : 'bg-gray-400'
                    }`} 
                    title={Math.random() > 0.5 ? "Online" : "Offline"}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Invite New Collaborator */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleInvite();
                  }
                }}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || isInviting}
                className="recipe-button-accent"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="recipe-card">
        <CardHeader>
          <CardTitle>Recent Changes</CardTitle>
        </CardHeader>
        <CardContent>
          {recipe.activities.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {recipe.activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">
                        {activity.user.firstName} {activity.user.lastName}
                      </span>{" "}
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
