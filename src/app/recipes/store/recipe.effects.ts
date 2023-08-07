import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import { AppState } from '../../store/app.reducer';
import { fetchRecipes, setRecipes, storeRecipes } from "./recipe.actions";


@Injectable()
export class RecipeEffects {

  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://ng-course-recipe-book-a715a-default-rtdb.firebaseio.com/recipes.json'
        )
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        })
      }),
      map(recipes => {
        return setRecipes({recipes})
      })
    )
  )


  storeRecipes$ = createEffect(() =>
      this.actions$.pipe(
        ofType(storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            'https://ng-course-recipe-book-a715a-default-rtdb.firebaseio.com/recipes.json',
            recipesState.recipes
          )
        })
      ),
    {dispatch: false}
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {
  }
}
