/**
 * @jest-environment node
 */

const main = require('../main');

test("Apple inc registered Apple.com", done => {
    function callback(data) {
        try {
            expect(data).toBe('"Apple Inc."')
            done();
        } catch (error) {
            done(error);
        }
    }

    main.getRegistrationOf("apple.com", "Apple Inc", callback, main.handleRequestRejection);
});

//Example of 'jest' unit test
/*
test("1 + 2 should equal 3", () => {
    expect(main.add(1,2)).toBe(3);
});
*/