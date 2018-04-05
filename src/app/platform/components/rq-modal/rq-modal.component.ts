import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-rq-modal',
  templateUrl: './rq-modal.component.html',
  styleUrls: ['./rq-modal.component.css']
})
export class RqModalComponent {
  @Input() input: any;
  @ViewChild('pre') pre: ElementRef;
  // @ViewChild('hiddenInput') hiddenInput: ElementRef;
  isCopied = false;

  constructor(public activeModal: NgbActiveModal) {}

  copy() {

    const pre = this.pre.nativeElement;
    // const input = this.hiddenInput.nativeElement;


    const range = document.createRange();
    range.selectNode(pre);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    this.isCopied = document.execCommand('Copy');


    // console.log();
    // console.log(input);
    // input.value = pre.innerText;
    // input.select();
    // const result = document.execCommand('Copy');

    // console.log(result);
  }
}
