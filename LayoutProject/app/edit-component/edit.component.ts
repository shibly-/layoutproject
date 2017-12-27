import {Component,Output,EventEmitter,ViewChild} from "@angular/core";
import { EditorComponent } from "../my-editor/editor.component";
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '../my-form/Form.component';

import {GridOptions} from "ag-grid";

import "ag-grid-enterprise";

@Component({
    selector: 'edit-component',
    templateUrl: './edit.html'
})
export class EditComponent {
    @ViewChild(FormComponent) form;

    gridOptions: GridOptions;
    columnDefs: any[]
    rowData: any[];
    Standard_col_values: any[];
    Datatype_values: any[];
    rowCount:number = 1;
    SearchFormOptions:any = []; 
    isSaveDisabled : boolean;
    path : string = "";

    constructor(private route: ActivatedRoute) {
        this.path = this.route.snapshot.url.join('/');
        this.formOptions();
        this.declare_standardColNames();
        this.declare_dataTypes();
        this.declare_colDefs();
        this.declare_rowData();
        this.declare_gridOptions(); 
        this.isSaveDisabled = true;
    }

    ngOnInit(){
        if(this.path == "add"){
            let newRow = {col_num:this.rowCount+1,col_name:"",standard_col_name:"",data_type:"",mandatory_col:'',unique_key:''}
            this.gridOptions.rowData.push(newRow);
            this.rowCount++;
        }
    }
    onGridReady(params) {
        params.api.sizeColumnsToFit();
    }

    selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    private declare_standardColNames(){
        this.Standard_col_values = ["Employee Name",
        "Employee_name",
        "Emp_name",
        "Emp_ID",
        "Employee ID",
        "Employee",
        "Employee_ID",
        "New One Needed"
        ];
    }

    private declare_dataTypes(){
        this.Datatype_values = ["String","Number","Date"];
    }

    private declare_colDefs(){
    this.columnDefs = [
        {   headerName : "Column Order",
            field : "col_num",
            editable: false
            //cellEditorFramework : EditorComponent
         },
        {   headerName : "Column Name",
            field : "col_name",
            editable : this.decideEdit()
            //cellEditorFramework : EditorComponent
        },
        {   headerName : "Standard Column Name",
            field : "standard_col_name",
            editable : this.decideEdit(),
            cellEditor: 'richSelect',
            cellEditorParams: {
                values: this.Standard_col_values,
                
            }
        },
        {   headerName : "Data type",
            field : "data_type",
            editable : this.decideEdit(),
            cellEditor : 'richSelect',
            cellEditorParams : {
                values : this.Datatype_values
            }
        },
        {   headerName : "Mandatory Column",
            cellEditor : 'richSelect',
            cellEditorParams : {
                values : ['TRUE','FALSE']
            },
            field : "mandatory_col",
            editable : this.decideEdit()
        },
        {   headerName : "Unique Key",
            field : "unique_key",
            editable : this.decideEdit(),
            cellEditor : 'richSelect',
            cellEditorParams : {
                values : ['TRUE','FALSE']
            }
        }        
        ];
    }

    private decideEdit(){
        if((this.path == 'add') || (this.path == "edit")){
            return true;
        }
        if(this.path == "view"){
            return false;
        }
    }

    private declare_rowData(){
        this.rowData = [
            {col_num:this.rowCount,col_name:"EMPLOYEE NAME",standard_col_name:"EMP_NAME",data_type:"String",mandatory_col:'TRUE',unique_key:'FALSE'}
        ];
    }

    private declare_gridOptions(){
        this.gridOptions = <GridOptions>{
            enableColResize: true, 
            columnDefs : this.columnDefs,
            rowData : this.rowData,
            rowSelection: 'multiple'
            };    
    }

    private formOptions(){
        this.SearchFormOptions = ['Layout Name','Layout Name 1','Layout Name 2','Layout Name 3'];
    }

    private onRowClicked(event){
        //console.log(event);
    }

    private onCellClicked(event){
        //console.log(event);
        /*if(event.colDef.headerName == 'Column Name' && (event.data.col_name !== "")){
            this.onAddClicked();
            this.isSaveDisabled = false;
        } */
    }

    private onSelectionChanged(event){
    }
    
    private onCellEditingStarted(event){

    }

    private onCellEditingStopped(event){
        let alldata = 0;
        let d = event.data
        if(d.col_name != "" && d.unique_key !="" && d.mandatory_col !="" && d.standard_col_name!="" && d.col_num!="" && d.data_type!="" && this.path == "add"){
            this.onAddClicked();
            this.isSaveDisabled = false;
        } 
    }

    private onCellValueChanged(event){
        if(this.path == "edit"){
            if(event.oldValue !== event.newValue){
                this.isSaveDisabled = false;
            }
        }
    }

    private onAddClicked(){
        var newItem = {col_num: this.rowCount+1,col_name:"",standard_col_name:"",data_type:"",mandatory_col:"",unique_key:""};
        var res = this.gridOptions.api.updateRowData({add : [newItem]});
        this.rowData.push(newItem);
        this.rowCount++;
        /*if(res.add){
            res.add.forEach(function(rowNode){
                console.log('Added row node', rowNode);
            }) */ 
    }

     private onDeleteClicked(row){
         console.log("Delete clicked");
         console.log(row);
       //let selectedRows = this.gridOptions.api.getSelectedRows();
       //console.log(selectedRows);
       //let res = this.gridOptions.api.updateRowData({remove: [selectedRows[0]]});
       let res = this.gridOptions.api.updateRowData({remove: [row]});
       this.rowCount--;
    }

    /*private onClearClicked(){
        this.gridOptions.api.setRowData([]);
        this.rowCount = 0;
    } */

    private EnableSave(event){
        console.log("In enable save");
        if(!event){
            this.isSaveDisabled = false;
        }
    }
    private onSaveClicked(){
        //console.log(this.gridOptions.rowData);
        let data = this.gridOptions.rowData;
        if(this.form.layoutOption == "default"){
            this.form.validateLayoutDescr(this.form.layoutOption)
            //this.isSaveDisabled = true;
        }else{
            for(let i in data){
            if(data[i].col_name == "" || data[i].unique_key =="" || data[i].mandatory_col =="" || data[i].standard_col_name == "" || data[i].data_type == ""){
                this.onDeleteClicked(data[i]);
            }
        }
        } 
    }
}
