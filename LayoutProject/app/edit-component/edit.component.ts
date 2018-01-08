import {Component,Output,EventEmitter,ViewChild} from "@angular/core";
import { EditorComponent } from "../my-editor/editor.component";
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '../my-form/Form.component';

import {GridOptions} from "ag-grid";

//import "ag-grid-enterprise";

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
        if (this.path == "add") {
            // need to find the max ID
            let newRow = {
                COL_ID: 0, COL_ORDER: this.rowCount + 1, COL_NAME: "", IMS_COLUMN_NAME: "",
                DATA_COLUMN_TYPE: "String", MANDATORY: false, UNIQUE_KEY: false
            }
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

    private declare_standardColNames() {
        // IMS_COLUMN_NAME, need to fetch data from Metadata DB
        this.Standard_col_values = [
            "Employee Name",
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
            field: "COL_ORDER",
            editable: false
            //cellEditorFramework : EditorComponent
         },
        {   headerName : "Column Name",
            field: "COL_NAME",
            editable : this.decideEdit()
            //cellEditorFramework : EditorComponent
        },
        {   headerName : "Standard Column Name",
            field: "IMS_COLUMN_NAME",
            editable : this.decideEdit(),
            cellEditor: 'richSelect',
            cellEditorParams: {
                values: this.Standard_col_values,
                
            }
        },
        {   headerName : "Data type",
            field: "DATA_COLUMN_TYPE",
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
            field: "MANDATORY",
            editable : this.decideEdit()
        },
        {   headerName : "Unique Key",
            field: "UNIQUE_KEY",
            editable : this.decideEdit(),
            cellEditor : 'richSelect',
            cellEditorParams : {
                values: ['TRUE', 'FALSE'],
                //values: [{ 'TRUE': true }, { 'FALSE': false }]
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
            {
                COL_ID: 0, COL_ORDER: this.rowCount, COL_NAME: "EMPLOYEE NAME", IMS_COLUMN_NAME: "EMP_NAME",
                DATA_COLUMN_TYPE: "String", MANDATORY: false, UNIQUE_KEY: false
            }
        ];
    }

    private declare_gridOptions(){
        this.gridOptions = <GridOptions> {
            enableColResize: true, 
            columnDefs : this.columnDefs,
            rowData : this.rowData,
            rowSelection: 'multiple'
        };    
    }

    private formOptions(){
        this.SearchFormOptions = ['Layout Name', 'Layout Name 1', 'Layout Name 2', 'Layout Name 3'];
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
        if (d.COL_NAME != "" && d.IMS_COLUMN_NAME != ""
            && d.COL_ORDER != "" && d.DATA_COLUMN_TYPE != "" && this.path == "add") {
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
        var newItem = {
            COL_ID: 0, COL_ORDER: this.rowCount + 1, COL_NAME: "",
            IMS_COLUMN_NAME: "", DATA_COLUMN_TYPE: "", MANDATORY: false, UNIQUE_KEY: false
        };
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
                if (data[i].COL_NAME == "" || data[i].IMS_COLUMN_NAME == "" || data[i].DATA_COLUMN_TYPE == "") {
                    this.onDeleteClicked(data[i]);
                }
            }
        } 
    }
}
