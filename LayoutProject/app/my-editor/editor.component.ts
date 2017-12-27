import { Component,ViewChild,AfterViewInit,ViewContainerRef } from '@angular/core';
import {AgEditorComponent} from '../../node_modules/ag-grid-angular';

@Component({
    selector: 'editor-cell',
    template: `
        <input type="text" #container (keydown)="onKeyDown($event)">`
})
export class EditorComponent implements AgEditorComponent, AfterViewInit {
    private params:any;

    @ViewChild('container', {read: ViewContainerRef}) container;
    
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        this.container.element.nativeElement.focus();
    }

    agInit(params:any):void {
        this.params = params;
        console.log(params);
    }

    getValue():any {

    }

    /* isPopup():boolean {
       
    } */

    /* setHappy(happy:boolean):void {
        this.happy = happy;
    } 

    toggleMood():void {
        this.setHappy(!this.happy);
    } */

    onKeyDown(event):void {
        console.log("In the key down event");
        console.log(event);
        }
    }
