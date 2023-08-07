import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import { Actions, ofType } from "@ngrx/effects";
import { map, of, switchMap, take } from "rxjs";
import { fetchRecipes, setRecipes } from "./store/recipe.actions";

@Injectable({
  providedIn: 'root',
})
export class RecipesResolver {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(fetchRecipes())
          return this.actions$.pipe(
            ofType(setRecipes),
            take(1)
          )
        } else {
          return of({recipes})
        }
      })
    )
  }
}
