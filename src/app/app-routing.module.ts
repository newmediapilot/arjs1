import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EditorComponent} from './editor/editor.component';
import {AuthComponent} from './auth/auth.component';
import {AuthGuard} from './guards/auth.guard';
import {LoginComponent} from './core/login/login.component';
import {EditorImageComponent} from './editor-image/editor-image.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'editor',
        component: EditorComponent
      },
      {
        path: 'editor-image',
        component: EditorImageComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
