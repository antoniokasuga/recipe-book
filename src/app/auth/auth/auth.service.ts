import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refresh: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDHMjWY1p1YCagmr3eCqh7-uS377YuHoiU',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      },
    ).pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken,
        +responseData.expiresIn)
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDHMjWY1p1YCagmr3eCqh7-uS377YuHoiU',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      },
    ).pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken,
        +responseData.expiresIn)
    }));
  }

  logout() {
    this.user.next(null)
    this.router.navigate(['/auth'])
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, token, expirationDate)
    this.user.next(user)
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!'
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => new Error(errorMessage))
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.'
        break
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project.'
        break
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later.'
        break
      case 'EMAIL_NOT_FOUND':
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.'
        break
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.'
        break
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator.'
        break
    }
    return throwError(() => new Error(errorMessage))
  }
}