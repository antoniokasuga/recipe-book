import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Skillet Lasagna',
  //     'A mediocre lasagna',
  //     'https://d33wubrfki0l68.cloudfront.net/89039f3824ad5d647fecf83c70b430d05d50e698/8c5a4/images/uploads/2021_12_20_skillet_lasagna_0.jpg',
  //     [
  //       new Ingredient('Lasagna noodles', 12),
  //       new Ingredient('Onion', 1),
  //       new Ingredient('Garlic Clove', 4),
  //       new Ingredient('Sauce', 1),
  //     ]),
  //   new Recipe(
  //     'Italian Pizza',
  //     'A do-it-yourself pizza',
  //     'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
  //     [
  //       new Ingredient('Frozen pizza base', 1),
  //       new Ingredient('Tomato', 3),
  //       new Ingredient('Cheese', 1),
  //       new Ingredient('Sauce', 1),
  //     ]),
  // ];
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {
  };

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
