import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import { login, logout } from "./auth.actions";

export interface State {
  user: User
}

const initialState: State = {
  user: null
}

export const authReducer = createReducer(
  initialState,
  on(
    login,
    (state, action) => {
      const user = new User(
        action.email,
        action.userId,
        action.token,
        action.expirationDate
      )
      return {
        ...state,
        user: user
      }
    }
  ),
  on(
    logout,
    (state) => {
      return {
        ...state,
        user: null
      }
    }
  )
)
