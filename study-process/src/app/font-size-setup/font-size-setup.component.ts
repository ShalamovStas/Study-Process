import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-font-size-setup',
  templateUrl: './font-size-setup.component.html',
  styleUrls: ['./font-size-setup.component.scss']
})
export class FontSizeSetupComponent implements OnInit, AfterViewInit {

  @Input() element: HTMLElement | undefined;

  @Input() cardFrontSideEl: HTMLElement | undefined;
  @Input() cardBackSideEl: HTMLElement | undefined;

  private defaultValueFrontSide = 24
  private defaultValueBackSide = 20

  constructor() { }
  ngAfterViewInit(): void {

    console.log(this.element);
  }

  ngOnInit(): void {

  }

  plus() {
    console.log(this.element?.style.fontSize);

    if (this.cardFrontSideEl){
      this.increaseFontSize(this.cardFrontSideEl, this.defaultValueFrontSide)
    }

    if (this.cardBackSideEl){
      this.increaseFontSize(this.cardBackSideEl, this.defaultValueBackSide)
    }
  }

  minus() {
    console.log(this.element?.style.fontSize);

    if (this.cardFrontSideEl){
      this.decreaseFontSize(this.cardFrontSideEl, this.defaultValueFrontSide)
    }

    if (this.cardBackSideEl){
      this.decreaseFontSize(this.cardBackSideEl, this.defaultValueBackSide)
    }
  }

  increaseFontSize(el: HTMLElement, defaultFontSize: number){
    let currentFontSide = this.getFontSize(el);
    if (!currentFontSide)
      currentFontSide = defaultFontSize;

    currentFontSide += 5;
    this.setProperties(el, currentFontSide);
  }

  decreaseFontSize(el: HTMLElement, defaultFontSize: number){
    let currentFontSide = this.getFontSize(el);
    if (!currentFontSide)
      currentFontSide = defaultFontSize;

    currentFontSide -= 5;
    this.setProperties(el, currentFontSide);
  }

  setProperties(el: HTMLElement, fontSizeValue: number){
    el.style.setProperty('font-size', `${fontSizeValue}px`);
    el.style.setProperty('line-height', `1em`);
  }

  private getFontSize(el: HTMLElement): number {
    let currentFontSide = el.style.fontSize.split('px');

    let result = 0;
    if (currentFontSide && currentFontSide[0]) {
      result = Number.parseInt(currentFontSide[0]);
    }
    return result;

  }
}
