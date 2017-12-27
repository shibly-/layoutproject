import {Component, Input,Output, EventEmitter,ViewChild} from "@angular/core";
import {LayoutModel} from '../models/layout.model';
import { ActivatedRoute } from '@angular/router';
import {AppService} from '../app.service';

@Component({
    selector : 'my-form,.myForm',
    templateUrl : './app/my-form/Form.html'
})

export class FormComponent{
    @Input() layoutOptions:any ;
    @Output('onLayoutChange') onLayoutChange = new EventEmitter();
    layout_id:number;
    label: string = "Layout Description";
    layoutOption : string = "default";
    haslayoutError : boolean = false;
    path:string;
    isAddRowhidden : boolean;
    filteredData : any[];

    constructor(private route:ActivatedRoute, private appService : AppService){
        this.path = this.route.snapshot.url.join('/');
    }

    ngOnInit(){
        if(this.path == "add"){
            this.isAddRowhidden = false;
        }else{
            this.isAddRowhidden = true;
        }
         this.appService.getList().subscribe(data => {
            this.appService.layoutdata = data.LayoutDetails;
        });
    }

    private validateLayout(value){
        let flag : boolean;
        if(value == undefined){
            this.haslayoutError = true;
            flag = false;
        }else{
            flag = true;
            this.haslayoutError = false;
            this.layout_id = this.appService.layoutdata.length + 1;
            this.onLayoutChange.emit(value);
        }
        return flag;
    }

    private validateLayoutDescr(value){
        if(value === "default"){
            this.haslayoutError = true;
            this.onLayoutChange.emit(value);
        }else{
            this.haslayoutError = false;
            this.filteredData = this.appService.layoutdata.filter(element => element.LayoutDescr === value);
            this.layout_id = this.filteredData[0].LayoutID; 
            this.onLayoutChange.emit(this.filteredData);
        }
    }
}