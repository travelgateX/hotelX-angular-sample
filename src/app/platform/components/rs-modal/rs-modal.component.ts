import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HotelBookPayload } from 'app/core/interfaces/hotel-book-payload';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestStorageService } from 'app/core/services/request-storage.service';

@Component({
  selector: 'b2b-rs-modal',
  templateUrl: './rs-modal.component.html',
  styleUrls: ['./rs-modal.component.css']
})
export class RsModalComponent implements OnInit {
  @Input() book: HotelBookPayload;
  @ViewChild('pre') pre: ElementRef;
  payload = 'Loading data...';
  isCopied = false;

  constructor(
    public activeModal: NgbActiveModal,
    private requestStorageService: RequestStorageService
  ) {}

  ngOnInit() {
    setTimeout(_ => {
      this.payload = this.requestStorageService.loadResponse(this.book);
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
