import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './auth/auth.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {EditorComponent} from './auth/editor/editor.component';
import {LoginComponent} from './core/login/login.component';
import {HeaderComponent} from './core/header/header.component'
import {UserService} from './services/user.service';
import {FormsModule} from '@angular/forms';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {FireDbService} from './services/core/fire-db.service';
import {FireStorageService} from './services/core/fire-storage.service';
import {ImageService} from './services/image.service';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthComponent,
    EditorComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
  ],
  providers: [
    UserService,
    ImageService,
    FireDbService,
    FireStorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
