import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from '@angular/forms';
import {AgGridModule} from "ag-grid-angular/main";
import {AppComponent} from "./app.component";
import { RouterModule,Routes } from '@angular/router';
import { MyGridApplicationComponent } from "./my-grid-application/my-grid-application.component";
import { ModalComponent } from './my-grid-application/modal.component';
import {FormComponent} from "./my-form/Form.component";
import {EditorComponent} from "./my-editor/editor.component";
import {EmployeeService} from './my-grid-application/my-grid-data.service';
import {AppService} from "./app.service";
import {HttpModule} from '@angular/http';

const routes : Routes = [
    {path:'add',component: MyGridApplicationComponent},
    {path:'edit', component:MyGridApplicationComponent},
    {path:'view', component:MyGridApplicationComponent},
    {path:'delete', component:MyGridApplicationComponent},
    {path:'clone', component:MyGridApplicationComponent},
    {path:'export', component:MyGridApplicationComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        MyGridApplicationComponent,   
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
    providers: [EmployeeService, AppService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
