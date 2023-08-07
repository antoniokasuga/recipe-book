import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import { logout } from "../auth/store/auth.actions";
import { fetchRecipes, storeRecipes } from "../recipes/store/recipe.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false
  private userSubscription: Subscription

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
  ) {
  }

  onSaveData() {
    this.store.dispatch(storeRecipes())
  }

  onFetchData() {
    this.store.dispatch(fetchRecipes())
  }

  ngOnInit(): void {
    this.userSubscription = this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user
      })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

  onLogout() {
    this.store.dispatch(logout())
  }
}
