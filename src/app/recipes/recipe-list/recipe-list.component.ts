import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a test', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/tricolore-skillet-lasagna2-1650652993.jpg'),
    new Recipe('Another Test Recipe', 'This is simply another test', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/tricolore-skillet-lasagna2-1650652993.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe)
  }

}
