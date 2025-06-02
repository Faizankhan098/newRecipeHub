import {
  users,
  recipes,
  ingredients,
  instructions,
  collaborators,
  recipeActivity,
  type User,
  type UpsertUser,
  type Recipe,
  type InsertRecipe,
  type Ingredient,
  type InsertIngredient,
  type Instruction,
  type InsertInstruction,
  type Collaborator,
  type InsertCollaborator,
  type RecipeActivity,
  type RecipeWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Recipe operations
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  getRecipe(id: number): Promise<RecipeWithDetails | undefined>;
  getRecipesByUser(userId: string): Promise<Recipe[]>;
  getPublicRecipes(): Promise<Recipe[]>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;
  
  // Ingredient operations
  addIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  updateIngredient(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient>;
  deleteIngredient(id: number): Promise<void>;
  
  // Instruction operations
  addInstruction(instruction: InsertInstruction): Promise<Instruction>;
  updateInstruction(id: number, instruction: Partial<InsertInstruction>): Promise<Instruction>;
  deleteInstruction(id: number): Promise<void>;
  
  // Collaboration operations
  addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator>;
  removeCollaborator(recipeId: number, userId: string): Promise<void>;
  getCollaboratorPermission(recipeId: number, userId: string): Promise<string | null>;
  
  // Activity operations
  addActivity(recipeId: number, userId: string, action: string, description: string): Promise<RecipeActivity>;
  getRecentActivity(recipeId: number): Promise<(RecipeActivity & { user: User })[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Recipe operations
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db.insert(recipes).values(recipe).returning();
    
    // Add creator as owner in collaborators
    await db.insert(collaborators).values({
      recipeId: newRecipe.id,
      userId: recipe.createdBy,
      role: "owner",
      acceptedAt: new Date(),
    });

    // Add activity
    await this.addActivity(newRecipe.id, recipe.createdBy, "created", "Created this recipe");

    return newRecipe;
  }

  async getRecipe(id: number): Promise<RecipeWithDetails | undefined> {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));

    if (!recipe) return undefined;

    const [creator, originalCreator, recipeIngredients, recipeInstructions, recipeCollaborators, recentActivity] = await Promise.all([
      db.select().from(users).where(eq(users.id, recipe.createdBy)).then(rows => rows[0]),
      db.select().from(users).where(eq(users.id, recipe.originalCreator)).then(rows => rows[0]),
      db.select().from(ingredients).where(eq(ingredients.recipeId, id)).orderBy(ingredients.order),
      db.select().from(instructions).where(eq(instructions.recipeId, id)).orderBy(instructions.stepNumber),
      db.select({
        id: collaborators.id,
        recipeId: collaborators.recipeId,
        userId: collaborators.userId,
        role: collaborators.role,
        invitedAt: collaborators.invitedAt,
        acceptedAt: collaborators.acceptedAt,
        user: users,
      }).from(collaborators)
        .innerJoin(users, eq(collaborators.userId, users.id))
        .where(eq(collaborators.recipeId, id)),
      this.getRecentActivity(id),
    ]);

    return {
      ...recipe,
      creator: creator!,
      originalCreator: originalCreator!,
      ingredients: recipeIngredients,
      instructions: recipeInstructions,
      collaborators: recipeCollaborators,
      activities: recentActivity,
    };
  }

  async getRecipesByUser(userId: string): Promise<Recipe[]> {
    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.createdBy, userId))
      .orderBy(desc(recipes.updatedAt));
    
    return userRecipes;
  }

  async getPublicRecipes(): Promise<Recipe[]> {
    return await db
      .select()
      .from(recipes)
      .where(eq(recipes.isPublic, true))
      .orderBy(desc(recipes.updatedAt));
  }

  async updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe> {
    const [updated] = await db
      .update(recipes)
      .set({ ...recipe, updatedAt: new Date() })
      .where(eq(recipes.id, id))
      .returning();
    return updated;
  }

  async deleteRecipe(id: number): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, id));
  }

  // Ingredient operations
  async addIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const [newIngredient] = await db.insert(ingredients).values(ingredient).returning();
    return newIngredient;
  }

  async updateIngredient(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient> {
    const [updated] = await db
      .update(ingredients)
      .set(ingredient)
      .where(eq(ingredients.id, id))
      .returning();
    return updated;
  }

  async deleteIngredient(id: number): Promise<void> {
    await db.delete(ingredients).where(eq(ingredients.id, id));
  }

  // Instruction operations
  async addInstruction(instruction: InsertInstruction): Promise<Instruction> {
    const [newInstruction] = await db.insert(instructions).values(instruction).returning();
    return newInstruction;
  }

  async updateInstruction(id: number, instruction: Partial<InsertInstruction>): Promise<Instruction> {
    const [updated] = await db
      .update(instructions)
      .set(instruction)
      .where(eq(instructions.id, id))
      .returning();
    return updated;
  }

  async deleteInstruction(id: number): Promise<void> {
    await db.delete(instructions).where(eq(instructions.id, id));
  }

  // Collaboration operations
  async addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator> {
    const [newCollaborator] = await db.insert(collaborators).values(collaborator).returning();
    return newCollaborator;
  }

  async removeCollaborator(recipeId: number, userId: string): Promise<void> {
    await db
      .delete(collaborators)
      .where(and(eq(collaborators.recipeId, recipeId), eq(collaborators.userId, userId)));
  }

  async getCollaboratorPermission(recipeId: number, userId: string): Promise<string | null> {
    const [collaborator] = await db
      .select()
      .from(collaborators)
      .where(and(eq(collaborators.recipeId, recipeId), eq(collaborators.userId, userId)));
    
    return collaborator?.role || null;
  }

  // Activity operations
  async addActivity(recipeId: number, userId: string, action: string, description: string): Promise<RecipeActivity> {
    const [activity] = await db.insert(recipeActivity).values({
      recipeId,
      userId,
      action,
      description,
    }).returning();
    return activity;
  }

  async getRecentActivity(recipeId: number): Promise<(RecipeActivity & { user: User })[]> {
    return await db
      .select({
        id: recipeActivity.id,
        recipeId: recipeActivity.recipeId,
        userId: recipeActivity.userId,
        action: recipeActivity.action,
        description: recipeActivity.description,
        createdAt: recipeActivity.createdAt,
        user: users,
      })
      .from(recipeActivity)
      .innerJoin(users, eq(recipeActivity.userId, users.id))
      .where(eq(recipeActivity.recipeId, recipeId))
      .orderBy(desc(recipeActivity.createdAt))
      .limit(10);
  }
}

export const storage = new DatabaseStorage();
