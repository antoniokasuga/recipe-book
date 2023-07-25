import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import { clearError, loginStart, signupStart } from "./store/auth.actions";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true
  isLoading = false
  error: string = null
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription
  private storeSub: Subscription

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading
      this.error = authState.authError
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return
    }
    const email = form.value.email
    const password = form.value.password

    if (this.isLoginMode) {
      this.store.dispatch(
        loginStart({
          email: email,
          password: password
        })
      )
    } else {
      this.store.dispatch(
        signupStart({
          email: email,
          password: password
        })
      )
    }

    form.reset()
  }

  onHandleError() {
    this.store.dispatch(clearError())
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }

  private showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear()

    const componentRef = hostViewContainerRef.createComponent<AlertComponent>(AlertComponent)

    componentRef.instance.message = message
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainerRef.clear()
    })
  }
}
