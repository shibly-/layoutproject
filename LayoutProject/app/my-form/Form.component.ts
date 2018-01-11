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
    isAddRowhidden: boolean;
    hideLayoutMsg: boolean = true;
    layoutRelatedMsg: string = "";
    filteredData : any[];
    @Input() firstLayout: string = "";
    @Output('onAddLayoutChange') onAddLayoutChange = new EventEmitter();
    addedLayoutAlreadyExists: boolean = false;

    constructor(private route:ActivatedRoute, private appService : AppService){
        this.path = this.route.snapshot.url.join('/');
    }

    ngOnInit(){
        if(this.path == "add"){
            this.isAddRowhidden = false;
        }else{
            this.isAddRowhidden = true;
            // set and call the first layout, if any
            if (this.appService.LayoutList.length) {
                this.layoutOption = this.firstLayout = this.appService.LayoutList[0];
                this.validateLayoutDescr(this.appService.LayoutList[0]);
            }
        }

        if (this.appService.layoutdata.length) {
            return;
        }

        this.appService.getList().subscribe(data => {
            let d = JSON.parse(data); 
            this.appService.layoutdata = d;

            for (var i in d) {
                if (d[i].Layout_id > this.appService.maxLayoutID)
                    this.appService.maxLayoutID = d[i].Layout_id;
            }

            // call and set the first layout, if any 
            if (this.appService.LayoutList.length) {
                this.firstLayout = this.appService.LayoutList[0];
                this.validateLayoutDescr(this.appService.LayoutList[0]);
            }                
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
            this.layout_id = this.appService.maxLayoutID + 1;
            this.onLayoutChange.emit(value);
        }
        return flag;
    }

    private checkAddLayoutDescr(value, showAlreadyExist: boolean) {
        let enableAddLayout: boolean = false;
        this.haslayoutError = false;
        this.addedLayoutAlreadyExists = false;

        let _value = value.trim();
        let _layoutList = this.appService.LayoutList;
        if (_value != "") {
            enableAddLayout = true;
            for (let i in _layoutList) {
                if (_layoutList[i].toLowerCase() == _value.toLowerCase()) {
                    enableAddLayout = false;
                    if (showAlreadyExist) this.addedLayoutAlreadyExists = true;
                }
            }
        }

        if (!enableAddLayout) this.haslayoutError = true;
        this.onAddLayoutChange.emit(enableAddLayout);
    }

    private validateLayoutDescr(value) {
        this.hideLayoutMsg = true;
        if(value === "default"){
            this.haslayoutError = true;
            this.onLayoutChange.emit(value);            
        }else{
            this.haslayoutError = false;
            this.filteredData = this.appService.layoutdata.filter(element => element.Layout_Description === value);

            this.appService.rowDataCopy = [];
            for (let dt of this.filteredData[0].Columns) {
                let obj = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
                this.appService.rowDataCopy.push(obj);
            }

            this.layout_id = this.filteredData[0].Layout_id; 
            if (this.filteredData[0].Active_Ind) {
                this.onLayoutChange.emit(this.filteredData);
            }                
            else {
                this.haslayoutError = true;
                this.hideLayoutMsg = false;
                this.layoutRelatedMsg = "The layout: \"" + this.filteredData[0].Layout_Description  + "\" - is already deleted."
                this.onLayoutChange.emit("default");
            }   
        }
    }
}