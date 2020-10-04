const main = require('../main');

console.log(main.getRegistrationOf("apple.com"));

test("Checks that Apple Inc is returned for the registrant of Apple.com", () => {
    expect(main.getRegistrationOf("apple.com")).toBe("Apple Inc");
});

//Example of 'jest' unit test
test("1 + 2 should equal 3", () => {
    expect(main.add(1,2)).toBe(3);
});