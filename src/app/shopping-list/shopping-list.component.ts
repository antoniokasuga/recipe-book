import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { startEdit } from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>,
  ) {
  }

  ngOnInit(): void {
    this.ingredients$ = this.store.select('shoppingList')
  }

  onEditItem(index: number) {
    this.store.dispatch(startEdit({ index: index}))
  }
}
