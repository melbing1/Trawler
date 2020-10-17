/**
 * @jest-environment node
 */

const main = require('../main');

test("Apple inc has registered Apple.com", done => {
    function callback(data) {
        try {
            expect(data).toBe('apple')
            done();
        } catch (error) {
            done(error);
        }
    }

    main.getRegistrationOf("apple.com", "apple", callback, main.handleRequestRejection);
});

test("Google has registered google.com", done => {
    function callback(data) {
        try {
            expect(data).toBe('google')
            done();
        } catch (error) {
            done(error);
        }
    }

    main.getRegistrationOf("google.com", "google", callback, main.handleRequestRejection);
});

test("Hofstra has registered hofstra.edu", done => {
    function callback(data) {
        try {
            expect(data).toBe('hofstra')
            done();
        } catch (error) {
            done(error);
        }
    }

    main.getRegistrationOf("hofstra.edu", "hofstra", callback, main.handleRequestRejection);
});

/*
Intentionally failing test to demo JEST output
test("Amazon has not registered google.com", done => {
    function callback(data) {
        try {
            expect(data).toBe('amazon')
            done();
        } catch (error) {
            done(error);
        }
    }

    main.getRegistrationOf("google.com", "amazon", callback, main.handleRequestRejection);
});
*/

//Example of 'jest' unit test
/*
test("1 + 2 should equal 3", () => {
    expect(main.add(1,2)).toBe(3);
});
*/