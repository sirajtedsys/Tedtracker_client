import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, retry, throwError } from 'rxjs';
// import { AppConfig } from 'src/Class/AppConfig';
import { AuthService } from './auth.service';
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { AppConfig } from 'src/class/AppConfig';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  appconfig =new AppConfig()
  decryptiondata:any

  

  constructor(private http:HttpClient,private authser:AuthService,private loadingCtrl:LoadingController,
    private datePipe:DatePipe,private router:Router) { }
  isLoading:boolean=false
  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    await loading.present();

    // Uncomment below line to auto-hide the loader after 2 seconds (duration)
    // setTimeout(() => loading.dismiss(), 2000);
  }

  


  CheckForUnAuthorised(error:any){
    if(error.status==401)
    {
      // window.location.reload()
      this.authser.LogOutMethod()
      this.router.navigate(['login'])
    }

  }

  CheckFor404(error:any){
    if(error.status==404)
    {
      // window.location.reload()
      Swal.fire("Oops! The requested resource was not found.",'','error')
      // this.authser.LogOutMethod()
      // this.router.navigate(['login'])
    }

  }

  CheckForSt0(error:any){
    if(error.status==0)
    {
      // window.location.reload()
      Swal.fire("Request failed! The server may be down or unavailable",'','error')
      // this.authser.LogOutMethod()
      // this.router.navigate(['login'])
    }

  }

  //  "Request failed! The server may be down or unavailable."

  async dismissLoading() {
    this.isLoading = false;
    await this.loadingCtrl.dismiss();
  }

  formatDate(date: string): string {
    const transformedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    return transformedDate ? transformedDate : ''; // Handle null case
  }

  getFirstDayOfMonth(date: Date): Date {
    // Create a new date object based on the provided date
    const firstDay = new Date(date);
    
    // Set the date to 1, which will automatically adjust the month
    firstDay.setDate(1);
    
    // Return the first day of the month
    return firstDay;
  }



  GetDecryptedData(){
    this.decryptiondata= this.authser.DecryptToken()
    }

    calculateAge(dob: string): number {
      const birthDate = new Date(dob);
      // console.log(birthDate);
      
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
  
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      // console.log(age);
      
      return age;
    }

    isValidEmail(email: string): boolean {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    isUrlOrIp(input: string): boolean {
      // Updated regular expression for URLs, including localhost and optional port numbers
      const urlRegex = /^(https?:\/\/)?((localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63})|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/;

      // Regular expression for IPv4 addresses
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
      // Check if the input matches either the updated URL regex or the IP regex
      return urlRegex.test(input) || ipRegex.test(input);
    }


    getSumByKey<T>(arr: T[], key: keyof T): number {
      return arr.reduce((sum, obj) => sum + (Number(obj[key]) || 0), 0);
    }
    // SaveOrUpdateDevice(string deviceId, string fcmToken, string name, string dispLocationId

  LoginCheck(Username:string,password:string) 
  {
  let cred={
      UserName:Username,
      Password:password

    }
    let headers = new HttpHeaders();
    headers.set("Accept", 'application/json');
    headers.set('Content-Type', 'application/json');
    // headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
    let options ={ headers: headers };
    return this.http.post(this.appconfig.url + '/TTCCommon/CheckProjectLogin',cred, options)
    .pipe(
        
      catchError((error: any) => {
        // alert(error)
        // Handle the error here or rethrow it as needed
        console.error('Error in LoginCheck:', error);
        return throwError(error); // Rethrow the error
      })
    );
}


GetProjectDetails() 
{
this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetProjectDetails', options)
  .pipe(
      
    catchError((error: any) => {
      
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // alert(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetProjectDetails:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetModulesByProjectId() 
{
this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetModulesByProjectId', options)
  .pipe(
      
    catchError((error: any) => {
      
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // alert(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetModulesByProjectId:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
SaveAppProjectWork(exp:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/TTCCommon/SaveAppProjectWork',exp, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in SaveAppProjectWork:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetRefNo(ondate:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetRefNo?ondate='+ondate, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetRefNo:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
SaveAddCall(exp:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/TTCCommon/SaveAppProjectWork',exp, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in SaveAddCall:', error);
      return throwError(error); // Rethrow the error
    })
  );
}




uploadFilesClient(daily: any, file: File,wrefno:any,workid:any) {
  this.GetDecryptedData(); // Fetch decrypted data (e.g., token)

  // Create a FormData object to send both the file and other data
  const formData: FormData = new FormData();
  formData.append('daily', JSON.stringify(daily)); // Send the daily data as a string
  formData.append('file', file); // Append the file to the form data
  formData.append('wrefno', JSON.stringify(wrefno)); 
  formData.append('workid', workid); 
  // Set headers
  let headers = new HttpHeaders().set("Accept", 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata)

  // Setup options with headers
  let options = { headers: headers };

  // Send the request with the file and data as FormData
  return this.http.post(this.appconfig.url + '/TTCCommon/FileUpload', formData, options)
    .pipe(
      catchError((error: any) => {
        // Handle errors
        this.CheckForUnAuthorised(error);
        this.CheckFor404(error);
        this.CheckForSt0(error);

        console.error('Error in FileUpload:', error);
        return throwError(error);
      })
    );
}


Getworklist(projectid:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/Getworklist?projectid='+projectid, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in Getworklist:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

Getworklistproject(projectid:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/Getworklistproject?projectid='+projectid, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in Getworklist:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetProjectAttach(ProjectWorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetAttach?ProjectWorkId='+ProjectWorkId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



DeleteProjectWorkAsync( workId:any)
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/DeleteProjectWorkAsync?workId='+workId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in DeleteProjectWorkAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetActiveClientWorkStatuses() 
{
this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetActiveClientWorkStatuses', options)
  .pipe(
      
    catchError((error: any) => {
      
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // alert(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetActiveClientWorkStatuses:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

UpdateProjectWorkDetails(exp:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/TTCCommon/UpdateProjectWorkDetails',exp, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in UpdateProjectWorkDetails:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetClientWorkStatusByProjectIdAsync(projectWorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetClientWorkStatusByProjectIdAsync?projectWorkId='+ projectWorkId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
      this.CheckFor404(error)
      this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in GetClientWorkStatusByProjectIdAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

DeleteAttachFileAsync(fileId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/DeleteAttachFileAsync?fileId='+ fileId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
      this.CheckFor404(error)
      this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in GetClientWorkStatusByProjectIdAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetWorkStatusUpAttach?P_CLNT_WORK_STATUS_ID='+P_CLNT_WORK_STATUS_ID, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
UpdateProjectWorkConfirmation(projectWorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/UpdateProjectWorkConfirmation?projectWorkId=' + projectWorkId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in UpdateProjectWorkConfirmation:', error);
      return throwError(error); // Rethrow the error
    })
  );
}




GetClientWorkStatusesAsync() 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/GetClientWorkStatusesAsync' , options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetClientWorkStatues:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



UpdateProjectWorkStatus(projectWorkId:any, projectWorkStatusId:any, updateRemarks:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/TTCCommon/UpdateProjectWorkStatus?projectWorkId=' + projectWorkId + 
    '&projectWorkStatusId=' + projectWorkStatusId + '&updateRemarks=' + updateRemarks, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in UpdateProjectWorkStatus:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
}
