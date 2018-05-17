import { Component, Input, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestStorageService } from '../../../shared/services/request-storage.service';

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
    console.log(this.input);
    setTimeout(_ => {
      this.requestStorageService
        .loadData('rq', this.input)
        .then(p => (this.payload = p));
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
