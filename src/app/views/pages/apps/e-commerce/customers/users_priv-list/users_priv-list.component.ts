﻿// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, delay, take } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
// Translate Module
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store, ActionsSubject } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
// CRUD
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../../core/_base/crud';
// Services and Models
import { CustomerModel, CustomersDataSource, CustomersPageRequested, OneCustomerDeleted, ManyCustomersDeleted, CustomersStatusUpdated } from '../../../../../../core/e-commerce';
// Components
import { CustomerEditDialogComponent } from '../customer-edit/customer-edit.dialog.component';
import { user_privDataService } from '../../../../../../Services/user_privDataService ';
import { users_priv, users_privMaster } from '../../../../../../users_privMaster.Model';

// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/compgetItemCssClassByStatusonents/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-users_priv-list',
	templateUrl: './users_priv-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
	
	/*,providers: [DepartmentDataService]*/
})
export class users_privComponent implements OnInit, OnDestroy {
	// Table fields


    Element1: [{ id: "1" },
        { id: "2" }];
	displayedColumns = ['ser', 'page_name', 'read', 'write','read_and_write','actions'];

	ELEMENT_DATA: Element[];
        //= [{ "dep_id": 1, "dep_name": "main dep", "dep_desc": null, "dep_supervisor_id": 0, "dep_supervisor_name": null },
        //{"dep_id": 2, "dep_name": "asdasd","dep_desc": null, "dep_supervisor_id": 0, "dep_supervisor_name": null},
        //{ "dep_id": 3, "dep_name": "asd", "dep_desc": null, "dep_supervisor_id": 0, "dep_supervisor_name": null },
        //{ "dep_id": 4, "dep_name": "main dep2", "dep_desc": null, "dep_supervisor_id": 0, "dep_supervisor_name": null },
        //{ "dep_id": 5, "dep_name": "Master Department", "dep_desc": null, "dep_supervisor_id": 0, "dep_supervisor_name": null }]
/*	dataSource: [{ "dep_id": 1, "dep_name": "main dep", "dep_desc": "asdasd", "dep_supervisor_id": 0, "dep_supervisor_name": "1", "parent_id": 1 }];*/
	/*dataSource = new MatTableDataSource(this.ELEMENT_DATA)*/
    @ViewChild(MatSort, { static: true }) sort: MatSort; 
	dataSource: any;
    	//this.dataSource.push(model);  //add the new model object to the dataSource
		//this.dataSource = [...this.dataSource];  //refresh the dataSource
	users_priv: users_priv[];
	//dataSource = new MatTableDataSource<OrdersDetailsDataSource>(null);
	
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	//@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	filterStatus: string = '';
	filterType: string = '';
	// Selection
	selection = new SelectionModel<CustomerModel>(true, []);
	customersResult: CustomerModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
	
	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param snackBar: MatSnackBar
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private user_privDataService: user_privDataService
	) {
		this.dataSource = new MatTableDataSource([]);
	}
	get_users_priv(emp_id,job_id) {
		console.log("testeditfunc",emp_id,job_id);
		this.user_privDataService.get_priv_pages(emp_id,job_id).subscribe(data => this.ELEMENT_DATA = data,
			error => console.log(error),
			() => {this.dataSource.data = this.ELEMENT_DATA
				console.log("testeditfunc1",this.ELEMENT_DATA,this.dataSource.data);}
		); }
		updateCheckedList(users_priv: users_priv)
		{
console.log("users_priv",users_priv.read)
if (users_priv.read == "true") {
	console.log("d5lt!")
	users_priv.read = "1"
}
if (users_priv.read == "false") {
	console.log("d5lt!")
	users_priv.read = "0"
}


if (users_priv.read_and_write == "false") {
	console.log("d5lt!")
	users_priv.read_and_write = "0"
}
if (users_priv.read_and_write == "true") {
	console.log("d5lt!")
	users_priv.read_and_write = "1"
}
	
if (users_priv.write == "false") {
	console.log("d5lt!")
	users_priv.write = "0"
}
if (users_priv.write == "true") {
	console.log("d5lt!")
	users_priv.write = "1"
}
if ( (users_priv.write == "1" && users_priv.read == "1") ||
(users_priv.read_and_write == "1" && users_priv.read == "1") ||
(users_priv.read_and_write == "1" && users_priv.write == "1") )
{
	console.log("testifcon")
	users_priv.write = "0"
	users_priv.read = "0"
	users_priv.read_and_write = "1"
}
var val = {
	emp_id: Number(this.user_privDataService.emp_id),
	priv_name: users_priv.priv_name,
	page_name: users_priv.priv_name,
	in_class_priv: Number(users_priv.priv_name,),
	dep_work: Number(users_priv.priv_name,),
	job_id: Number(this.user_privDataService.emp_id),
	read:Number(users_priv.read),
	read_and_write:Number(users_priv.read_and_write),
	write:Number(users_priv.write),

};
console.log("val", val);
this.user_privDataService.save_update_emp_user_privliges(val).subscribe(res => {
	console.log("updated!");
	this.get_users_priv(this.user_privDataService.emp_id,this.user_privDataService.job_id);
	
})
		}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    ngOnInit() {

        this.user_privDataService.bClickedEvent
            .subscribe((data: string) => {
				console.log("testedit");
                this.get_users_priv(this.user_privDataService.emp_id,this.user_privDataService.job_id);
            });
			this.user_privDataService.e_bind_tableClickedEvent
            .subscribe((data: string) => {
				console.log("e_bind_tableClickedEvent");
                this.get_users_priv(this.user_privDataService.emp_id,this.user_privDataService.job_id);
            });
        //this.get_users_priv()
       
		let model: any = [{ 'id': 1, 'assetID': 2, 'severity': 3, 'riskIndex': 4, 'riskValue': 5, 'ticketOpened': true, 'lastModifiedDate': "2018 - 12 - 10", 'eventType': 'Add' }];  //get the model from the form
		//this.dataSource.push(model);  //add the new model object to the dataSource
		//this.dataSource = [...this.dataSource];  //refresh the dataSource

		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadCustomersList())
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadCustomersList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
	/*	this.dataSource = new CustomersDataSource(this.store);*/
		//const entitiesSubscription = this.dataSource.entitySubject.pipe(
		//	skip(1),
		//	distinctUntilChanged()
		//).subscribe(res => {
		//	this.customersResult = res;
		//});
		/*this.subscriptions.push(entitiesSubscription);*/
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadCustomersList();
		}); // Remove this line, just loading imitation
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Customers List from service through data-source
	 */
	loadCustomersList() {
		this.selection.clear();
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(),
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize
           
		);
		// Call request from server
		this.dataSource.sort = this.sort;
        const searchText: string = this.searchInput.nativeElement.value;
        this.dataSource.filter = searchText;
		this.store.dispatch(new CustomersPageRequested({ page: queryParams }));
		this.selection.clear();
        console.log("yyyy",this.ELEMENT_DATA);
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.status = +this.filterStatus;
		}

		if (this.filterType && this.filterType.length > 0) {
			filter.type = +this.filterType;
		}

		filter.lastName = searchText;
		if (!searchText) {
			return filter;
		}

		filter.firstName = searchText;
		filter.email = searchText;
		filter.ipAddress = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete customer
	 *
	 * @param _item: CustomerModel
	 */


	/**
	 * Delete selected customers
	 */
	deleteCustomers() {
		const _title: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.TITLE');
		const _description: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.DESCRIPTION');
		const _waitDesciption: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.WAIT_DESCRIPTION');
		const _deleteMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.MESSAGE');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			const idsForDeletion: number[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				idsForDeletion.push(this.selection.selected[i].dep_id);
			}
			this.store.dispatch(new ManyCustomersDeleted({ ids: idsForDeletion }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.selection.clear();
		});
	}

	/**
	 * Fetch selected customers
	 */
	fetchCustomers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.lastName}, ${elem.firstName}`,
				id: elem.dep_id.toString(),
				/*status: elem.status*/
			});
		});
		this.layoutUtilsService.fetchElements(messages);
		
	}

	/**
	 * Show UpdateStatuDialog for selected customers
	 */
	updateStatusForCustomers() {
		const _title = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.TITLE');
		const _updateMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.MESSAGE');
		const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
		const _messages = [];

		this.selection.selected.forEach(elem => {
			_messages.push({
				text: `${elem.lastName}, ${elem.firstName}`,
				id: elem.dep_id.toString(),
				//status: elem.status,
				//statusTitle: this.getItemStatusString(elem.status),
				//statusCssClass: this.getItemCssClassByStatus(elem.status)
			});
		});

		const dialogRef = this.layoutUtilsService.updateStatusForEntities(_title, _statuses, _messages);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.selection.clear();
				return;
			}

			this.store.dispatch(new CustomersStatusUpdated({
				status: +res,
				customers: this.selection.selected
			}));

			this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update, 10000, true, true);
			this.selection.clear();
		});
	}

	/**
	 * Show add customer dialog
	 */
	addCustomer() {
		const newCustomer = new CustomerModel();
		newCustomer.clear(); // Set all defaults fields
		/*this.editCustomer(newCustomer);*/
	}

	/**
	 * Show Edit customer dialog and save after success close result
	 * @param customer: CustomerModel
	 */
	public activeFilters: string[];
	users_privs_info: any [];
	edit_corridor(users_priv: users_priv, user_privDataService: user_privDataService ) {

		//this.DepartmentService.data = Number(customer.dep_id)
		//console.log('CUSTOMER ID', Number(customer.dep_id));
		console.log('emp ID', users_priv.emp_id);
		this.user_privDataService.emp_id = users_priv.emp_id;
		this.user_privDataService.GetAlluser_privs_with_emp_id(Number(users_priv.emp_id)).subscribe(data => this.users_privs_info = data,
			error => console.log("errorrrrrrrrrrr", error),
			() => {
				for (let item of this.users_privs_info) {
					console.log(item.dep_id)
					
					console.log('testempname', item.emp_name);
					this.user_privDataService.job_id = item.job_id;
					this.user_privDataService.in_class_priv = item.in_class_priv;
					this.user_privDataService.dep_work = item.dep_work;
					this.user_privDataService.priv_name = item.priv_name;
					this.user_privDataService.page_name = item.page_name;

		
				};
				console.log('Component A is clicked!!', this.user_privDataService);
				this.user_privDataService.AClicked('Component A is clicked!!');
			}
		);
		

	}
	delete_corridor(users_priv: users_priv, user_privDataService: user_privDataService ) {
	
		console.log('CUSTOMER ID', users_priv.emp_id);
		this.user_privDataService.deleteuser_privs_empinfo(Number(users_priv.emp_id)).subscribe(res => {
			this.get_users_priv(this.user_privDataService.emp_id,this.user_privDataService.job_id);;
			alert(res.toString());
		
		})
		
	}
	
	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.customersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle all selections
	 */
	masterToggle() {
		if (this.selection.selected.length === this.customersResult.length) {
			this.selection.clear();
		} else {
			this.customersResult.forEach(row => this.selection.select(row));
		}
	}

	/** UI */
	/**
	 * Retursn CSS Class Name by status
	 *
	 * @param status: number
	 */
	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 0:
				return 'danger';
			case 1:
				return 'success';
			case 2:
				return 'metal';
		}
		return '';
	}

	/**
	 * Returns Item Status in string
	 * @param status: number
	 */
	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return 'تم الشرح';
			case 1:
				return 'Active';
			case 2:
				return 'Pending';
		}
		return '';
	}

	/**
	 * Returns CSS Class Name by type
	 * @param status: number
	 */
	getItemCssClassByType(status: number = 0): string {
		switch (status) {
			case 0:
				return 'accent';
			case 1:
				return 'primary';
			case 2:
				return '';
		}
		return '';
	}

	/**
	 * Returns Item Type in string
	 * @param status: number
	 */
	getItemTypeString(status: number = 0): string {
		switch (status) {
			case 0:
				return 'Business';
			case 1:
				return 'مثال7';
		}
		return '';
    }
   public test()
    {
    return 0;
};
    //console.log("zzzzz", this.test);
 

}

//console.log("zzzzzz", this.departments)
export interface Element {
    dep_id: number;
    dep_name: string;
    dep_desc: string;
    dep_supervisor_id: number;
    dep_supervisor_name: string;
}
