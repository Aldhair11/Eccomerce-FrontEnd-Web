import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { CartComponent } from './pages/cart/cart.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FAQComponent } from './pages/FAQ/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { InfoproductsComponent } from './pages/infoproducts/infoproducts.component';
import {ProductsAdminComponent} from './pagesAdmin/products-admin/products-admin.component';
import { CategoriesAdminComponent } from './pagesAdmin/categories-admin/categories-admin.component';
import { BrandsAdminComponent } from './pagesAdmin/brands-admin/brands-admin.component';
import {AuditAdminComponent} from './pagesAdmin/audit-admin/audit-admin.component';
import {AdminGuard} from './core/security/admin.guard';
import { ContactAdminComponent } from './pagesAdmin/contact-admin/contact-admin.component';
import { FaqAdminComponent } from './pagesAdmin/faq-admin/faq-admin.component';
import {UserAdminComponent} from './pagesAdmin/user-admin/user-admin.component';
import {ProfileComponent} from './pages/profile/profile.component';
import { SubcategoriesAdminComponent } from './pagesAdmin/subcategories-admin/subcategories-admin.component';
import {AuthGuard} from './core/security/auth.guard';
import {PasswordrecoveryComponent} from './pages/passwordrecovery/passwordrecovery.component';
import {LoginGuard} from './core/security/login.guard';


export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch:'full'},
    {path:'products', component: ProductsComponent},
    {path: ':categoryName/products', component: ProductsComponent},
    {path: ':categoryName/products/:idProduct', component: InfoproductsComponent},
    {path:'categories', component: CategoriesComponent},
    {path:'about', component: AboutComponent},
    {path:'cart', component: CartComponent},
    {path:'contact', component: ContactComponent},
    {path:'FAQ', component: FAQComponent},
    {path:'home', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path: 'login/recover', component: PasswordrecoveryComponent, canActivate: [LoginGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'admin/dashboard', component: ProductsAdminComponent, canActivate: [AdminGuard]},
    {path: 'admin/Categories', component: CategoriesAdminComponent, canActivate: [AdminGuard]},
    {path: 'admin/Brands', component: BrandsAdminComponent, canActivate: [AdminGuard]},
    {path: 'admin/reports', component: AuditAdminComponent, canActivate: [AdminGuard]},
    {path: 'admin/contacts', component: ContactAdminComponent, canActivate: [AdminGuard]},
    {path: 'admin/faq', component: FaqAdminComponent, canActivate: [AdminGuard]},
    {path: 'admin/users', component: UserAdminComponent, canActivate: [AdminGuard]},
    {path: 'admin/subcategories', component: SubcategoriesAdminComponent, canActivate: [AdminGuard]},
    {path: '**', redirectTo: '/home'}
];
