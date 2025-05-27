import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonService } from 'src/services/common.service';
import { Router } from '@angular/router';

import { LoadingController, ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { DailyWorkSheet } from 'src/class/DailyWorkSheet';
import { CommonModalPage } from 'src/app/shared/common-modal/common-modal.page';
import { CallInformation } from 'src/class/CallInformation';
import { AppConfig } from 'src/class/AppConfig';
import { Addwork } from 'src/class/AddWork';
import { AuthService } from 'src/services/auth.service';
declare var bootstrap: any;
@Component({
  selector: 'app-call-list',
  templateUrl: './call-list.page.html',
  styleUrls: ['./call-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CallListPage implements OnInit {
  appconfig = new AppConfig()
  WhereCondition: string = 'W.WORK_STATUS_ID IN (1)'

  SelectedClientStatus: string = ''
  viewtype: string = 'table'

  ModuleList: any[] = []

  AttachList: any[] = [];

  Information = new CallInformation()

  Selectedmodule: number = 0

  WorkStatusList: any[] = []


  SelectedmoduleName: string = ''

  call = new Addwork()
  Employeelist: any[] = []

  TaskList: any[] = []


  UserTypeList: any;
  EmpCode: string = ''
  EmpName: string = ''
  EmpId: number = 0
  wId: any = 0;

  Today: any
  fromdate: any
  todate: any
  CurrentDateTime: any;
  AttendenceBreakDetails: any
  TaskStatusList: any;

  TaskStatusFilter: number = 0
  TaskListDup: any[] = [];
  Departmentlist: any;
  //
  // Tasks = new Tasks()
  // ClientList: any;

  subscription: any;
  ProjectId: any
  projId: any;
  specificPages = ['/login', '/home/dashboard'];
  EmpData: any[] = [];
  ClientWorkStatusListReport: any[] = [];

  constructor(private comser: CommonService,
    private loader: LoadingController,
    private authser: AuthService,
    // private tser:TaskService,
    // private empser:EmployeeService,
    private router: Router,
    // private platform: Platform,
    // private location: Location,

    private datePipe: DatePipe,
    // private locser:LocationService,
    private modalController: ModalController,
    // private Commstr:CommonMasterService,
    private loading: LoadingController) {
    this.checkScreenSize()

    this.Today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fromdate = this.Today
    this.todate = this.Today
    this.CurrentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    // let where  = 'W.WORK_STATUS_ID IN (1)'
    this.LOaders()
  }

  NavigateTo(route: any) {
    this.router.navigate([route])
  }

  async GetModule() {
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })

    await loading.present();
    this.comser.GetModulesByProjectId().subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        console.log(data);
        this.ModuleList = data.Data
        if (this.ModuleList.length > 1) {
          this.ModuleList = data.Data.map((item: any) => ({
            ModuleId: item.MODULE_ID,
            ModuleName: item.MODULE_NAME
          }));
        }

      }
    }, (error: any) => {
      loading.dismiss()
    }
    )

  }



  ngOnInit() {
  }

  AddTasksMaster() {
    this.viewtype = 'form'
  }

  LOaders() {
    // this.getUserDetails()
    this.GetAtiveClientWorkStatus()
    this.GetModule()
    this.Getworklistproject(this.projId);
    this.GetModalStatus()

  }





  ClearFilters() {

    this.Selectedmodule = 0
    this.Getworklistproject(this.projId);
  }


  EditWork(items: any) {
    let t = this.authser.Encrypt(items)
    this.router.navigate(['home/AddCall', t])

  }


  async OnInfoView(projid: any) {
    const loading = await this.loader.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });

    await loading.present();

    this.comser.GetClientWorkStatusByProjectIdAsync(projid).subscribe(
      (data: any) => {
        loading.dismiss();

        console.log(data);

        if (data.Status === 200) {
          // let d = data.Data
          this.ClientWorkStatusListReport = data.Data.length > 0 ? data.Data.filter((x: any) => x.EXTERNAL_REMARKS !== null || x.ATTACH_FILE_COUNT > 0) : [];
          // this.TaskListDup = data.Data.length > 0 ? data.Data : [];
        } else {
          Swal.fire(data.Message, '', 'error');
          this.ClientWorkStatusListReport = [];
          this.ClientWorkStatusListReport = [];
        }
      },
      (error: any) => {
        console.error('Error fetching task list', error);
        loading.dismiss();
        this.ClientWorkStatusListReport = [];
        this.ClientWorkStatusListReport = [];
      }
    );
  }


  async Getworklistproject(projectid: any) {
    // Show loading indicator
    const loading = await this.loader.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });

    await loading.present();

    this.comser.Getworklistproject(projectid).subscribe(
      (data: any) => {
        loading.dismiss();

        console.log(data);

        if (data.Status === 200) {
          this.TaskList = data.Data.length > 0 ? data.Data.filter((x: any) => x.PROJECT_WORK_STATUS_ID == this.SelectedClientStatus) : [];
          this.TaskListDup = data.Data.length > 0 ? data.Data : [];
        } else {
          Swal.fire(data.Message, '', 'error');
          this.TaskList = [];
          this.TaskListDup = [];
        }
      },
      (error: any) => {
        console.error('Error fetching task list', error);
        loading.dismiss();
        this.TaskList = [];
        this.TaskListDup = [];
      }
    );
  }

  search(event: any) {
    let searchTerm = event?.target.value.toString().toLowerCase().trim(); // Convert search input to lowercase and trim whitespace

    if (searchTerm !== '') {
      this.TaskList = this.TaskListDup.filter((item: any) => {
        let d = (this.datePipe.transform(item.WORK_DATE, 'dd/MMM/yyyy') || '').toLowerCase(); // Ensure it's lowercase

        return (
          item.WORK_REFNO?.toString().toLowerCase().includes(searchTerm) ||
          item.CUST_NAME?.toString().toLowerCase().includes(searchTerm) ||
          item.PROJECT_NAME?.toString().toLowerCase().includes(searchTerm) ||
          item.MODULE_NAME?.toString().toLowerCase().includes(searchTerm) ||
          item.CALL_TYPE?.toString().toLowerCase().includes(searchTerm) ||
          item.ERROR_TYPE?.toString().toLowerCase().includes(searchTerm) ||
          item.WORK_STATUS?.toString().toLowerCase().includes(searchTerm) ||
          item.CALLED_DESCRIPTION?.toString().toLowerCase().includes(searchTerm) ||
          item.EMP_NAME?.toString().toLowerCase().includes(searchTerm) ||
          d.includes(searchTerm) ||  // Now safe and matches lowercase input
          item.EMERGENCY_TYPE?.toString().toLowerCase().includes(searchTerm)
        );
      });
    } else {
      this.TaskList = this.TaskListDup;
    }
  }







  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }




  async OpenModuleModal() {
    const modal = await this.modalController.create({
      component: CommonModalPage,
      componentProps: {
        DropDownData: this.ModuleList,
        Headers: ['Module'],
        Fields: ['ModuleName'],
        ModalHeader: 'Module List',
        CheckType: 'radio',
        UniqueField: 'ModuleId',
        SelectedItems: this.call.ModuleId != '' ? this.ModuleList.filter((x: any) => x.ModuleId == this.call.ModuleId) : []

        // AttendenceData: this.Attendence,
        // taskDescription: task.description
      }
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()

    // `data` contains the output data from the modal
    // `role` contains the role (e.g., "cancel", "confirm")
    if (role === 'confirm') {
      console.log('Selected Data:', data); // Handle the returned data
      let values = data.selected
      if (data.selected.length > 0) {
        this.call.ModuleId = data.selected[0].ModuleId
        this.call.ModuleName = data.selected[0].ModuleName
        this.TaskList = this.TaskListDup.filter((x: any) => x.MODULE_ID == data.selected[0].ModuleId)
        console.log(values);

      }
      else {
        this.TaskList = this.TaskListDup
        this.call.ModuleId = ''
        this.call.ModuleName = ''
        console.log(values);
      }

    } else {
      console.log('Modal dismissed without selection');
      this.call.ModuleName = this.call.ModuleId != '' ? this.call.ModuleName : ''
    }
  }



  async GetProjectAttach(PROJECT_WORK_ID: any) {
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
    console.log(PROJECT_WORK_ID)
    await loading.present();
    this.comser.GetProjectAttach(PROJECT_WORK_ID).subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        //console.log(this.call.CustomerId) Attachment
        console.log(data);
        this.AttachList = data.Data


      }
    }, (error: any) => {
      loading.dismiss()
    }
    )

  }

  isImage(filePath: string): boolean {
    return (
      filePath.toLowerCase().endsWith('.jpg') ||
      filePath.toLowerCase().endsWith('.jpeg') ||
      filePath.toLowerCase().endsWith('.png') ||
      filePath.toLowerCase().endsWith('.gif')
    );
  }


  DEleteWork(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Delete!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call your delete service here
        // this.authser.LogOutMethod()
        this.DeleteFunctionMEthod(item)

      }
    });
  }



  async DeleteFunctionMEthod(item: any) {
    // Show loading indicator
    const loading = await this.loader.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });

    await loading.present();
    this.comser.DeleteProjectWorkAsync(item.PROJECT_WORK_ID).subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        Swal.fire(data.Message, '', 'success')
        this.LOaders()
      }
      else {
        Swal.fire(data.Message, '', 'warning')
      }
    }, (error: any) => {
      loading.dismiss()
    })

  }

  OnStatusSelect(event: any) {

    let selected = event.target.value
    if (selected != '') {

      this.TaskList = this.TaskListDup.filter((x: any) => x.PROJECT_WORK_STATUS_ID == selected)
    }
    else {
      this.TaskList = this.TaskListDup
    }
  }

  async GetAtiveClientWorkStatus() {
    // Show loading indicator
    const loading = await this.loader.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });

    await loading.present();
    this.comser.GetActiveClientWorkStatuses().subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        //  Swal.fire(data.Message,'','success')
        //  this.LOaders()
        this.SelectedClientStatus = data.Data[0].CLIENT_WORK_STATUS_ID
        this.WorkStatusList = data.Data
      }
      else {
        Swal.fire(data.Message, '', 'warning')
      }
    }, (error: any) => {
      loading.dismiss()
    })

  }

  //#endregion Information Button

  ismobile: boolean = true
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.ismobile = window.innerWidth < 992;
    // console.log('Is Mobile:', this.isMobile);

    // let v = { mob: this.isMobile };
    // localStorage.setItem('viewsize', JSON.stringify(v));
  }


  WorkstatusupdateAttachList: any[] = []
  async GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID: any) {
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
    console.log(P_CLNT_WORK_STATUS_ID)
    await loading.present();
    this.comser.GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID).subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        //console.log(this.call.CustomerId) Attachment
        console.log(data);
        this.WorkstatusupdateAttachList = data.Data


      }
    }, (error: any) => {
      loading.dismiss()
    }
    )

  }

  ConfirmTask(items: any) {
    console.log(items);

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to confirm this work?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ConfirmWork(items.PROJECT_WORK_ID);
      }
    });
  }

  async ConfirmWork(a: any) {
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    await loading.present();
    this.comser.UpdateProjectWorkConfirmation(a).subscribe(
      (data: any) => {
        loading.dismiss();
        if (data.Status == 200) {
          Swal.fire(data.Message, '', 'success')
          // this.PreviousLeaveRequests();
          this.LOaders()

        } else {
          Swal.fire(data.Message, '', 'error');
        }
      },
      (error: any) => {
        loading.dismiss();
      }
    );
  }

  ClearModal(){
    this.Ws_Status='';
    this.Ws_Remarks='';
  }

  ModalStatusList:any[]=[];
  Ws_Status:any;
  Ws_Remarks:any;
  projectWorkId:any;
  projectWorkStatusId:any;

  UpdateWork(items:any) {
  console.log(items);
   this.projectWorkStatusId = items.PROJECT_WORK_STATUS_ID;
   this.projectWorkId = items.PROJECT_WORK_ID;
  }



  async GetModalStatus() {
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })

    await loading.present();
    this.comser.GetClientWorkStatusesAsync().subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        console.log(data);
        this.ModalStatusList = data.Data
      }
    }, (error: any) => {
      loading.dismiss()
    }
    )
  }


  
  async SubmitWorkStatus() {
    console.log(this.Ws_Remarks, this.Ws_Status);

    if (this.Ws_Status != '') {
      if (this.Ws_Remarks != '') {
        const loading = await this.loading.create({
          cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
          message: 'Loading...', // Optional: Custom message
          spinner: 'dots', // Optional: Choose a spinner
        })
        // console.log(this.clientId)
        await loading.present();
        this.comser.UpdateProjectWorkStatus( this.projectWorkId,this.projectWorkStatusId,this.Ws_Remarks)
          .subscribe((data: any) => {
            loading.dismiss()
            console.log(data);
            if (data.Status == 200) {
              Swal.fire(data.Message, '', 'success')

              //   this.ClearWorkStatus()
              //   this.Getprojectclientlist()
              this.closeModal()
              // this.Submit()
              // this.ClearList()
              this.ClearModal()
              this.LOaders()

            }
            else {
              Swal.fire(data.Message, '', 'error')
            }

          }, (error: any) => {
            loading.dismiss()
          })
      }
      else {
        Swal.fire('Enter remark', '', 'warning')
      }
    }
    else {
      Swal.fire('Select Status', '', 'warning')
    }
  }


  closeModal() {
    const modal = document.getElementById('AttachmentModal4'); // Get modal element
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
      modalInstance?.hide(); // Hide modal
    }
  }

}
