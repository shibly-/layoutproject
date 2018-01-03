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
    }

    public async setList(event){
        await this.getList().subscribe(data => {
            this.dataList = data.LayoutDetails;
        });
        this.data = this.dataList.filter(element => 
            element.LayoutDescr === event);
    }

    public getList(): Observable<any> {        
        return this.http.get('api/AggridData/getLayoutData')
            .map((res:any) => res.json());
    }
    
    public getLayoutList(){
        return this.http.get('api/AggridData/getLayoutList')
            .map((res: any) => res.json()); 
    }

    public saveLayoutList(data) {
        var jsonData = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/AggridData/saveLayoutData', data, options).map((res: any) => res.json());
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