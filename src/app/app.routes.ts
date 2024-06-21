import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DesignComponent } from './design/design.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'design', component: DesignComponent}
];
