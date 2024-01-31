import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [ // Lazy loading
  {
    path: 'selector',
    loadChildren: () => import ('./countries/countries.module').then(m =>m.CountriesModule), // lazyLoad. Path del módulo hijo de app
  },
  {
    path: '**',
    redirectTo: 'selector',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
