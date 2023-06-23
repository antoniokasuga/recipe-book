import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
