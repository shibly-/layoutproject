import {Injectable} from '@angular/core';
import {DataSet} from './data.interface';
import {Observable, Subject} from 'rxjs/Rx';
import { EmployeeService } from './my-grid-application/my-grid-data.service';
import {Http,Headers, RequestOptions} from '@angular/http';


@Injectable()

export class AppService{

    EmployeeData : DataSet;
    StudentData : DataSet;
    OrderData : DataSet;
    SupplierData : DataSet;

    LayoutList : any[];
    layoutdata : any[] = [];
    dataList : any[] = [];
    data : any;

    public notifier$: Subject<any>;

    constructor(private gridService : EmployeeService,private http: Http){
        this.notifier$ = new Subject();

        this.LayoutList = ['Employee Details', 'Student Details', 'Order Details'];
        
        
        // this.EmployeeData = {
        //     LayoutID : 1,
        //     LayoutDescr : this.LayoutList[0],
        //     DataList : [
        //         { id: 1, col_num: 1, col_name: "EMPLOYEE NAME", standard_col_name: "EMP_NAME", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 2, col_num: 2, col_name: "EMPLOYEE ID", standard_col_name: "Emp_ID", data_type: "Number", mandatory_col: 'TRUE', unique_key: 'TRUE' },
        //         { id: 3, col_num: 3, col_name: "EMPLOYEE ADDRESS", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 4, col_num: 4, col_name: "EMPLOYEE PAY", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'FALSE', unique_key: 'FALSE' },
        //         { id: 5, col_num: 5, col_name: "EMPLOYEE PHONE", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'TRUE' }
        //     ]
        // };

        // this.StudentData = {
        //     LayoutID : 2,
        //     LayoutDescr : this.LayoutList[1],
        //     DataList : [
        //         { id: 1, col_num: 1, col_name: "STUDENT NAME", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 2, col_num: 2, col_name: "STUDENT ID", standard_col_name: "New One Needed", data_type: "Number", mandatory_col: 'TRUE', unique_key: 'TRUE' },
        //         { id: 3, col_num: 3, col_name: "STUDENT ADDRESS", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 4, col_num: 4, col_name: "STUDENT PHONE", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'TRUE' }
        //     ]
        // };

        // this.OrderData = {
        //     LayoutID : 3,
        //     LayoutDescr : this.LayoutList[2],
        //     DataList : [
        //         { id: 1, col_num: 1, col_name: "ORDER NAME", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 2, col_num: 2, col_name: "ORDER ID", standard_col_name: "New One Needed", data_type: "Number", mandatory_col: 'TRUE', unique_key: 'TRUE' },
        //         { id: 3, col_num: 3, col_name: "ORDER ADDRESS", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 4, col_num: 4, col_name: "ORDER PRICE", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'FALSE', unique_key: 'FALSE' },
        //         { id: 5, col_num: 5, col_name: "SHIPPING ADDRESS", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'TRUE' }
        //     ]
        // };

        // this.SupplierData = {
        //     LayoutID : 4,
        //     LayoutDescr : this.LayoutList[3],
        //     DataList : [
        //         { id: 1, col_num: 1, col_name: "SUPPLIER NAME", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 2, col_num: 2, col_name: "SUPPLIER ID", standard_col_name: "New One Needed", data_type: "Number", mandatory_col: 'TRUE', unique_key: 'TRUE' },
        //         { id: 3, col_num: 3, col_name: "SUPPLIER ADDRESS", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'FALSE' },
        //         { id: 4, col_num: 4, col_name: "SUPPLIER PERCENT", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'FALSE', unique_key: 'FALSE' },
        //         { id: 5, col_num: 5, col_name: "SUPPLIER PHONE", standard_col_name: "New One Needed", data_type: "String", mandatory_col: 'TRUE', unique_key: 'TRUE' }
        //     ]
        // };
    }

    public async setList(event){
        await this.getList().subscribe(data => {
            this.dataList = data.LayoutDetails;
        });
        this.data = this.dataList.filter(element => 
            element.LayoutDescr === event);   
        // if(event == this.LayoutList[0]){
        //     this.dataList = this.EmployeeData;
        //     this.gridService.standard_col_values = ["Employee Name",
        //     "Employee_name",
        //     "Emp_name",
        //     "Emp_ID",
        //     "EMP_ID",
        //     "Employee ID",
        //     "Employee",
        //     "Employee_ID",
        //     "New One Needed"
        // ];
        // }else if(event == this.LayoutList[1]){
        //     this.dataList = this.StudentData;
        //     this.gridService.standard_col_values = ["Student Name",
        //     "Student_name",
        //     "Student_ID",
        //     "Student ID",
        //     "Student_Grade",
        //     "Student Address",
        //     "New One Needed"
        // ];
        // }else if(event == this.LayoutList[2]){
        //     this.dataList = this.OrderData;
        //     this.gridService.standard_col_values = ["Order Name","Order_name","Order ID","Order_ID","Order Price","Order_Price","New One Needed"];
        // }else if(event == this.LayoutList[3]){
        //     this.dataList = this.SupplierData;
        //     this.gridService.standard_col_values = ["Supplier Name","Supplier_name","Supplier ID","Supplier_ID","New One Needed"];
        // }
    }

    public getList() : Observable<any>{
        return this.http.get('./app/assets/LayoutData.json')
        .map((res:any) => res.json());
    }
    
    public getLayoutList(){
        return this.http.get('./app/assets/LayoutList.json')
        .map((res:any) => res.json()); 
    }

    public addToList(data){
        var jsonData = JSON.stringify(data);
        console.log(jsonData);
        let headers=new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers});
        return this.http.post('./app/assets/LayoutData.json',jsonData,options).map((res:any) => res.json());
    }
    messageDialog(title: string, message: string, callback?: Function) {
        this.notifyAll({ key: 'messageDialog', value: { title: title, message: message, callback: callback } });
    }

    confirmDialog(title: string, message: string, yesCallback?, noCallback?) {
        this.notifyAll({ key: 'confirmDialog', value: { title: title, message: message, yesCallback: yesCallback, noCallback: noCallback } });
    }

    notifyAll(obj: { key: string, value?: any }) {
        this.notifier$.next(obj);
    }
    
}