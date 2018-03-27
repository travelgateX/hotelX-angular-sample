import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-carousel-modal',
  templateUrl: './carousel-modal.component.html',
  styleUrls: ['./carousel-modal.component.css']
})
export class CarouselModalComponent implements OnInit {
  @Input() images: string[];
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
