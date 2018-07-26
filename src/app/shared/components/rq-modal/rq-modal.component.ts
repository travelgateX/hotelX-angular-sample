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
  payload: any = 'Loading data...';
  isCopied = false;

  constructor(
    public activeModal: NgbActiveModal,
    private requestStorageService: RequestStorageService
  ) {}

  ngOnInit() {
    setTimeout(_ => {
      this.requestStorageService
        .loadData('rq', this.input)
        .then((p: any) => this.payload = {token: p.bearer, query: p.rq.body.query, variables: p.rq.body.variables})
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
