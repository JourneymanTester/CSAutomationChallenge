/// <reference types="cypress" />

import { v4 as uuidv4 } from "uuid";

context("CrowdStreet website", () => {
    it("allows account creation", () => {
        // (The locators in this test may be starting to depend too much on page structure.
        // If the structure changes frequently, it may be reasonable to create a
        // control map in the form of something like Label Text -> cy.get(jQuery Selector).
        // We could then write lines like "createAccountPage["First Name"].type("John");"
        // It's usually better to generalize after sufficient need arises, so I've
        // avoided this here.)

        cy.visit("https://test.crowdstreet.com");
        cy.contains("Create An Account").click({ force: true });

        cy.contains("Email").next().type(`${uuidv4()}@crowdstreet.com`); // Let's use a GUID to make sure the email is unique
        cy.contains("First Name").next().type("John");
        cy.contains("Last Name").next().type("Tester");

        cy.contains("Create a Password").next().type("Az8#Zqx4c");
        cy.contains("Confirm Password").next().type("Az8#Zqx4c");

        cy.contains("Phone Number").next().type("(555) 555-1234");
        cy.contains("Street Address").next().type("123 Main St");
        cy.contains("City").next().type("Testerville");
        cy.contains("State").next().click().contains("Oregon (OR)").click();
        cy.contains("Zip").next().type("12345");

        cy.contains("Are you an accredited investor?").parent().next().within(() => {
            cy.contains("No").click();
        });
        cy.contains("I agree to the Terms of Service.").prev().click();
        cy.contains("I understand that investment opportunities posted on this portal are speculative").prev().click();

        getRecaptchaCheckbox().click();
        cy.contains("Sign Up").click();

        // Assert the account was successfully created
        cy.contains("Congrats, John!");
    });

    // Getting the reCAPTCHA checkbox is gnarly enough to warrant a function.
    // NOTE: This function requires chromeWebSecurity=false in cypress.json
    // to allow cross domain iframe access.
    function getRecaptchaCheckbox() {
        return cy.get(".recaptcha-container iframe").then($iframe => {
            const $body = $iframe.contents().find('body');
            return cy.wrap($body).find('.recaptcha-checkbox-border');
        });
    }
});
  