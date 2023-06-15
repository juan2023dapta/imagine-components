import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { SidenavModule } from '../library/components/sidenav/sidenav.module';
import { ImaginePopUpModule } from '../library/components/imagine-pop-up/imagine-pop-up.module';

@NgModule({
  declarations: [DocumentationComponent],
  imports: [CommonModule, DocumentationRoutingModule, SidenavModule, ImaginePopUpModule],
})
export class DocumentationModule {}
