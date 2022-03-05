import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

describe('CoursesService', ()=>{

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[
        CoursesService
      ]
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', ()=>{
    coursesService.findAllCourses()
    .subscribe(courses=>{
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'Incorrect number of courses');
      const course = courses.find(c=>c.id==12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });
    const req = httpTestingController.expectOne('/api/courses'); // mock implementation of http client
    expect(req.request.method).toEqual("GET");
    req.flush({ payload: Object.values(COURSES)}); //return some data with the calling flush=> when this is called then the data is returned
  });

  it('shold find one course by its identifier', ()=>{
    coursesService.findCourseById(12)
      .subscribe(c=>{
        expect(c).toBeTruthy();
        expect(c.id).toEqual(12);
      });
      const req = httpTestingController.expectOne('/api/courses/12'); // mock implementation of http client
      expect(req.request.method).toEqual("GET");
      req.flush((COURSES[12])); //return some data with the calling flush=> when this is called then the data is returned
  });

  it('should save the course data', ()=>{
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
    coursesService.saveCourse(12, changes)
      .subscribe(updatedCourse=>{
        expect(updatedCourse).toBeTruthy();
        expect(updatedCourse.id).toBe(12);
      });
    const req = httpTestingController.expectOne('/api/courses/12'); // mock implementation of http client
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({...COURSES[12], ...changes});
  });

  it('should give an error if save course fails', ()=>{
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
    coursesService.saveCourse(12, changes)
      .subscribe(
        ()=>{ fail("The save operation should have failed")}, // if the code enters here its because the called was successfull (and it should not be successful)
        (error:HttpErrorResponse)=>{
          expect(error.status).toBe(500);
        }
      );
      const req = httpTestingController.expectOne('/api/courses/12'); // mock implementation of http client
      expect(req.request.method).toEqual("PUT");
      req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', ()=>{
    coursesService.findLessons(12)
      .subscribe(lessons=>{
         expect(lessons).toBeTruthy();
         expect(lessons.length).toEqual(3);
      });
    const req = httpTestingController.expectOne(req=>req.url=='/api/lessons'); // mock implementation of http client
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual('12');
    expect(req.request.params.get("filter")).toEqual('');
    expect(req.request.params.get("sortOrder")).toEqual('asc');
    expect(req.request.params.get("pageSize")).toEqual('3');
    expect(req.request.params.get("pageNumber")).toEqual('0');
    req.flush({payload: Object.values(LESSONS).filter(l=>l.courseId==12).slice(0,3)});
  });

  afterEach(()=>{
    httpTestingController.verify();
  });
});
