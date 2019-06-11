const { Api, apis } = require("../src/index");

describe("apis setHeaders method", () => {
  let testsApis = [];

  beforeAll(() => {
    apis.reset();
  });

  afterAll(() => {
    apis.reset();
  });

  describe("when creating api", () => {
    describe("if apis setHeaders method was not called previously", () => {
      it("should not set any header", () => {
        const api = new Api("/foo-1");
        testsApis.push(api);
        expect(api._headers).toEqual({});
      });
    });

    describe("if apis.setHeaders method was called previously", () => {
      it("should inherit common headers previously defined", () => {
        apis.setHeaders({
          foo: "foo"
        });
        const api = new Api("/foo-2");
        testsApis.push(api);
        expect(api._headers).toEqual({
          foo: "foo"
        });
      });

      it("should inherit common headers previously defined even when api is tagged", () => {
        const api = new Api("/foo-3", {
          tags: "foo-tag-1"
        });
        testsApis.push(api);
        expect(api._headers).toEqual({
          foo: "foo"
        });
      });
    });

    describe("if apis.setHeaders method was called previously for an specific tag", () => {
      describe("when provided tag is an string", () => {
        it("should inherit common headers previously defined, and headers previously defined for the tag", () => {
          apis.setHeaders(
            {
              foo2: "foo2"
            },
            "foo-tag-1"
          );
          const api = new Api("/foo-4", {
            tags: "foo-tag-1"
          });
          testsApis.push(api);
          expect(api._headers.foo).toEqual("foo");
          expect(api._headers.foo2).toEqual("foo2");
        });

        it("should inherit common headers, and do not inherit headers previously defined for the tag if it does not match", () => {
          const api = new Api("/foo-5", {
            tags: "foo-tag-2"
          });
          testsApis.push(api);
          expect(api._headers.foo).toEqual("foo");
          expect(api._headers.foo2).toEqual(undefined);
        });
      });

      describe("when provided tag is an array", () => {
        it("should inherit common headers previously defined, and headers previously defined for the tag if one of them match", () => {
          apis.setHeaders(
            {
              foo3: "foo3"
            },
            "foo-tag-1"
          );
          const api = new Api("/foo-6", {
            tags: ["foo-tag-1", "foo-tag-3"]
          });
          testsApis.push(api);
          expect(api._headers.foo).toEqual("foo");
          expect(api._headers.foo3).toEqual("foo3");
        });

        it("should inherit common headers, and do not inherit headers previously defined for the tag if it does not match", () => {
          const api = new Api("/foo-7", {
            tags: ["foo-tag-2", "foo-tag-3"]
          });
          testsApis.push(api);
          expect(api._headers.foo).toEqual("foo");
          expect(api._headers.foo3).toEqual(undefined);
        });
      });
    });
  });

  describe("when calling setHeaders after apis have been created", () => {
    describe("if no tags are defined", () => {
      it("should set headers for all existant apis, removing all previously defined headers", () => {
        apis.setHeaders({
          foo: "new-foo"
        });
        testsApis.forEach(testApi => {
          expect(testApi._headers.foo).toEqual("new-foo");
          expect(testApi._headers.foo2).toEqual(undefined);
          expect(testApi._headers.foo3).toEqual(undefined);
        });
      });
    });

    describe("if tag is defined as string", () => {
      it("should set headers for all existant apis having a tag matching with it", () => {
        apis.setHeaders(
          {
            foo: "another-foo"
          },
          "foo-tag-3"
        );
        testsApis.forEach(testApi => {
          if (testApi._url === "/foo-6" || testApi._url === "/foo-7") {
            expect(testApi._headers.foo).toEqual("another-foo");
          } else {
            expect(testApi._headers.foo).toEqual("new-foo");
          }
        });
      });

      it("should not set configuration for any api if any have a matching tag", () => {
        apis.setHeaders(
          {
            foo: "fake-foo"
          },
          "foo-tag-4"
        );
        testsApis.forEach(testApi => {
          if (testApi._url === "/foo-6" || testApi._url === "/foo-7") {
            expect(testApi._headers.foo).toEqual("another-foo");
          } else {
            expect(testApi._headers.foo).toEqual("new-foo");
          }
        });
      });
    });

    describe("if tag is an array", () => {
      it("should set configuration for all existant apis having a tag matching with it", () => {
        apis.setHeaders(
          {
            foo: "another-new-foo"
          },
          ["foo-tag-3"]
        );
        testsApis.forEach(testApi => {
          if (testApi._url === "/foo-6" || testApi._url === "/foo-7") {
            expect(testApi._headers.foo).toEqual("another-new-foo");
          } else {
            expect(testApi._headers.foo).toEqual("new-foo");
          }
        });
      });

      it("should not set configuration for any existant apis if any has a tag matching with it", () => {
        apis.setHeaders(
          {
            foo: "fake-foo"
          },
          ["foo-unexistant"]
        );
        testsApis.forEach(testApi => {
          if (testApi._url === "/foo-6" || testApi._url === "/foo-7") {
            expect(testApi._headers.foo).toEqual("another-new-foo");
          } else {
            expect(testApi._headers.foo).toEqual("new-foo");
          }
        });
      });
    });
  });
});
