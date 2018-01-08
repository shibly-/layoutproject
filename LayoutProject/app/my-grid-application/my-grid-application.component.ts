import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { EditorComponent } from "../my-editor/editor.component";
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '../my-form/Form.component';
import { EmployeeService } from '../my-grid-application/my-grid-data.service';
import { GridOptions, RowNode } from "ag-grid";
import {Http, Headers, RequestOptions} from '@angular/http';

import { DragDropObject, DRAG_DROP_SOURCE } from '../drag.drop.object';

//import "ag-grid-enterprise";
import { AppService } from "../app.service";

@Component({
    selector: 'app-my-grid-application',
    templateUrl: './app/my-grid-application/my-grid-application.component.html'
})
export class MyGridApplicationComponent {
    @ViewChild(FormComponent) form;

    gridOptions: GridOptions;
    columnDefs: any[]
    rowData: any[];
    Standard_col_values: any[];
    Datatype_values: any[];
    rowCount: number = 1;
    SearchFormOptions: any = [];
    isSaveDisabled: boolean;
    path: string = "";
    buttonTitle: string = "";
    public gridId: Date = new Date();
    infiniteLoopBlock: boolean;
    public isGridHidden: boolean;
    public isButtonHidden: boolean;
    layoutData : any;
    public selectedLayout: any = ''; 

    constructor(private route: ActivatedRoute, private service: EmployeeService, private appService: AppService, private http: Http) {
        this.path = this.route.snapshot.url.join('/');
        this.formOptions();
        this.declare_standardColNames();
        this.declare_dataTypes();
        this.declare_colDefs();
        if(this.path == "add"){
            this.declare_rowData();
        }
        this.declare_gridOptions();
        this.isSaveDisabled = true;
    }

    ngOnInit() {
        if (this.path == "add") {
            this.buttonTitle = "Save";
            this.isGridHidden = false;
            this.isButtonHidden = false;
        } else if (this.path == "edit") {
            this.buttonTitle = "Save";
            this.isGridHidden = true;
            this.isButtonHidden = true;
        } else if (this.path == "delete") {
            this.buttonTitle = "Delete";
        } else if (this.path == "export") {
            this.buttonTitle = "Export";
        } else if (this.path == "clone") {
            this.buttonTitle = "Clone";
        } else {
            this.isButtonHidden = true;
            this.isGridHidden = true;
        }

        //this.http.get('api/MongoDB/insertData')
        //    .map((res: any) => res.json()).subscribe(); 
    }

    ngOnDestroy(){

    }

    onGridReady(params) {        
        params.api.sizeColumnsToFit();
    }

    selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    private declare_standardColNames() {
        this.Standard_col_values = this.service.getStandard_col_val();
    }

    private declare_dataTypes() {
        this.Datatype_values = this.service.getDatavalues();
    }

    private _booleanValues = {
        'true': 'TRUE',
        'false': 'FALSE'
    }

