import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestStorageService } from '../../services/request-storage.service';
import { HotelBookPayload } from '../../../core/interfaces/hotel-book-payload';

@Component({
  selector: 'b2b-rs-modal',
  templateUrl: './rs-modal.component.html',
  styleUrls: ['./rs-modal.component.css']
})
export class RsModalComponent implements OnInit {
  @Input() book: HotelBookPayload;
  @ViewChild('pre') pre: ElementRef;
  payload: any = 'Loading data...';
  isCopied = false;

  constructor(
    public activeModal: NgbActiveModal,
    private requestStorageService: RequestStorageService
  ) {}

  ngOnInit() {
    setTimeout(_ => {
      this.requestStorageService
        .loadData('rs', this.book)
        .then(p => this.payload = p);
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
