import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  let fixture: ComponentFixture<CoursesCardListComponent>;

  let el: DebugElement;


  beforeEach(waitForAsync(()=>{
    TestBed.configureTestingModule({
      imports:[CoursesModule]
    })
      .compileComponents()
      .then(()=>{
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display the course list", () => {

    component.courses = setupCourses();
    fixture.detectChanges();
    let cards = el.queryAll(By.css('.course-card'));
    expect(cards).toBeTruthy();
    expect(cards.length).toBe(12);
  });


  it("should display the first course", () => {

    component.courses = setupCourses();
    const firstCourse = component.courses[0];
    fixture.detectChanges();
    let firstCard = el.query(By.css('.course-card:first-child'));
      let title = firstCard.query(By.css("mat-card-title"));
      let image = firstCard.query(By.css("img"));
    expect(firstCard).toBeTruthy();
    expect(title.nativeElement.textContent).toBe(firstCourse.titles.description);
    expect(image.nativeElement.src).toBe(firstCourse.iconUrl);
  });
});


