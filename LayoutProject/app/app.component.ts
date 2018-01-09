import { Component } from '@angular/core';
import { AppService } from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css']
})
export class AppComponent {

    private activeMenu: string = ""; 
    setActiveMenu(_activeMenu: string) {
        this.activeMenu = _activeMenu;
    }
    constructor(private appService: AppService) {
        this.activeMenu = this.appService.activeMenu;
    }
}
