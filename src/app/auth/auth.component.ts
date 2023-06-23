import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {AlertComponent} from '../shared/alert/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';
import {AuthResponseData, AuthService} from './auth.service';

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

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
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

    let authObservable: Observable<AuthResponseData>

    this.isLoading = true;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password)
    } else {
      authObservable = this.authService.signup(email, password)
    }

    authObservable.subscribe({
      next: responseData => {
        console.log(responseData)
        this.isLoading = false
        this.router.navigate(['/recipes'])
      },
      error: errorMessage => {
        console.log(errorMessage)
        this.error = errorMessage
        this.showErrorAlert(errorMessage)
        this.isLoading = false
      },
    })

    form.reset()
  }

  onHandleError() {
    this.error = null
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
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
