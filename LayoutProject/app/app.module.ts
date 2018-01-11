import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from '@angular/forms';
import {AgGridModule} from "ag-grid-angular/main";
import {AppComponent} from "./app.component";
import { RouterModule,Routes } from '@angular/router';
import { MyGridApplicationComponent } from "./my-grid-application/my-grid-application.component";
import {ClientSupplierSetup} from "./client-supplier-setup/client-supplier-setup.component";
import { ModalComponent } from './my-grid-application/modal.component';
import {FormComponent} from "./my-form/Form.component";
import {EditorComponent} from "./my-editor/editor.component";
import {EmployeeService} from './my-grid-application/my-grid-data.service';
import {AppService} from "./app.service";
import {DeactivateGuardService} from "./deactivate-guard.service";
import {HttpModule} from '@angular/http';

const routes: Routes = [
    { path: 'Home/Layout', redirectTo: 'home', pathMatch: 'full' },
    { path: 'Home/ClientSupplierSetup', redirectTo: 'clientsupp', pathMatch: 'full' },
    { path: 'home', component: MyGridApplicationComponent },
    { path: 'add', component: MyGridApplicationComponent, canDeactivate: [DeactivateGuardService] },
    { path: 'edit', component: MyGridApplicationComponent, canDeactivate: [DeactivateGuardService] },
    { path: 'view', component: MyGridApplicationComponent, canDeactivate: [DeactivateGuardService] },
    { path: 'delete', component: MyGridApplicationComponent, canDeactivate: [DeactivateGuardService] },
    { path: 'clone', component: MyGridApplicationComponent, canDeactivate: [DeactivateGuardService] },
    { path: 'export', component: MyGridApplicationComponent, canDeactivate: [DeactivateGuardService] },
    { path: 'clientsupp', component: ClientSupplierSetup },
];

@NgModule({
    declarations: [
        AppComponent,
        MyGridApplicationComponent, 
        ClientSupplierSetup,  
        ModalComponent,     
        FormComponent,
        EditorComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AgGridModule.withComponents(
            [EditorComponent]
        ),
        RouterModule.forRoot(routes)
    ],
    providers: [EmployeeService, AppService, DeactivateGuardService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
