import { Directive, ElementRef, Input, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[element-height-100]',
})
export class Element100vhComponent implements OnInit {
  @Input()
    test: any;


  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.fillAvailableSpaceByHeight();
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.fillAvailableSpaceByHeight();
  }

  fillAvailableSpaceByHeight() {
  }

}
