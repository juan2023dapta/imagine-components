import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImagineInputDocumentationComponent } from './pages/imagine-input-documentation/imagine-input-documentation.component';
import { ImagineSelectDocumentationComponent } from './pages/imagine-select-documentation/imagine-select-documentation.component';
import { ImagineFormsDocumentationComponent } from './pages/imagine-forms-documentation/imagine-forms-documentation.component';

const routes: Routes = [
  {
    path: 'input',
    component: ImagineInputDocumentationComponent,
  },
  {
    path: 'forms',
    component: ImagineFormsDocumentationComponent,
  },
  {
    path: 'select',
    component: ImagineSelectDocumentationComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'input',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'input',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsDocumentationRoutingModule {}
