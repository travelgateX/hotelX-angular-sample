import { Component, Input, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestStorageService } from 'app/core/services/request-storage.service';

@Component({
  selector: 'b2b-rq-modal',
  templateUrl: './rq-modal.component.html',
  styleUrls: ['./rq-modal.component.css']
})
export class RqModalComponent implements OnInit {
  @Input() input: any;
  @ViewChild('pre') pre: ElementRef;
  payload = 'Loading data...';
  isCopied = false;

  constructor(
    public activeModal: NgbActiveModal,
    private requestStorageService: RequestStorageService
  ) {}

  ngOnInit() {
    setTimeout(_ => {
      this.payload = this.requestStorageService.loadRequest(this.input);
    }, 0);
  }

  copy() {
    const pre = this.pre.nativeElement;
    const range = document.createRange();
    range.selectNode(pre);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    this.isCopied = document.execCommand('Copy');
  }
}
