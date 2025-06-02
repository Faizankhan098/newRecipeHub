import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  originalCreator: varchar("original_creator").notNull().references(() => users.id),
  servings: integer("servings").notNull().default(4),
  prepTime: integer("prep_time"), // in minutes
  cookTime: integer("cook_time"), // in minutes
  tags: text("tags").array().default([]),
  isPublic: boolean("is_public").default(false),
  heroImageUrl: text("hero_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  unit: text("unit").notNull(),
  order: integer("order").notNull(),
});

export const instructions = pgTable("instructions", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
  stepNumber: integer("step_number").notNull(),
  instruction: text("instruction").notNull(),
  timerMinutes: integer("timer_minutes"), // optional timer for this step
  createdAt: timestamp("created_at").defaultNow(),
});

export const collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("editor"), // "owner", "editor", "viewer"
  invitedAt: timestamp("invited_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
});

export const recipeActivity = pgTable("recipe_activity", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // "created", "updated_ingredients", "updated_instructions", "added_timer", etc.
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdRecipes: many(recipes, { relationName: "createdRecipes" }),
  originalRecipes: many(recipes, { relationName: "originalRecipes" }),
  collaborations: many(collaborators),
  activities: many(recipeActivity),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  creator: one(users, {
    fields: [recipes.createdBy],
    references: [users.id],
    relationName: "createdRecipes",
  }),
  originalCreator: one(users, {
    fields: [recipes.originalCreator],
    references: [users.id],
    relationName: "originalRecipes",
  }),
  ingredients: many(ingredients),
  instructions: many(instructions),
  collaborators: many(collaborators),
  activities: many(recipeActivity),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [ingredients.recipeId],
    references: [recipes.id],
  }),
}));

export const instructionsRelations = relations(instructions, ({ one }) => ({
  recipe: one(recipes, {
    fields: [instructions.recipeId],
    references: [recipes.id],
  }),
}));

export const collaboratorsRelations = relations(collaborators, ({ one }) => ({
  recipe: one(recipes, {
    fields: [collaborators.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [collaborators.userId],
    references: [users.id],
  }),
}));

export const recipeActivityRelations = relations(recipeActivity, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeActivity.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [recipeActivity.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
});

export const insertInstructionSchema = createInsertSchema(instructions).omit({
  id: true,
  createdAt: true,
});

export const insertCollaboratorSchema = createInsertSchema(collaborators).omit({
  id: true,
  invitedAt: true,
  acceptedAt: true,
});

export const inviteCollaboratorSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]).default("editor"),
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Instruction = typeof instructions.$inferSelect;
export type InsertInstruction = z.infer<typeof insertInstructionSchema>;
export type Collaborator = typeof collaborators.$inferSelect;
export type InsertCollaborator = z.infer<typeof insertCollaboratorSchema>;
export type RecipeActivity = typeof recipeActivity.$inferSelect;
export type InviteCollaborator = z.infer<typeof inviteCollaboratorSchema>;

// Extended types for API responses
export type RecipeWithDetails = Recipe & {
  creator: User;
  originalCreator: User;
  ingredients: Ingredient[];
  instructions: Instruction[];
  collaborators: (Collaborator & { user: User })[];
  activities: (RecipeActivity & { user: User })[];
};
