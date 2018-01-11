import {Component} from '@angular/core';
import { GridOptions, RowNode } from "ag-grid";
import "ag-grid-enterprise";

@Component({
    selector: 'main-component',
    templateUrl: './app/client-supplier-setup/client-supplier-setup.html',
})
export class ClientSupplierSetup {
    toggleConfiguration: boolean = true;
    toggleBridging: boolean = true;
    toggleLayout: boolean = true;
    toggleRules: boolean = true;
    toggleProducts: boolean = true;
    toggleOutlets: boolean = true;
    gridOptions: GridOptions;
    gridOptionsRulesOne: GridOptions;
    gridOptionsRulesTwo: GridOptions;
    columnDefs: any[]
    rowData: any[];
    Standard_col_values: any[];
    Datatype_values: any[];
    rowCount: number = 1;
    columnDefsRulesOne: any[];
    columnDefsRulesTwo: any[];
    rowDataRulesOne: any[] = [];
    rowDataRulesTwo: any[] = []

    constructor() {
        this.declare_standardColNames();
        this.declare_dataTypes();
        this.declare_colDefs();
        this.declare_gridOptions();
        this.declare_colDefsRulesOne();
        this.declare_gridOptionsOne();
        this.declare_colDefsRulesTwo();
        this.declare_gridOptionsTwo();
    }


    ngOnInit() {

    }


    onGridReady(params) {
        params.api.sizeColumnsToFit();
    }

    selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    private declare_standardColNames() {
        this.Standard_col_values = ["Employee Name",
            "Employee_name",
            "Emp_name",
            "Emp_ID",
            "EMP_ID",
            "Employee ID",
            "Employee",
            "Employee_ID",
            "New One Needed"
        ];
    }

    private declare_dataTypes() {
        this.Datatype_values = ['String', 'Date', 'Number'];
    }

    private _booleanValues = {
        'true': 'TRUE',
        'false': 'FALSE'
    }

    private declare_colDefsRulesOne() {
        this.columnDefsRulesOne = [
            {
                headerName: "Column Name",
                field: "COL_NAME_RULES_ONE",
                editable: false,
                width: 149
            },
            {
                headerName: "Rules Name",
                field: "RULES_NAME",
                editable: this.decideEdit(),
                width: 149
            },
            {
                headerName: "Rule Description",
                field: "RULE_DESCR",
                editable: this.decideEdit()
            }
        ];
    }

    private declare_colDefsRulesTwo() {
        this.columnDefsRulesTwo = [
            {
                headerName: "Rules Name",
                field: "RULES_NAME_TWO",
                editable: false,
                width: 149
            },
            {
                headerName: "Rule Description",
                field: "RULE_DESCR_TWO",
                editable: this.decideEdit(),
                width: 149
            },
            {
                headerName: "Rule Id",
                field: "RULE_ID",
                editable: this.decideEdit()
            }
        ];
    }

    private declare_colDefs() {
        this.columnDefs = [
            {
                headerName: "Column Order",
                field: "COL_ORDER",
                editable: false,
                width: 100
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
        return false;
    }

    private declare_rowData() {

    }

    private declare_gridOptions() {
        this.gridOptions = <GridOptions>{
            enableColResize: true,
            columnDefs: this.columnDefs,
            rowData: this.rowData,
            rowSelection: 'single',
            DragAndDrop: false,
            processRowPostCreate: (params) => {
                this.generateRowEvents(params);
            },
            getRowNodeId: function (data) {
                return data.id;
            }
        };
    }

    private declare_gridOptionsOne() {
        this.gridOptionsRulesOne = <GridOptions>{
            enableColResize: true,
            columnDefs: this.columnDefsRulesOne,
            rowData: this.rowDataRulesOne,
            rowSelection: 'single',
            DragAndDrop: false,
            processRowPostCreate: (params) => {
                this.generateRowEvents(params);
            },
            getRowNodeId: function (data) {
                return data.id;
            }
        };
    }

    private declare_gridOptionsTwo() {
        this.gridOptionsRulesTwo = <GridOptions>{
            enableColResize: true,
            columnDefs: this.columnDefsRulesTwo,
            rowData: this.rowDataRulesTwo,
            rowSelection: 'single',
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

    private onRowClicked(event) {
    }

    private onCellClicked(event) {
    }

    private onSelectionChanged(event) {
    }

    private onCellEditingStarted(event) {

    }

    private onCellEditingStopped(event) {

    }

    private onCellValueChanged(event) {
    }


    ShowHideConfiguration() {
        this.toggleConfiguration = !this.toggleConfiguration;
    }

    ShowHideBridging() {
        this.toggleBridging = !this.toggleBridging;
    }

    ShowHideLayout() {
        this.toggleLayout = !this.toggleLayout;
    }

    ShowHideRules() {
        this.toggleLayout = !this.toggleLayout;
    }

    ShowHideProducts() {
        this.toggleProducts = !this.toggleProducts;
    }

    ShowHideOutlets() {
        this.toggleOutlets = !this.toggleOutlets;
    }
}