import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorStopComponent } from './color-stop.component';

describe('ColorStopComponent', () => {
  let component: ColorStopComponent;
  let fixture: ComponentFixture<ColorStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorStopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
