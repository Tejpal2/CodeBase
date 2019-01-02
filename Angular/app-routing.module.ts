import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginHeaderComponent } from './shared/login-header/login-header.component';
import { MainHeaderComponent } from './shared/main-header/main-header.component';
import { MainFooterComponent } from './shared/main-footer/main-footer.component';
import { MainSidebarComponent } from './shared/main-sidebar/main-sidebar.component'; 
import { AuthGuardService} from './common-module/shared-services/auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: '', children: [
            { path: '', component: LoginHeaderComponent, outlet: 'header' },
            { path: 'login', loadChildren: './login-module/login-module.module#LoginModuleModule'}, 
        ],
    },
    {
        path: '', children: [
            { path: '', component: MainHeaderComponent, outlet: 'header' },
            { path: '', component: MainFooterComponent, outlet: 'footer' },  
            { path: '', component: MainSidebarComponent, outlet: 'sidebar' }, 
            { path: 'dashboard', loadChildren: './dashboard-module/dashboard.module#DashboardModule',canActivate: [AuthGuardService]},  
            { path: 'demo', loadChildren: './demo-component/demo-component.module#DemoComponentModule',canActivate: [AuthGuardService]}, 
            { path: 'card', loadChildren: './card-module/card-module.module#CardModuleModule',canActivate: [AuthGuardService]},
            { path: 'plan', loadChildren: './plan-module/plan-module.module#PlanModuleModule',canActivate: [AuthGuardService]},
			{ path: 'company', loadChildren: './company-module/company-module.module#CompanyModuleModule',canActivate: [AuthGuardService]},   
        ]
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[]
})
export class AppRoutingModule { }