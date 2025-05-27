import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import {LoadingController,ModalController} from '@ionic/angular'
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
import { Calldet } from 'src/class/Calldet';
import { CommonModalPage } from 'src/app/shared/common-modal/common-modal.page';
import { ActivatedRoute, Router } from '@angular/router';
import { Addwork } from 'src/class/AddWork';
import { AppConfig } from 'src/class/AppConfig';
import { AuthService } from 'src/services/auth.service';



@Component({
  selector: 'app-add-call',
  templateUrl: './add-call.page.html',
  styleUrls: ['./add-call.page.scss'],
  standalone: true,
  // imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
  imports: [ CommonModule, FormsModule]
})
export class AddCallPage implements OnInit {
  Today:any
  clientId:any
  ProjectId:any
  SelectedDate:any
  EmpData:any[]=[]
  ProjectList:any[]=[]
  CallTypeList:any[]=[]
  EmergencyList:any[]=[]
  ModuleList:any[]=[]
  ErrorList:any[]=[]
  CustomerList:any[]=[]
  EmployeeList:any[]=[]
  call = new Addwork()
  TaskList:any[]=[]
  projId: any;
  AttachList:any[]=[];

  @ViewChild('fileInput') fileInput!: ElementRef;
appconfig = new AppConfig()

  constructor(
    private loader:LoadingController,
    private router:Router,
    private modalController:ModalController,
    private comser:CommonService,  private datepipe:DatePipe,
    private route:ActivatedRoute,private authser:AuthService
  ) {
       this.OnPageLoad()
   }
   OnPageLoad(){
    
    this.GetModule()
    this.checkScreenSize()
    
    this.Getworklist(this.projId);
    const id = this.route.snapshot.paramMap.get('Id');
    console.log(id);
    if(id!=null && Number(id) === 0)
    {
      this.Today = this.datepipe.transform(new Date(),'yyyy-MM-dd')
      this.SelectedDate=this.Today
      this.call.ProjectWorkDate=this.Today
     // this.empex.ExpDate=this.Today
     let tod = this.datepipe.transform(new Date(),'dd/MM/yyyy')
  
   
      this.GetRefNo(tod)
    }
    else if(id!=null)
    {
      let dec  =  this.authser.Decrypt(id)
      console.log(dec);
      this.EditWork(dec)
      
    }

  }


  ngOnInit() {
  }


  DEleteWork(item:any){
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
  

  EditWork(items:any){
    console.log(items);

    this.call.CalledDescription = items.CALLED_DESCRIPTION
    this.call.ContactName = items.CONTACT_NAME
    this.call.ContactNo = items.CONTACT_NO
    this.call.ModuleId = items.MODULE_ID
    this.call.ModuleName = items.MODULE_NAME
    this.call.ProjectId = items.PROJECT_ID
    this.call.ProjectName = items.PROJECT_NAME
    this.call.ProjectWorkDate = this.datepipe.transform(items.PROJECT_WORK_DATE,'yyyy-MM-dd')
    this.call.ProjectWorkStatusId = items.PROJECT_WORK_STATUS_ID
    this.call.Project_WorkId = items.PROJECT_WORK_ID
    this.call.ATTACH_FILE_COUNT = items.ATTACH_FILE_COUNT
    this.wrefno = items.PROJECT_WORK_REFNO
  //   {
  //     "PROJECT_NAME": "A M HOSPITAL-REMEDI HIS SOFTWARE",
  //     "MODULE_NAME": "Dimerge",
  //     "PROJECT_WORK_ID": 63,
  //     "PROJECT_WORK_NO": 23,
  //     "PROJECT_WORK_REFNO": "PW000023-05/2025",
  //     "PROJECT_WORK_DATE": "2025-05-12T00:00:00",
  //     "PROJECT_ID": 1210000099,
  //     "MODULE_ID": 22,
  //     "CONTACT_NAME": "new task",
  //     "CONTACT_NO": "98989898",
  //     "CREATE_DATE": "2025-05-12T14:48:29",
  //     "CALLED_DESCRIPTION": "work new one",
  //     "PROJECT_WORK_STATUS_ID": 1,
  //     "ATTACH_FILE_COUNT": 1,
  //     "CLIENT_WORK_STATUS": "Task Created"
  // }
    

  }
  
  
  async DeleteFunctionMEthod(item:any){
       // Show loading indicator
       const loading = await this.loader.create({
        cssClass: 'custom-loading',
        message: 'Loading...',
        spinner: 'dots',
      });
      
      await loading.present();
      this.comser.DeleteProjectWorkAsync(item.PROJECT_WORK_ID).subscribe((data:any)=>{
        loading.dismiss()
        if(data.Status==200)
        {
          Swal.fire(data.Message,'','success')
          // this.router.navigate
          this.OnPageLoad()
        }
        else
        {
          Swal.fire(data.Message,'','warning')
        }
      },(error:any)=>{
        loading.dismiss()
      })
  
  }

  ismobile:boolean=true
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.ismobile =   window.innerWidth < 992;
    // console.log('Is Mobile:', this.isMobile);
  
    // let v = { mob: this.isMobile };
    // localStorage.setItem('viewsize', JSON.stringify(v));
  }

