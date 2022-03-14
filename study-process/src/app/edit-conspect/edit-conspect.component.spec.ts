import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConspectComponent } from './edit-conspect.component';

describe('EditConspectComponent', () => {
  let component: EditConspectComponent;
  let fixture: ComponentFixture<EditConspectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConspectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