    private declare_colDefs() {
        this.columnDefs = [
            {
                headerName: "Column Order",
                field: "COL_ORDER",
                editable: false
            },
            {
                headerName: "Column Name",
                field: "COL_NAME",
                editable: this.decideEdit()
            },
            {
                headerName: "Standard Column Name",
                field: "IMS_COLUMN_NAME",
                editable: this.decideEdit(),
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: this.Standard_col_values,
                }
            },
            {
                headerName: "Data type",
                field: "DATA_COLUMN_TYPE",
                editable: this.decideEdit(),
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: this.Datatype_values
                }
            },
            {
                headerName: "Mandatory Column",
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: ['TRUE', 'FALSE']
                },
                field: "MANDATORY",
                editable: this.decideEdit()
            },
            {
                headerName: "Unique Key",
                field: "UNIQUE_KEY",
                editable: this.decideEdit(),
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: ['TRUE', 'FALSE']                 
                }
            }
        ];
    }

    private decideEdit() {
        if ((this.path == 'add') || (this.path == "edit")) {
            return true;
        }
        if (this.path == "view") {
            return false;
        }
    }

    private declare_rowData() {
        if (this.path != "add") {
            //this.rowData = this.appService.getList().Columns;
            //this.service.rowCount = this.rowData.length;
            if(this.appService.data !== undefined){
                this.rowData = this.appService.data[0].Columns;
                this.service.rowCount = this.rowData.length;
            }
        } else {
            this.rowData = [{
                // need to find the max ID
                COL_ID: 0, COL_ORDER: this.service.rowCount,
                COL_NAME: "", IMS_COLUMN_NAME: "", DATA_COLUMN_TYPE: "",
                MANDATORY: false, UNIQUE_KEY: false
            }];
        }
    }

    private declare_gridOptions() {
        this.gridOptions = <GridOptions>{
            enableColResize: true,
            columnDefs: this.columnDefs,
            rowData: this.rowData,
            rowSelection: 'single',
            //suppressRowSelection: false,
            //suppressCellSelection: true,
            //suppressRowClickSelection: true,
            DragAndDrop: false,
            processRowPostCreate: (params) => {
                this.generateRowEvents(params);
            },
            getRowNodeId: function (data) {
                return data.id;
            }
        };
    }

    private generateRowEvents(params) {
        params.eRow.draggable = true;
    }

    private setDrag(event) {
        //console.log(event);
        var selectedNodes: RowNode[] = this.gridOptions.api.getSelectedNodes();

        var selectedEntities: {}[] = [];
        for (let node of selectedNodes) {
            selectedEntities.push(node.data);
        }

        var dragO: DragDropObject = new DragDropObject();
        dragO.windowId = this.gridId.toString();
        dragO.windowSource = DRAG_DROP_SOURCE.CAR_SOURCE;
        dragO.dragData = selectedEntities;

        var selectedEntitiesJSON: string = JSON.stringify(dragO);

        //console.log(dragO);

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text", selectedEntitiesJSON);
        }
        else if (
            event.originalEvent.dataTransfer) {
            event.originalEvent.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text", selectedEntitiesJSON);
        }

        //console.log(event);
    }

    private dragStopped(event) {
        //console.log(event);
    }

    private onDragOver(event) {
        //console.log(event);
        if (event.preventDefault) {
            event.preventDefault(); // Necessary. Allows us to drop.
        }
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }

    }

    private onDrop(event) {
        var targetRowId;
        var targetData;
        var selectedNodes = this.gridOptions.api.getSelectedNodes();
        let selectedNode = selectedNodes[0];
        let row_num;
        if (event && !this.infiniteLoopBlock) {
            if (event.dataTransfer) {
                var evString = event.dataTransfer.getData("text");
                var masterDrag: DragDropObject = JSON.parse(event.dataTransfer.getData("text"));
                row_num = masterDrag.dragData[0].COL_ORDER;
                if (evString || evString.length > 0) {
                    if (event.target.offsetParent.attributes && event.target.offsetParent.attributes['row']) {
                        targetRowId = +event.target.offsetParent.attributes['row'].value;
                        let rowNode = this.gridOptions.api.getRowNode(targetRowId + 1);
                        targetData = rowNode.data;
                        rowNode.setData(masterDrag.dragData[0]);
                        rowNode.setDataValue("COL_ORDER", targetData.COL_ORDER);
                    }

                    this.infiniteLoopBlock = false;
                }

                selectedNodes[0].setData(targetData);
                selectedNodes[0].setDataValue("COL_ORDER", row_num);
            }
        }

    }

    private formOptions() {
        //this.SearchFormOptions = this.appService.getLayoutList();
        this.appService.getLayoutList().subscribe(data => {
            let d = JSON.parse(data); 
            this.SearchFormOptions = d;
        });
    }

    private onRowClicked(event) {
    }

    private onCellClicked(event) {
    }

    private onSelectionChanged(event) {
    }

    private onCellEditingStarted(event) {

    }

    private onCellEditingStopped(event) {
        let alldata = 0;
        let d = event.data
        if (d.COL_ORDER == this.gridOptions.rowData.length && d.COL_NAME != ""
            && d.IMS_COLUMN_NAME != "" && d.COL_ORDER != "" && d.DATA_COLUMN_TYPE != "") {
            this.onAddClicked();
            this.isSaveDisabled = false;
        }
    }

    private onCellValueChanged(event) {
        if (this.path == "edit") {
            if (event.oldValue !== event.newValue) {
                this.isSaveDisabled = false;
            }
        }
    }

    private onAddClicked() {
        var newItem = {
            // need to find the max ID
            COL_ID: 0, COL_ORDER: this.service.rowCount + 1, COL_NAME: "",
            IMS_COLUMN_NAME: "", DATA_COLUMN_TYPE: "", MANDATORY: false, UNIQUE_KEY: false
        };
        var res = this.gridOptions.api.updateRowData({ add: [newItem] });
        this.rowData.push(newItem);
        this.service.rowCount++;
    }

    private onDeleteClicked(row) {
        let res = this.gridOptions.api.updateRowData({ remove: [row] });
        let removedRowIndex = this.rowData.findIndex(r => r.COL_ORDER == row.COL_ORDER);
        this.rowData.splice(removedRowIndex,1);
        this.rowCount--;
    }


    private onSaveClicked() {
        let AddedData;
        let data = this.gridOptions.rowData;
        if(this.path == "add"){
            if (!this.form.validateLayout(this.form.Layout_Description)){
                this.isSaveDisabled = true;
            }else{
                for (let i in data) {
                    if (data[i].COL_NAME == "" || data[i].IMS_COLUMN_NAME == "" || data[i].DATA_COLUMN_TYPE == "") {
                        this.onDeleteClicked(data[i]);
                    }
                }
                this.layoutData = {
                    Layout_Id : this.form.layout_id,
                    Layout_Description: this.form.Layout_Description,
                    Columns : data,
                }
                this.appService.addToList(this.layoutData).subscribe((data) => {
                    AddedData = data;
                    console.log(AddedData);
                });
            }
        }
		else if(this.path == "export"){
            this.layoutData = {
                Layout_Id : this.form.layout_id,
                Layout_Description : this.form.layoutOption,
                Columns : data,
            }
            
            var layoutDataLabel = "LayoutDetails"; //this.form.layoutOption.toString();
            let layoutDataWrapper: any = { [layoutDataLabel] : this.layoutData };
            let layoutDataAsJSON = JSON.stringify(layoutDataWrapper);
            let uri = "data:application/json;charset=UTF-8," + encodeURIComponent(layoutDataAsJSON);
            
            let a = document.createElement('a');
            let url = "data:application/json;charset=UTF-8," + encodeURIComponent(layoutDataAsJSON);
            a.setAttribute("href", url);
            a.setAttribute("download", ((this.form.layoutOption.toString()).split(' ').join('_').toLowerCase())+"_layout_details.json");
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(a);
            a.click();
            a.remove();
        }
        else if (this.path == "edit") {
            this.layoutData = {
                Layout_Id: this.form.layout_id,
                Layout_Description: this.form.layoutOption,
                Columns: data,
                Active_Ind: true,
            }

            let layoutDataWrapper: any = this.layoutData;
            let layoutDataAsJSON = JSON.stringify(layoutDataWrapper);
            this.appService.saveLayoutList(layoutDataWrapper).subscribe((data) => {
                //console.log(AddedData);
            });
        }
        else if (this.path == "delete") {
            this.layoutData = {
                Layout_Id: this.form.layout_id,
                Layout_Description: this.form.layoutOption,
                Columns: data,
                Active_Ind: false,
            }

            let layoutDataWrapper: any = this.layoutData;
            let layoutDataAsJSON = JSON.stringify(layoutDataWrapper);
            this.appService.saveLayoutList(layoutDataWrapper).subscribe((data) => {
                //console.log(AddedData);
            });
        }
		else{
			if (this.form.layoutOption == "default") {
				this.form.validateLayoutDescr(this.form.layoutOption)
			} else {
				for (let i in data) {
                    if (data[i].COL_NAME == "" || data[i].IMS_COLUMN_NAME == "" || data[i].DATA_COLUMN_TYPE == "") {
						this.onDeleteClicked(data[i]);
					}
				}
				this.layoutData = {
                    Layout_Id : this.form.layout_id,
					Layout_Description : this.form.layoutOption,
					rowData : data,
				}
			}
		}
    }

    public ViewGrid(event) {
        if(this.path == "add"){
            this.isSaveDisabled = false;
        }
        else {
            if(this.path == "delete" || this.path == "export"){
                this.isSaveDisabled = false;     
            }
            else {
                this.isSaveDisabled = true;
            }

            if (event !== "default") {
                this.isGridHidden = false;
                this.rowData = event[0].Columns;
                this.service.rowCount = this.rowData.length;
                this.Standard_col_values = event[0].standard_col_values;
                this.selectedLayout = event[0].Layout_Description;
                //this.declare_rowData();
                //this.declare_standardColNames();
                this.declare_colDefs();
                if(this.path != "view"){
                    this.isButtonHidden = false;    
                }
            } else {
                this.isButtonHidden = true;
                this.isGridHidden = true;
            }
        }
    }
}
