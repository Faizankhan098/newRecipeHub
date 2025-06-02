import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from "lucide-react";
import type { Ingredient } from "@shared/schema";

interface IngredientScalerProps {
  ingredients: Ingredient[];
  originalServings: number;
  currentServings: number;
  onServingsChange: (servings: number) => void;
  scaleQuantity: (originalQuantity: string, originalServings: number, newServings: number) => string;
}

export function IngredientScaler({
  ingredients,
  originalServings,
  currentServings,
  onServingsChange,
  scaleQuantity,
}: IngredientScalerProps) {
  const increaseServings = () => {
    onServingsChange(currentServings + 1);
  };

  const decreaseServings = () => {
    if (currentServings > 1) {
      onServingsChange(currentServings - 1);
    }
  };

  return (
    <Card className="recipe-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Ingredients</CardTitle>
          
          {/* Servings Scaler */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground">Servings:</span>
            <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseServings}
                disabled={currentServings <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{currentServings}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseServings}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {ingredients.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No ingredients added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ingredients.map((ingredient) => {
              const scaledQuantity = scaleQuantity(
                `${ingredient.quantity}${ingredient.unit}`,
                originalServings,
                currentServings
              );

              return (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox id={`ingredient-${ingredient.id}`} />
                    <label
                      htmlFor={`ingredient-${ingredient.id}`}
                      className="font-medium text-foreground cursor-pointer"
                    >
                      {ingredient.name}
                    </label>
                  </div>
                  <span className="font-mono text-sm font-medium text-muted-foreground">
                    {scaledQuantity}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
