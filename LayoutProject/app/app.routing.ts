import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyGridApplicationComponent } from "./my-grid-application/my-grid-application.component";

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: MyGridApplicationComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);