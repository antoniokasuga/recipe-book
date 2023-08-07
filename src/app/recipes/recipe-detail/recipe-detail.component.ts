import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app.reducer";
import { map, switchMap } from "rxjs";
import { deleteRecipe } from "../store/recipe.actions";
import { addIngredients } from "../../shopping-list/store/shopping-list.actions";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(params => {
          return +params['id']
        }),
        switchMap(id => {
          this.id = id
          return this.store.select('recipes')
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id
          })
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe
      })
  }

  onAddToShoppingList() {
    this.store.dispatch(addIngredients({ingredients: this.recipe.ingredients}))
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute})
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({index: this.id}))
    this.router.navigate(['/recipes'])
  }
}
