import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "./store/app.reducer";
import { autoLogin } from "./auth/store/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: 'Angular Course Project';

  constructor(
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(autoLogin())
  }

}
