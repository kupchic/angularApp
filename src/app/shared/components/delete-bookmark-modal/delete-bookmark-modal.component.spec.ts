import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBookmarkModalComponent } from './delete-bookmark-modal.component';

describe('DeleteBookmarkModalComponent', () => {
  let component: DeleteBookmarkModalComponent;
  let fixture: ComponentFixture<DeleteBookmarkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBookmarkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBookmarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
