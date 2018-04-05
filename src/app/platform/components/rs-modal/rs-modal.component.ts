import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { HotelBookPayload } from 'app/core/interfaces/hotel-book-payload';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-rs-modal',
  templateUrl: './rs-modal.component.html',
  styleUrls: ['./rs-modal.component.css']
})
export class RsModalComponent {
  @Input() book: HotelBookPayload;
  @ViewChild('pre') pre: ElementRef;
  isCopied = false;


  constructor(public activeModal: NgbActiveModal) { }

  copy() {
    const pre = this.pre.nativeElement;
    const range = document.createRange();
    range.selectNode(pre);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    this.isCopied = document.execCommand('Copy');
  }
}
