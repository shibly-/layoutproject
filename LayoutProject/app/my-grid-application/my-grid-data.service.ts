import { Injectable } from '@angular/core';
import { DataSet } from '../data.interface';

@Injectable()

export class EmployeeService {
    rowCount: number;
    public dataList: any = [];
    public standard_col_values: any = [];
    public data_values: any = [];

    constructor() {
        //this.rowCount = this.dataList.length;
        this.rowCount = 1;
        this.standard_col_values = ["Employee Name",
            "Employee_name",
            "Emp_name",
            "Emp_ID",
            "EMP_ID",
            "Employee ID",
            "Employee",
            "Employee_ID",
            "New One Needed"
        ];

        this.data_values = ["String", "Number", "Date"];

    }

    public getList() {
        return this.dataList;
    }

    public setList(data) {
        this.dataList = data;
    }

    public addRow(data) {
        this.dataList.push(data);
    }

    public getStandard_col_val(){
        return this.standard_col_values;
    }

    public getDatavalues(){
        return this.data_values;
    }


}