import { Component, ViewEncapsulation } from '@angular/core';
import { AppService } from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

    private activeMenu: string = "";
    private hideExtraDiv: boolean = false;  
    setActiveMenu(_activeMenu: string) {
        if (this.appService.isSavePending) {
            return;
        }

        this.activeMenu = _activeMenu;
        this.hideExtraDiv = true;
    }
    constructor(private appService: AppService) {
        this.activeMenu = this.appService.activeMenu;
    }    
}
