describe('Testing Staff page in staff account', () =>{

    // read cypress.env variables
    const STAFF_USERNAME = Cypress.env('STAFF_USERNAME')
    const STAFF_PASSWORD= Cypress.env('STAFF_PASSWORD')
    const STAFF_EMAIL = Cypress.env('STAFF_EMAIL')
    beforeEach(() => {
        // visit the website
        cy.visit('/'); 
        // make sure that a form exists
        cy.get('form').should('exist');

        // make sure there is a selector with a name "login_as"
        cy.get('select[name="login_as"]').find('option').should(($option) => {
            // make sure that selector has 3 values
            expect($option).to.have.length(3);
            // make sure that the first value of the selector is "student"
            expect($option.eq(0)).to.have.value('student')
        })

        // perform the Login functionality
        cy.get('#id_username').type(STAFF_USERNAME)
        cy.get('#id_password').type(STAFF_PASSWORD)
        cy.get('select[name="login_as"]').select('staff')
        cy.get('form[action="/login/"] > button[type="submit"]').click()


        // make sure that i was navigated to the right page
        cy.get('h2').should('exist').should('contain.text', 'My modules')

        // make sure that there is a module called "DS2023SUMMER/Nablus: Data structure"
        cy.get('h6').should('exist').should('contain.text', 'DS2023SUMMER/Nablus: Data structure')

        // navigate to the course mentioned above
        cy.get('a.nav-link.active.w-100[href="/staff/23"]').click()

        //navigate to staffs page
        cy.visit('/staff/23/staffs/')

        // make sure that username attribute in the table exists
        cy.get('th.sorting_asc[aria-label="Username: activate to sort column descending"]').should('exist')


    })

    afterEach(() => {
        // log out of the account after each test case to make them totally independent of each other
        // click the drop down menu to log out
        cy.get('a#userInfoMenu.nav-link.dropdown-toggle').click()
        // clicking log out button
        cy.get('a.dropdown-item[href="/accounts/logout/"]').click()
      })

    
    context('Adding staff scenario', () => {

        // Test case 1: adding a staff with an empty name (should pass)
        it('Add staff with empty name (should pass)', () => { // change the test case name
            // Store the text content of the staffs info div before clicking the button
            let initialText
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                initialText = text.trim()
            })

            // Get the initial number of rows in the table
            let initialRowCount
            cy.get('tbody tr').then((rows) => {
                initialRowCount = rows.length
            })

            // Click the <button> element
            cy.get('button.btn.btn-primary[onclick="addStaff()"]').click()

            // Check that the text content of the <div> element is still the same as before
            cy.get('div.dataTables_info#staffs_info').invoke('text').should((text) => {
                expect(text.trim()).to.equal(initialText)
            })

            // Get the final number of rows in the table
            let finalRowCount
            cy.get('tbody tr').then((rows) => {
                finalRowCount = rows.length
            })

            // Ensure that the number of rows in the table is the same before and after clicking the button
            expect(finalRowCount).to.equal(initialRowCount)
        })

        // Test Case 2: adding a staff normally with a valid name
        it('Add a staff normally (should pass)', () => {
            // Store the text content of the <div> element before clicking the button
            cy.get('div.dataTables_info#staffs_info').invoke('text').as('initialText')

            // Type "cypress staff user" in the input element
            const inputText = 'cypress staff user'
            cy.get('#new_staff')
            // making sure it has no previous value
            .clear()
            .type(inputText)
            .should('have.value', inputText)
        
            // Click the button
            cy.get('button[onclick="addStaff()"]').click()
        
            // validating the lengtth of the table
            cy.get('tbody tr').should('have.length.gt', 0)
        
            // Check that the text content of the staffs info element has NOT changed
            cy.get('div.dataTables_info#staffs_info').invoke('text').should('not.equal', '@initialText')
        })

        // Test Case 3: adding an existing staff
        // this test case Assumes that there is an existing staff with a name "cypress staff user"
        it('add a staff that already exists (should pass)', () => {
            let initialText
        
            // Store the text content of the staffs info div before clicking the button
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
            initialText = text.trim()
            })

            // Get the initial number of rows in the table
            let initialRowCount
            cy.get('tbody tr').then((rows) => {
                initialRowCount = rows.length
            })
        
            // Type "cypress staff user" in the input element
            const inputText = 'cypress staff user'
            cy.get('#new_staff')
            // making sure it has no previous value
            .clear()
            .type(inputText)
            .should('have.value', inputText)
        
            // Click the button
            cy.get('button[onclick="addStaff()"]').click()
        
            // validating the length of the table
            cy.get('tbody tr').should('have.length.gt', 0)
        
            // Check that the text content of the staffs info element has NOT changed
            let UpdatedText
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
            UpdatedText = text.trim()
            expect(UpdatedText).to.equal(initialText)
            })

            // Get the final number of rows in the table
            let finalRowCount
            cy.get('tbody tr').then((rows) => {
                finalRowCount = rows.length
            })

            // Ensure that the number of rows in the table is the same before and after clicking the button
            expect(finalRowCount).to.equal(initialRowCount)
        }) 


    })

    context('Testing search functionality scenario', () => {
        // Test case 4: Searching for a user that exists
        // This test case assumes there is a user called "cypress staff user" that exist 
        it('searching for a user that exists (should fail)', () => {
            let initialText
            // Store the text content of the staffs info div before clicking the button
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                initialText = text.trim()
            })


            const inputText = 'cypress staff user';
            // Type the input text in the search bar and press Enter
            cy.get('input[type="search"][aria-controls="staffs"]')
            // making sure it has no previous value
            .clear()
            .type(inputText)
            // hitting enter key
            .type('{enter}');
            

            // Check that the text content of the staffs info element has NOT changed
            let UpdatedText
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                UpdatedText = text.trim()
                expect(UpdatedText).not.to.equal(initialText)
            })

            // also make sure that the table has only 1 value now
            cy.get('tbody')
            .find('tr')
            //the test fail here, when it shouldn't,
            //because the website returns a wrong number
            //of table rows (bug)
            .should('have.length', 1)

        })

        // Test case 5: Searching for a user that doesnt exist
        // This test case assumes that there is no user with a name "a user that doesnt exist"
        it('search for a user that doesnt exist (should pass)', () => {

            const inputText = 'a user that doesnt exist';
            // Type the input text in the search bar and press Enter
            cy.get('input[type="search"][aria-controls="staffs"]')
            // making sure it has no previous value
            .clear()
            .type(inputText)
            // hitting enter key
            .type('{enter}');

            let message;
            cy.get('td.dataTables_empty').invoke('text').then((text) => {
                message = text;
                expect(message).to.equal('No matching records found');
            });

            // also make sure that the table has 0 values now
            cy.get('tbody')
            .find('tr')
            // The website returns "No matching records found" as a row
            .should('have.length', 1)
        })

        // Test case 6: Searching for a staff by email
        // This test case assumes that there is a user already with an email as in the Env Variable
        it('search for a staff by his email (should pass)', () => {
            let initialText
            // Store the text content of the staffs info div before clicking the button
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                initialText = text.trim()
            })

            cy.get('input[type="search"][aria-controls="staffs"]')
            // making sure it has no previous value
            .clear()
            .type(STAFF_EMAIL)
            // hitting enter key
            .type('{enter}');

            let UpdatedText
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                UpdatedText = text.trim()
                expect(UpdatedText).not.to.equal(initialText)
            })


            // validate that the row's email is as typed in search
            cy.get('tr#staff_script_user_temp_2 td').eq(3).should('have.text', STAFF_EMAIL);

            // also make sure that the table has only 1 value now
            cy.get('tbody')
            .find('tr')
            .should('have.length', 1)

        })

        // Test case 7: Searching for a user with a value of ("")
        it('searching for a user with a value of "" (should fail)', () => {
            let initialText
            // Store the text content of the staffs info div before clicking the button
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                initialText = text.trim()
            })


            const inputText = '""';
            // Type the input text in the search bar and press Enter
            cy.get('input[type="search"][aria-controls="staffs"]')
            // making sure it has no previous value
            .clear()
            .type(inputText)
            // hitting enter key
            .type('{enter}');
            

            // Check that the text content of the staffs info element has NOT changed
            let UpdatedText
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                UpdatedText = text.trim()
                //the test fail here, when it shouldn't,
                // because the website returns wrong restults
                // (bug)     
                expect(UpdatedText).not.to.equal(initialText)
            })

            // also make sure that the table has only 1 value now
            cy.get('tbody')
            .find('tr')
            //the test fail here, when it shouldn't,
            // because the website returns a wrong number of table rows (bug)
            // the website should returns nothing
            .should('have.length', 0)

            })



        // Test case 8: Searching for a staff by firstname
        // This test case assumes that there is only one user with firstname "test_user_temp_1"
        it('search for a staff by his firstname (should pass)', () => {
            let initialText
            // Store the text content of the staffs info div before clicking the button
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                initialText = text.trim()
            })

            let staff_firstname = "test_user_temp_1"
            cy.get('input[type="search"][aria-controls="staffs"]')
            // making sure it has no previous value
            .clear()
            .type(staff_firstname)
            // hitting enter key
            .type('{enter}');


            // validate that the row's firstname is "test_user_temp_1" as typed in search
            cy.get('tr#staff_test_user_temp_1 td').eq(1).should('have.text', staff_firstname);
        
            let UpdatedText
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                UpdatedText = text.trim()
                expect(UpdatedText).not.to.equal(initialText)
            })

        })


        // Test case 9: Searching for a staff by lastname
        // This test case assumes that there is only one user with lastname "QA"
        it('search for a staff by his lastname (should pass)', () => {
            let initialText
            // Store the text content of the staffs info div before clicking the button
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                initialText = text.trim()
            })

            let staff_lasttname = "QA"
            cy.get('input[type="search"][aria-controls="staffs"]')
            // making sure it has no previous value
            .clear()
            .type(staff_lasttname)
            // hitting enter key
            .type('{enter}');
        
            let UpdatedText
            cy.get('div.dataTables_info#staffs_info').invoke('text').then((text) => {
                UpdatedText = text.trim()
                expect(UpdatedText).not.to.equal(initialText)
            })

            // validate that the row's lastname is "QA" is typed in search
            cy.get('tr#staff_YazanHamdanUser1 td').eq(2).should('have.text', staff_lasttname);

            // also make sure that the table has only 1 value now
            cy.get('tbody')
            .find('tr')
            .should('have.length', 1)

        })
    })


    context('Testing Deleting staff functionality scenario', () => {
        // Test case 7: Confirming deleting a user
        // This test case assumes there is a user already exists with a name "cypress staff user" 
        it('Confirming deleting a user (should pass)', () =>{

            // Get the initial number of rows in the table
            let initialRowCount
            cy.get('tbody tr').then((rows) => {
                initialRowCount = rows.length
            })

            // click on remove user
            cy.get('a[data-href="cypress staff user"][data-target="#confirm-delete"]').click({force: true})
            // clicking on confirming delete user
            cy.get('a.btn.btn-danger.btn-ok[data-href="cypress staff user"]').click()

            // Get the final number of rows in the table
            let finalRowCount
            cy.get('tbody tr').then((rows) => {
                finalRowCount = rows.length
                expect(finalRowCount).not.to.equal(initialRowCount)
            })
        })
    })


})
