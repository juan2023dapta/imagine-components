import { Component, OnInit } from '@angular/core';
import { SidenavRoute } from 'src/app/library/components/sidenav/interfaces/sidenav-option.interface';

@Component({
  selector: 'imagine-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent implements OnInit {
  /**principal routes */
  routes: SidenavRoute[] = [
    {
      link: 'Forms',
      name: 'Forms',
      subRoutes: [
        {
          link: '/docs/forms/input',
          name: 'Input',
        },
        {
          link: '/docs/forms/select',
          name: 'Select',
        },
        {
          link: '/docs/forms/pop-up',
          name: 'Pop Up',
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
