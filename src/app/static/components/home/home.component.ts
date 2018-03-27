import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';

/**
 * Landing page
 */
@Component({
  selector: 'b2b-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions$: Subscription[];
  profile: any;
  environment: any;

  constructor(private authService: AuthService, private modalRef: NgbModal) {}

  /**
   * Handles user login due to home is the callback for Auth0
   */
  ngOnInit() {
    this.subscriptions$ = [];
    this.authService.handleAuthentication();
    this.subscriptions$.push(
      this.authService.profile$.subscribe(res => {
        this.profile = res;
      })
    );
    this.environment = environment;
  }

  /**
   * Once the view has been rendered,
   * adds a listener to the window to change the menu class for when the user scrolls and also
   * a parallax effect in some containersF
   */
  ngAfterViewInit() {
    $(window).scroll(function() {
      if ($(window).scrollTop() > 50) {
        $('#header').addClass('sticky');
      } else {
        $('#header').removeClass('sticky');
      }
    });

    $('.parallax-window-mainpage').parallax({
      imageSrc: './assets/img/mainpage.jpg',
    });
    $('.parallax-window-transition-why-travelgatex').parallax({
      imageSrc: './assets/img/transition-why-travelgatex.jpg',
    });
    $('.parallax-window-transition-products').parallax({
      imageSrc: './assets/img/transition-products.jpg',
    });
    $('.parallax-window-transition-knowmore').parallax({
      imageSrc: './assets/img/transition-knowmore.jpg',
    });
    $('.parallax-window-transition-getconnected').parallax({
      imageSrc: './assets/img/transition-getconnected.jpg',
    });
  }

  /**
   * Logins to Auth0
   */
  onLogin() {
    this.authService.login();
  }

  /**
   * Logouts from Auth0
   */
  onLogout() {
    this.authService.logout();
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    this.subscriptions$.map(x => x.unsubscribe());
  }
}
