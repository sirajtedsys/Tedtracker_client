import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    children:[
   
      {
        path: 'profile',
        loadComponent: () => import('./home/profile/profile.page').then( m => m.ProfilePage)
      },
    
      {
        path: 'menu',
        loadComponent: () => import('./home/menu/menu.page').then( m => m.MenuPage)
      },
   
       {
        path: 'AddCall/:Id',
        loadComponent: () => import('./home/add-call/add-call.page').then( m => m.AddCallPage)
      },
   
    
      {
        path: 'call-list',
        loadComponent: () => import('./home/call-list/call-list.page').then( m => m.CallListPage)
      },


    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./shared/login/login.page').then( m => m.LoginPage),
  
  },

  // {
  //   path: 'config',
  //   loadComponent: () => import('./shared/enter-url/enter-url.page').then( m => m.EnterUrlPage)
  // },

 





];
