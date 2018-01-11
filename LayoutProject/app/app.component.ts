import { Component, ViewEncapsulation } from '@angular/core';
import { AppService } from "./app.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

    private activeMenu: string = "";
    private isLayout: boolean;
    private hideExtraDiv: boolean = false;
     
    setActiveMenu(_activeMenu: string) {
        if (this.appService.isSavePending) {
            return;
        }
        this.activeMenu = _activeMenu;
        this.hideExtraDiv = true;
    }
    constructor(private appService: AppService, private route: ActivatedRoute) {
        this.activeMenu = this.appService.activeMenu;

        if (window.location.pathname == '/Home/ClientSupplierSetup') {
            this.isLayout = false;
        } else {
            this.isLayout = true;
        }
    }    
}
