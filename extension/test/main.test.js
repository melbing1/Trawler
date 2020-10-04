/**
 * @jest-environment node
 */

const main = require('../main');

test("Checks that Apple Inc is returned for the registrant of Apple.com", done => {
    function successfulApiCallback(data) {
        try {
            expect(data).toBe('Apple Inc')
            done();
        } catch (error) {
            done(error);
        }
    }

    main.getRegistrationOf("apple.com", main.successfulApiCallback, main.handleRequestRejection);
});

//Example of 'jest' unit test
/*
test("1 + 2 should equal 3", () => {
    expect(main.add(1,2)).toBe(3);
});
*/