import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const addRecipe = createAction(
  '[Recipes] Add Recipe',
  props<{
    recipe: Recipe
  }>()
)

export const deleteRecipe = createAction(
  '[Recipes] Delete Recipe',
  props<{
    index: number
  }>()
)

export const updateRecipe = createAction(
  '[Recipes] Update Recipe',
  props<{
    index: number,
    recipe: Recipe
  }>()
)

export const setRecipes = createAction(
  '[Recipes] Set Recipes',
  props<{
    recipes: Recipe[]
  }>()
)

export const fetchRecipes = createAction(
  '[Recipe] Fetch Recipes'
);


export const storeRecipes = createAction(
  '[Recipe] Store Recipes'
);
