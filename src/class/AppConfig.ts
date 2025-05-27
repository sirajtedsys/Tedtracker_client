export class AppConfig{
   url:string='http://88.201.64.166:56/tracker.local/api'  //dev/
    //  url:string='https://localhost:7010/api' 
    websocket:string=''
       

    extractProtocol(url: string): string | null {
        const match = url.match(/^(https?):\/\//);
        return match ? match[1] : null;
    }


    extractIPWithPort(url: string): string | null {
        const match = url.match(/((?:\d{1,3}\.){3}\d{1,3}|\blocalhost\b|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d+)?/);
        return match ? match[0] : null;
    }
    
    


    findhttporhttpsForWebSocket(storedUrl:any){
        if(this.extractProtocol(storedUrl)=='https')
        {
            return 'wss'
        }
        else
        {
            return 'ws'
        }

    }
    //local =: 'https://localhost:7102/api'
    // url:string='http://misv3/api'    //localtest
    // url:string='http://192.168.1.201:900/api'   //mysystem iis

    // url:string='https://api.bharathhospital.co.in/api'
    // url:string='https://api.imchospitals.com/api'       //tesla live
    // url:string='https://futureaceapi.remedihms.com/api'
    // url:string='https://fumeraapi.remedihms.com/api'     //cimar live

    // url:string='http://202.88.253.250/api.local/api'

    // url:string='http://192.168.0.249/api.local/api'


    // constructor() {
    //     const storedUrl = localStorage.getItem('tedtrackurl'); // Retrieve from localStorage
    //     let urlnew = storedUrl
    //     console.log(storedUrl);

        
    //      this.url = storedUrl+'/api.local/api' ; // Default URL if not found
    //     // this.url = storedUrl+'/api' ; 
    //     if(urlnew!=null)
    //     {

    //         this.websocket = this.findhttporhttpsForWebSocket(this.url)+'://'+this.extractIPWithPort(urlnew)
    //     }
    //     console.log(this.websocket);
        

    // }


    // constructor() {
    //     const storedUrl = localStorage.getItem('tedtrackurl'); // Retrieve from localStorage
    //     let urlnew = 'http://88.201.64.166:56/tracker.local/api'
    //     console.log(storedUrl);
        
    //     // this.url = storedUrl+'/api' ; // Default URL if not found
    //     this.url = urlnew
    //     // if(urlnew!=null)
    //     // {

    //     //     this.websocket = this.findhttporhttpsForWebSocket(this.url)+'://'+this.extractIPWithPort(urlnew)
    //     // }
    //     // console.log(this.websocket);
     
    // }
}


 
