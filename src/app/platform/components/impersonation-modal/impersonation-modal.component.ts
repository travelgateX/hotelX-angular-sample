import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'app/shared/services/notification.service';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'b2b-impersonation-modal',
  templateUrl: './impersonation-modal.component.html',
  styleUrls: ['./impersonation-modal.component.css']
})
export class ImpersonationModalComponent implements OnInit {
  email: string;
  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {}
  onImpersontation() {
    this.authService.getImpersonation(this.email).then(res => {
      if (res) {
        this.notificationService.success(
          `Now you are impersonating ${this.email}`,
          'Impersonation Succefull'
        );
        this.activeModal.close(this.email);
      } else {
        this.notificationService.error(
          `The user (${
            this.email
          }) does not exist OR does not have permission to impersonate`,
          'Impersonation Error'
        );
      }
    });
  }
}
