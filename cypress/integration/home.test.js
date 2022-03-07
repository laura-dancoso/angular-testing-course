describe('Home Page', ()=>{


  beforeEach(()=>{

    cy.fixture('courses.json').as("coursesJSON"); //defining a route

    cy.server(); // inicialation of the mock server

    cy.route('/api/courses', "@coursesJSON").as("courses"); // creating a routing event - mocking the http request 

    cy.visit('/');
  });

  it('should display a list of courses', ()=>{ 

    cy.contains("All Courses");

    cy.wait('@courses'); // waiting for the request to courses finish

    cy.get('mat-card').should("have.length", 9);

  });
  
  it('should display the advanced courses',()=>{

    cy.get('.mat-tab-label').should("have.length", 2);

    cy.get('.mat-tab-label').last().click(); //simulating user interaction

    cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt',1); // asserting that is greather than 1
    cy.get('.mat-tab-body-active .mat-card-title').first().should('contain', 'Angular Security Course');

  });
});