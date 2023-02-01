import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidenavRoute } from '../../interfaces/sidenav-option.interface';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  /**route clicked emitter */
  @Output() routeClicked = new EventEmitter();
  /**navigate with router or with components */
  @Input() navigateWithRouter = true;
  /**routes */
  @Input() routes: SidenavRoute[] = [];
  /**actual link selected */
  @Input() actualLink!: string;
  /**show sub routes */
  showSubRoutes = false;
  /**route index selected */
  currentRouteIndex = -1;
  /**router subscription */
  routerSub = new Subscription();
  /**animation name for subroutes */
  animationName = 'fadeIn';

  /**
   *
   * @param router router service to manage routes
   */
  constructor(public router: Router) {}

  /**
   * on component initialization
   */
  ngOnInit(): void {
    if (this.navigateWithRouter) {
      this.open(this.router.url);
      this.routerSub = this.router.events.subscribe((resp) => {
        if (resp instanceof NavigationEnd) {
          this.open(resp.url);
        }
      });
    }
  }

  /**
   * navigate to the route
   */
  navigate(link: string) {
    if (link === '') {
      return;
    }
    this.router.navigateByUrl(link);
    this.animationName = 'fadeInDown';
  }

  /**
   * opens the route
   * @param link route link to be redirected
   */
  open(link: string) {
    if (this.navigateWithRouter) {
      const route: any = this.routes.find((route) => route.link === link);

      if (route) {
        this.currentRouteIndex = this.routes.indexOf(route);
        if (route.subRoutes.length === 0) {
          this.navigate(link);
        } else {
          const subRoute = route.subRoutes.find((route: any) => !route.hidden);
          this.navigate(subRoute.link);
          this.showSubRoutes = true;
        }
      } else {
        this.routes.forEach((routeItem, i) => {
          if (routeItem.subRoutes) {
            routeItem.subRoutes.forEach((subRoute: any) => {
              if (subRoute.link === link) {
                this.currentRouteIndex = i;
                this.showSubRoutes = true;
              }
            });
          }
        });
      }
    } else {
      const route: any = this.routes.find((route) => route.link === link);
      if (route.disabled) {
        return;
      }
      this.actualLink = link;
      if (route.touched === false) {
        route.touched = true;
      }
      this.routeClicked.emit(route);
    }
  }

  /**
   * on component destroy
   */
  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}
