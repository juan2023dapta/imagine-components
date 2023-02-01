import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationComponent } from './pages/documentation/documentation.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentationComponent,
    children: [
      {
        path: 'forms',
        loadChildren: () =>
          import('../forms-documentation/forms-documentation.module').then(
            (m) => m.FormsDocumentationModule
          ),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'forms',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'forms',
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
