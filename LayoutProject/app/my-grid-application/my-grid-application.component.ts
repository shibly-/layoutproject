import { Component, Output, EventEmitter, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditorComponent } from "../my-editor/editor.component";
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '../my-form/Form.component';
import { EmployeeService } from '../my-grid-application/my-grid-data.service';
import { GridOptions, RowNode } from "ag-grid";
import { Http, Headers, RequestOptions } from '@angular/http';

import { DragDropObject, DRAG_DROP_SOURCE } from '../drag.drop.object';
import { ModalComponent, MESSAGE_CONST } from './modal.component';

//import "ag-grid-enterprise";
import { AppService } from "../app.service";

declare var jQuery: any;

@Component({
    selector: 'app-my-grid-application',
    templateUrl: './app/my-grid-application/my-grid-application.component.html',
    styleUrls: ['./app/my-grid-application/my-grid-application.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class MyGridApplicationComponent {
    @ViewChild(FormComponent) form;

    gridOptions: GridOptions;
    columnDefs: any[]
    rowData: any[];
    rowDataCopy: any[];
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
    layoutData: any;
    public selectedLayout: any = '';
    isCloneHidden: boolean;
    label: string = "New Layout Description";
    cloneButtonTitle: string = "Save";
    layout_id: number;
    layoutDescription: string;

    clone_layout_id: number;
    clone_layout_desc: string;
    tabToJump: string;
    isValidDescription: boolean = false;   

    constructor(private route: ActivatedRoute, private service: EmployeeService, private appService: AppService, private http: Http) {
        this.appService.activeMenu = this.path = this.route.snapshot.url.join('/');
        if (this.path == "home") {
            return;
        }
        this.isSaveDisabled = true;
        this.appService.isSavePending = false;

        this.service.rowCount = 1;
        this.formOptions();
        this.declare_standardColNames();
        this.declare_dataTypes();
        this.declare_colDefs();
        if (this.path == "add") {
            this.declare_rowData();
        }
        this.declare_gridOptions();
    }

    ngOnInit() {

        this.isCloneHidden = true;
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
    }

    ngOnDestroy() {

    }

    onGridReady(params) {
        params.api.sizeColumnsToFit();
    }

    selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    private declare_standardColNames() {
        if (this.appService.STDColumnList.length) {
            this.Standard_col_values = this.appService.STDColumnList;
            return;
        }

        this.appService.getSTDColumnList().subscribe(data => {
            let d = JSON.parse(data);
            this.Standard_col_values = d;
            this.appService.STDColumnList = d;
        });
    }

    private declare_dataTypes() {
        if (this.appService.ColumnDataTypeList.length) {
            this.Datatype_values = this.appService.ColumnDataTypeList;
            return;
        }

        this.appService.getLayoutColDataTypeList().subscribe(data => {
            let d = JSON.parse(data);
            this.Datatype_values = d;
            this.appService.ColumnDataTypeList = d;
        });
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
                editable: false,
                width: 125,
                pinned: null,
                cellClass: 'text-center'
            },
            {
                headerName: "Attribute Name",
                field: "COL_NAME",
                editable: this.decideEdit(),
                width: 315
            },
            {
                headerName: "Standard Attribute Name",
                field: "IMS_COLUMN_NAME",
                editable: this.decideEdit(),
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: this.Standard_col_values,
                },
                width: 315
            },
            {
                headerName: "Data Type",
                field: "DATA_COLUMN_TYPE",
                editable: this.decideEdit(),
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: this.Datatype_values
                },
                width: 140,
                cellClass: 'text-center'
            },
            {
                headerName: "Required",
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: ['TRUE', 'FALSE']
                },
                field: "MANDATORY",
                editable: this.decideEdit(),
                width: 100,
                cellClass: 'text-center'
            },
            {
                headerName: "Unique Key",
                field: "UNIQUE_KEY",
                editable: this.decideEdit(),
                cellEditor: 'richSelect',
                cellEditorParams: {
                    values: ['TRUE', 'FALSE']
                },
                width: 115,
                cellClass: 'text-center'
            }
        ];
    }

    private decideEdit() {
        if (this.path == 'add') {
            return this.isValidDescription;
        }
        else if (this.path == "edit") {
            return true;
        }
        else if ((this.path == "view") || (this.path == "clone")) {
            return false;
        }
    }

    private declare_rowData() {
        if (this.path != "add") {
            //this.rowData = this.appService.getList().Columns;
            //this.service.rowCount = this.rowData.length;
            if (this.appService.data !== undefined) {
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
        //this.gridOptions.api.sizeColumnsToFit();
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
        if (this.appService.LayoutList.length) {
            this.SearchFormOptions = this.appService.LayoutList;
            return;
        }

        this.appService.getLayoutList().subscribe(data => {
            let d = JSON.parse(data);
            this.SearchFormOptions = d;
            this.appService.LayoutList = d;
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
            this.appService.isSavePending = true;
        }
    }

    private onCellValueChanged(event) {
        if (this.path == "edit") {
            if (event.oldValue !== event.newValue) {
                this.isSaveDisabled = false;
                this.appService.isSavePending = true;
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
        //this.gridOptions.rowData.push(newItem);
        this.service.rowCount++;
    }

    private onDeleteClicked(row) {
        let res = this.gridOptions.api.updateRowData({ remove: [row] });
        let removedRowIndex = this.rowData.findIndex(r => r.COL_ORDER == row.COL_ORDER);
        this.rowData.splice(removedRowIndex, 1);
        this.rowCount--;
    }

    private cloneSaveClicked() {
        this.layoutData = {
            LayoutID: this.form.layout_id + 1,
            LayoutDescr: this.form.layoutDescription,
            DataList: this.gridOptions.rowData,
        }
    }

    private Save() {
        let data = this.gridOptions.rowData;

        if (this.path == "add") {
            this.Add(data);
        } else if (this.path == "edit") {
            this.Edit(data);
        } else if (this.path == 'clone') {
            this.Clone(data);
        }
    }

    private Add(data) {
        if (!this.form.validateLayout(this.form.Layout_Description)) {
            this.isSaveDisabled = true;
            this.appService.isSavePending = false;
        } else {
            for (let i in data) {
                if (data[i].COL_NAME == "" && data[i].IMS_COLUMN_NAME == "" && data[i].DATA_COLUMN_TYPE == "") {
                    this.onDeleteClicked(data[i]);
                }
            }

            if (data.length) {
                for (let i in data) {
                    if (data[i].COL_NAME == "") {
                        alert('Enter Attribute Name.');
                        return;
                    }
                    else if (data[i].IMS_COLUMN_NAME == "") {
                        alert('Enter Standard Attribute Name.');
                        return;
                    }
                    else if (data[i].DATA_COLUMN_TYPE == "") {
                        alert('Enter Data Type.');
                        return;
                    }
                }
            }
            else {
                alert('No valid Attribute found to add!');
                return;
            }               
            
            for (let row of data) {
                let index = data.indexOf(row);
                if (index == data.length - 1) {
                    break;
                }

                let list = data.slice(index + 1);
                for (let ex of list) {
                    if (ex.COL_NAME == row.COL_NAME) {
                        alert('Every \'Attribute Name\' should be different!');
                        return;
                    }

                    if (ex.IMS_COLUMN_NAME == row.IMS_COLUMN_NAME) {
                        alert('Every \'Standard Attribute Name\' should be different!');
                        return;
                    }
                }
            }

            jQuery("#lpConfirmationModalBtnClose ").trigger('click');

            let _columnCount = 1;
            if (data.length)
                data.map(_ => {
                    _["COL_ID"] = _columnCount;
                    _["COL_ORDER"] = _columnCount++;
                    return _;
                });

            this.layoutData = {
                Layout_id: this.form.layout_id,
                Layout_Description: this.form.Layout_Description,
                Columns: data,
                Active_Ind: true
            }

            this.appService.addToList(this.layoutData).subscribe((data) => {
                if (data) {
                    this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_SUCCEED);
                    jQuery("#lpNotificationModalBtn").trigger('click');

                    this.isSaveDisabled = true;
                    this.appService.isSavePending = false;
                    if (this.appService.LayoutList.length) {
                        this.appService.LayoutList.push(this.layoutData.Layout_Description);
                        this.appService.layoutdata.push(this.layoutData);
                    }
                } else {
                    this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_FAILED);
                    jQuery("#lpNotificationModalBtn").trigger('click');
                }
            });
        }
    }

    private Edit(data) {
        let _columnCount = 1;
        if (data.length)
            data.map(_ => {
                _["COL_ORDER"] = _columnCount++;
                return _;
            });

        for (let row of data) {
            let index = data.indexOf(row);
            if (index == data.length - 1) {
                break;
            }

            let list = data.slice(index + 1);
            for (let ex of list) {
                if (ex.COL_NAME == row.COL_NAME) {
                    alert('Every \'Attribute Name\' should be different!');
                    return;
                }

                if (ex.IMS_COLUMN_NAME == row.IMS_COLUMN_NAME) {
                    alert('Every \'Standard Attribute Name\' should be different!');
                    return;
                }
            }
        }

        jQuery("#lpConfirmationModalBtnClose ").trigger('click');

        this.layoutData = {
            Layout_id: this.form.layout_id,
            Layout_Description: this.form.layoutOption,
            Columns: data,
            Active_Ind: true,
        }

        let layoutDataWrapper: any = this.layoutData;
        let layoutDataAsJSON = JSON.stringify(layoutDataWrapper);
        this.appService.saveLayoutList(layoutDataWrapper).subscribe((data) => {
            if (data) {
                this.isSaveDisabled = true;
                this.appService.isSavePending = false;
                this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_SUCCEED);
                jQuery("#lpNotificationModalBtn").trigger('click');
            } else {
                this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_FAILED);
                jQuery("#lpNotificationModalBtn").trigger('click');
            }
        });
    }

    private Clone(data) {
        if (this.clone_layout_desc.trim() == "") {
            this.setNotificationModalContent('Notification', "Please enter the layout description.");
            jQuery("#lpNotificationModalBtn").trigger('click');
            return false;
        }

        jQuery("#lpConfirmationModalBtnClose ").trigger('click');

        // do clone
        for (let i in data) {
            if (data[i].COL_NAME == "" || data[i].IMS_COLUMN_NAME == "" || data[i].DATA_COLUMN_TYPE == "") {
                this.onDeleteClicked(data[i]);
            }
        }

        this.layoutData = {
            Layout_id: this.clone_layout_id,
            Layout_Description: this.clone_layout_desc,
            Columns: data,
            Active_Ind: true
        }
        
        this.appService.addToList(this.layoutData).subscribe((data) => {
            if (data) {
                this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_SUCCEED);
                jQuery("#lpNotificationModalBtn").trigger('click');

                this.isSaveDisabled = true;
                this.appService.isSavePending = false;
                if (this.appService.LayoutList.length) {
                    this.appService.LayoutList.push(this.layoutData.Layout_Description);
                    this.appService.layoutdata.push(this.layoutData);
                }

                this.isCloneHidden = true;
                this.clone_layout_desc = "";
                //this.clone_layout_id = this.appService.maxLayoutID + 1;
                this.isGridHidden = true;
                this.isButtonHidden = true;

            } else {
                this.isCloneHidden = false;
                this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_FAILED);
                jQuery("#lpNotificationModalBtn").trigger('click');
            }
        });
    }

    private onSaveClicked() {
        let AddedData;
        let data = this.gridOptions.rowData;
        if (this.path == "add") {
            this.setConfirmationModalContent('Confirmation', 'Do you want to add this item?');
            jQuery("#lpConfirmationModalBtn").trigger('click');            
        } else if (this.path == "edit") {
            this.setConfirmationModalContent('Confirmation', 'Do you want to update this item?');
            jQuery("#lpConfirmationModalBtn").trigger('click'); 
        } else if (this.path == "delete") {
            this.layoutData = {
                Layout_id: this.form.layout_id,
                Layout_Description: this.form.layoutOption,
                Columns: data,
                Active_Ind: false,
            }

            let layoutDataWrapper: any = this.layoutData;
            let layoutDataAsJSON = JSON.stringify(layoutDataWrapper);
            this.appService.saveLayoutList(layoutDataWrapper).subscribe((data) => {
                if (data) {
                    this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_SUCCEED);
                    jQuery("#lpNotificationModalBtn").trigger('click');

                    this.isGridHidden = true;
                    this.isButtonHidden = true;
                    for (let ex of this.appService.layoutdata) {
                        if (ex.Layout_id == this.layoutData.Layout_id) {
                            ex.Active_Ind = false;
                        }
                    }
                } else {
                    this.setNotificationModalContent('Notification', MESSAGE_CONST.SAVE_FAILED);
                    jQuery("#lpNotificationModalBtn").trigger('click');
                }
            });
        } else if (this.path == 'clone') {
            this.setConfirmationModalContent('Confirmation', 'Do you want to clone this item?');
            jQuery("#lpConfirmationModalBtn").trigger('click'); 
        } else if (this.path == "export") {
            for (let i in data) {
                if (data[i].COL_NAME != "" && data[i].IMS_COLUMN_NAME == "New One Needed") {
                    return false;
                }
            }

            this.layoutData = {
                Layout_id: this.form.layout_id,
                Layout_Description: this.form.layoutOption,
                Columns: data,
            }

            var layoutDataLabel = "LayoutDetails"; //this.form.layoutOption.toString();
            let layoutDataWrapper: any = this.appService.layoutdata.filter(_ => _.Layout_id == this.form.layout_id);
                     //{ [layoutDataLabel]: this.layoutData };
            let layoutDataAsJSON = JSON.stringify(layoutDataWrapper);
            let uri = "data:application/json;charset=UTF-8," + encodeURIComponent(layoutDataAsJSON);

            let a = document.createElement('a');
            let url = "data:application/json;charset=UTF-8," + encodeURIComponent(layoutDataAsJSON);
            a.setAttribute("href", url);
            a.setAttribute("download", ((this.form.layoutOption.toString()).split(' ').join('_').toLowerCase()) + "_layout_details.json");
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(a);
            a.click();
            a.remove();
        } else {
            if (this.form.layoutOption == "default") {
                this.form.validateLayoutDescr(this.form.layoutOption)
            } else {
                for (let i in data) {
                    if (data[i].COL_NAME == "" || data[i].IMS_COLUMN_NAME == "" || data[i].DATA_COLUMN_TYPE == "") {
                        this.onDeleteClicked(data[i]);
                    }
                }
                this.layoutData = {
                    Layout_id: this.form.layout_id,
                    Layout_Description: this.form.layoutOption,
                    rowData: data,
                }
            }
        }
    }

    private onCancelClicked() {
        this.isSaveDisabled = true;
        this.appService.isSavePending = false;
        if (this.path == "add") {
            this.form.Layout_Description = '';
            this.form.layout_id = null;
            this.service.rowCount = 1;
            this.form.addedLayoutAlreadyExists = false;
            let data = [{
                COL_ID: 0, COL_ORDER: this.service.rowCount,
                COL_NAME: "", IMS_COLUMN_NAME: "", DATA_COLUMN_TYPE: "",
                MANDATORY: false, UNIQUE_KEY: false
            }];

            //this.gridOptions.api.setRowData(data);
            this.rowData = data;
            --this.appService.maxLayoutID;
        } else if (this.path == "edit") {
            //this.gridOptions.api.setRowData(this.rowDataCopy);
            //this.rowData = Object.assign([], this.appService.rowDataCopy);

            this.rowData = [];
            for (let dt of this.appService.rowDataCopy) {
                let obj = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
                this.rowData.push(obj);
            }
            this.service.rowCount = this.rowData.length;
        }
    }

    public ViewGrid(event) {
        if (this.path == "add") {
            this.isSaveDisabled = false;
            this.appService.isSavePending = true;
        }
        else {
            if (this.path == "delete" || this.path == "clone" || this.path == "export") {
                this.isSaveDisabled = false;
            }
            else {
                this.isSaveDisabled = true;
                this.appService.isSavePending = false;
            }

            if (event !== "default") {
                this.isGridHidden = false;
                this.rowData = event[0].Columns;
                this.service.rowCount = this.rowData.length;
                //this.Standard_col_values = event[0].standard_col_values;
                this.selectedLayout = event[0].Layout_Description;
                //this.declare_rowData();
                //this.declare_standardColNames();
                this.declare_colDefs();
                if (this.path != "view") {
                    this.isButtonHidden = false;
                }
                if ((this.path == "clone" || this.path == "export") && this.service.rowCount > 0) {
                    let _columns = this.rowData;
                    if (this.path == "clone") this.isCloneHidden = false;

                    for (let i in _columns) {
                        if (_columns[i].COL_NAME != "" && _columns[i].IMS_COLUMN_NAME == "New One Needed") {
                            this.isSaveDisabled = true;
                            this.appService.isSavePending = false;
                            if (this.path == "clone") {
                                this.isCloneHidden = true;
                            }
                        }
                    }

                    if (this.path == "clone" && !this.isCloneHidden) {
                        this.clone_layout_desc = "";
                        this.clone_layout_id = ++this.appService.maxLayoutID;
                    }
                }
            } else {
                this.isButtonHidden = true;
                this.isGridHidden = true;
            }
        }
    }

    public CheckAddLayout(event: boolean) {
        this.isValidDescription = event;
        this.declare_colDefs();            
    }

    public visible = false;
    public visibleAnimate = false;
    private cfModalTitle: string = "Title";
    private cfModalBody: string = "Content";
    private nfModalTitle: string = "Title";
    private nfModalBody: string = "Content";

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }

    public onContainerClicked(event: MouseEvent): void {
        if ((<HTMLElement>event.target).classList.contains('modal')) {
            this.hide();
        }
    }

    public setConfirmationModalContent(_title: string, _bodyContent: string) {
        this.cfModalTitle = _title;
        this.cfModalBody = _bodyContent;
    }

    public setNotificationModalContent(_title: string, _bodyContent: string) {
        this.nfModalTitle = _title;
        this.nfModalBody = _bodyContent;
    }

    canDeactivate() {
        if (this.appService.isSavePending) {
            this.setNotificationModalContent('Warning!', 'You have pending changes!!');
            jQuery("#lpNotificationModalBtn").trigger('click');
            return false;
        }
        return true;
    }
}
