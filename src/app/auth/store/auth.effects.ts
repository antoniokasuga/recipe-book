import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { authenticateFail, authenticateSuccess, autoLogin, loginStart, logout, signupStart } from "./auth.actions";
import { AuthService } from "../auth.service";
import { User } from "../user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return authenticateSuccess({email, userId, token, expirationDate, redirect: true});
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(authenticateFail({error: errorMessage}));
  }
  switch (errorRes.error.error.message) {
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
  }
  return of(authenticateFail({error: errorMessage}));
}

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginStart),
      switchMap(authAction => {
        return this.http
          .post<AuthResponseData>(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
            environment.firebaseAPIKey,
            {
              email: authAction.email,
              password: authAction.password,
              returnSecureToken: true
            }
          )
          .pipe(
            tap(responseData => {
              this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
            }),
            map(responseData => {
              return handleAuthentication(
                +responseData.expiresIn,
                responseData.email,
                responseData.localId,
                responseData.idToken
              );
            }),
            catchError(errorResponse => {
              return handleError(errorResponse);
            })
          )
      })
    )
  )

  authRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authenticateSuccess),
      tap(action => action.redirect && this.router.navigate(['/']))
    ), {dispatch: false}
  )

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signupStart),
      switchMap(authAction => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
          {
            email: authAction.email,
            password: authAction.password,
            returnSecureToken: true,
          }
        )
          .pipe(
            tap(responseData => {
              this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
            }),
            map(responseData => {
              return handleAuthentication(
                +responseData.expiresIn,
                responseData.email,
                responseData.localId,
                responseData.idToken
              )
            }),
            catchError(errorRes => {
              return handleError(errorRes)
            })
          )
      })
    )
  )

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'))
        if (!userData) {
          return {type: 'DUMMY'}
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime()
          this.authService.setLogoutTimer(expirationDuration)
          return authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          })
        }
        return {type: 'DUMMY'};
      })
    )
  )


  authLogout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.clearLogoutTimer()
          localStorage.removeItem('userData')
          this.router.navigate(['/auth'])
        })
      ),
    {dispatch: false}
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
  }
}