  WorkAssignDateCahnge(event:any){
    console.log(event.target.value);
    
    let date = this.datepipe.transform(event.target.value,'dd/MM/yyyy')
    // this.GetRefNo(date)
  }


  async GetModule(){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetModulesByProjectId().subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            console.log(data);
            this.ModuleList = data.Data
            if(this.ModuleList.length>1)
            {
            this.ModuleList = data.Data.map((item: any) => ({
              ModuleId: item.MODULE_ID,
              ModuleName: item.MODULE_NAME
            }));
          }
            // console.log(this.ModuleList)
            // if(this.ModuleList.length>1)
            //   {
            //     console.log(data.Data[0].MODULE_ID)
            //     this.call.ModuleId=data.Data[0].MODULE_ID
            //     this.call.ModuleName=data.Data[0].MODULE_NAME
  
            //   }
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }

 
  ClientWorkStatusListReport: any[]=[];
  async  OnInfoView(projid:any)
  {
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
          this.ClientWorkStatusListReport = data.Data.length > 0 ? data.Data.filter((x:any)=>x.EXTERNAL_REMARKS!==null || x.ATTACH_FILE_COUNT>0) : [];
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

  CheckMandatory(){
   
      if(this.call.ProjectWorkDate!=null && this.call.ProjectWorkDate!='')
        {

            // if(this.call.CustomerId!=null && this.call.CustomerId!=0)
            // if(this.call.ProjectId!=null && this.call.ProjectId!='')
            // {
            

                  // if(this.call.ProjectId!=null && this.call.ProjectId!=0)
                  if(this.call.ModuleId!=null && this.call.ModuleId!='')
                  {
                 
                          if(this.call.CalledDescription!='')
                          {
                            
                              return true
                          }
                          else
                          {
                            Swal.fire('Please Ener Description to continue','','warning')
                            return false
                          }
                   
                  }
                  else
                  {
                    // Swal.fire('Please select a Project to continue','','warning')
                    Swal.fire('Please select a Module to continue','','warning')
                    return false
                  }
         
            // }
            // else
            // {
            //   // Swal.fire('Please select a Client to continue','','warning')
            //   Swal.fire('Please select a Project to continue','','warning')
              
            //   return false
            // }
          }
          else
          {
            Swal.fire('Please select a Date to continue','warning')
            return false
          }
  
  }

  async Submit(){


    if(this.CheckMandatory())
    {
      const loading = await this.loader.create({
        cssClass: 'custom-loading',
        message: 'Loading...',
        spinner: 'dots',
      });
      if(this.call.Project_WorkId=='')
      {
        await loading.present();
        this.comser.SaveAddCall(this.call).subscribe((data:any)=>{
          console.log(data,"dta");

          loading.dismiss()
          if(data.Status==200)
          {
            Swal.fire(data.Message,'','success')
            
            this.onUploadFiles(data.Data)
            this.Clear();
          }
          else{
            Swal.fire(data.Message,'','warning')
          }
    
        },(error:any)=>{
          loading.dismiss()
          console.log(error,"error");
          
        })
      }
      else
      {
          await loading.present();
          this.comser.UpdateProjectWorkDetails(this.call).subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
               
            Swal.fire(data.Message,'','success')

            this.onUploadFiles(this.call.Project_WorkId)
            this.router.navigate(['home/call-list'])
            this.Clear();
            }
            else
            {
              Swal.fire(data.Mesage,'','error')
            }
          },(error:any)=>{
            loading.dismiss()
          })

      }
         

    }
  
    
  }

  DeleteAttchment(item:any){
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
          this.DeleteAttachmentFunctionMEthod(item)
          
      }
  });
  }

  async DeleteAttachmentFunctionMEthod(item:any){
    // Show loading indicator
    const loading = await this.loader.create({
     cssClass: 'custom-loading',
     message: 'Loading...',
     spinner: 'dots',
   });
   
   await loading.present();
   this.comser.DeleteAttachFileAsync(item.ATTACH_FILE_ID).subscribe((data:any)=>{
     loading.dismiss()
     if(data.Status==200)
     {
       Swal.fire(data.Message,'','success')
       // this.router.navigate
      //  this.OnPageLoad()
      this.GetProjectAttach(item.WORK_ID)
     }
     else
     {
       Swal.fire(data.Message,'','warning')
     }
   },(error:any)=>{
     loading.dismiss()
   })

}

  
  Clear(){
    this.call = new Addwork()
    this.EmpData=[]
    this.ModuleList=[]
    this.call.ContactNo=''
    this.call.ContactName='';
    this.call.CalledDescription='';
 
    this.selectedFiles=[]
    this.resetFileInput()
    // this.OnPageLoad()
    this.Getworklist(this.projId);
    this.GetModule();
    
    this.Today = this.datepipe.transform(new Date(),'yyyy-MM-dd')
    this.SelectedDate=this.Today
    this.call.ProjectWorkDate=this.Today
   // this.empex.ExpDate=this.Today
   let tod = this.datepipe.transform(new Date(),'dd/MM/yyyy')
   this.router.navigate(['home/AddCall/0'])
  }



  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  async OpenModuleModal(){
    const modal = await this.modalController.create({
      component: CommonModalPage,
      componentProps: {
        DropDownData:this.ModuleList,
        Headers:['Module'],
        Fields:['ModuleName'],
        ModalHeader:'Module List',
        CheckType:'radio',
        UniqueField:'ModuleId',
        SelectedItems:this.call.ModuleId!=''?this.ModuleList.filter((x:any)=>x.ModuleId==this.call.ModuleId):[]
        
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
        if(data.selected.length>0)
        {
          this.call.ModuleId=data.selected[0].ModuleId
          this.call.ModuleName=data.selected[0].ModuleName
          console.log(values);

        }
        else
        {
          
        this.call.ModuleId=''
        this.call.ModuleName=''
        console.log(values);
        }
        // this.SelectedBranchCustomers=data.selected
        // this.CustomersName = values['Customer Name'];

        // this.BranchCustomersName = values.map((item:any) => item.CUST_NAME).join(', ');
        // console.log(this.BranchCustomersName);
        // let custid  = values.map((item: any) => `${item.CUST_ID}`).join(',');

        // let scid = this.SectionData.SCT_ID
        // await this.GetAppCustFlexFill(scid,custid)
    
      
        
        // console.log(custid,'custids');
      } else {
        console.log('Modal dismissed without selection');
        this.call.ModuleName=this.call.ModuleId!=''?this.call.ModuleName:''
      }
  }



  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }


  

  wrefno:any
  workid:any

async GetRefNo(D:any){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetRefNo(D).subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            console.log(data);
            // this.call.WorkRefNo = data.Data
            this.wrefno=data.Data
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }

selectedFiles:any[]=[]
  uploadFiles(event: any) {
    // Get the selected files from the input
    const files: FileList = event.target.files;

    // Clear the existing files in case of re-selection
    this.selectedFiles = [];

    // Loop through all selected files and push them to the array
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }

    console.log('Selected files:', this.selectedFiles); // Log the selected files
  }

  // Method to handle file upload (triggered by button click)
  onUploadFiles(workid:any) {
    // Ensure that files are selected before proceeding with the upload
    if (this.selectedFiles.length > 0) {
      // You can loop through the selected files and upload each file with its data
      this.selectedFiles.forEach(file => {
        const dailyData = {
          task: 'Upload daily task',
          date: new Date().toISOString()
        };
console.log(this.wrefno)
        // Call the service to upload each file
        this.comser.uploadFilesClient(dailyData, file,this.wrefno,workid).subscribe(
          response => {
            console.log('File uploaded successfully:', response);
          },
          error => {
            console.error('Error occurred while uploading file:', error);
          }
        );
      });
    } else {
      console.error('No files selected');
    }
  }

  async Getworklist(projectid: any) {
    // Show loading indicator
    const loading = await this.loader.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    
    await loading.present();
  
    this.comser.Getworklist(projectid).subscribe(
      (data: any) => {
        loading.dismiss();
  
        console.log(data);
  
        if (data.Status === 200) {
          this.TaskList = data.Data.length > 0 ? data.Data : [];
        } else {
          Swal.fire(data.Message, '', 'error');
          this.TaskList = [];
        }
      },
      (error: any) => {
        console.error('Error fetching task list', error);
        loading.dismiss();
        this.TaskList = [];
      }
    );
  }
  async GetProjectAttach(PROJECT_WORK_ID:any)
  {
     const loading = await this.loader.create({
       cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
       message: 'Loading...', // Optional: Custom message
       spinner: 'dots', // Optional: Choose a spinner
       // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
     })
         console.log(PROJECT_WORK_ID)
         await loading.present();
         this.comser.GetProjectAttach(PROJECT_WORK_ID).subscribe((data:any)=>{
           loading.dismiss()
           if(data.Status==200)
           {
             //console.log(this.call.CustomerId) Attachment
             console.log(data);
              this.AttachList = data.Data
             
  
           }
         },(error:any)=>{
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


  WorkstatusupdateAttachList:any[]=[]
  async GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID:any)
  {
     const loading = await this.loader.create({
       cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
       message: 'Loading...', // Optional: Custom message
       spinner: 'dots', // Optional: Choose a spinner
       // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
     })
         console.log(P_CLNT_WORK_STATUS_ID)
         await loading.present();
         this.comser.GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID).subscribe((data:any)=>{
           loading.dismiss()
           if(data.Status==200)
           {
             //console.log(this.call.CustomerId) Attachment
             console.log(data);
              this.WorkstatusupdateAttachList = data.Data
             
  
           }
         },(error:any)=>{
           loading.dismiss()
         }
       )
  
   }
}
