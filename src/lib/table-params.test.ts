import { describe, expect, it } from "vitest";
import { buildQuery, parseTableParams, PAGE_SIZE } from "./table-params";

const opts = {
  sortKeys: ["name", "createdAt"] as const,
  defaultSort: "name",
};

describe("parseTableParams", () => {
  it("applies defaults when the query string is empty", () => {
    const p = parseTableParams({}, opts);
    expect(p).toMatchObject({
      q: "",
      sort: "name",
      dir: "asc",
      page: 1,
      pageSize: PAGE_SIZE,
      offset: 0,
    });
  });

  it("trims the search term", () => {
    expect(parseTableParams({ q: "  oak  " }, opts).q).toBe("oak");
  });

  it("takes the first value when a param repeats", () => {
    expect(parseTableParams({ q: ["a", "b"] }, opts).q).toBe("a");
  });

  it("falls back to the default sort for an unknown column", () => {
    expect(parseTableParams({ sort: "evil" }, opts).sort).toBe("name");
  });

  it("accepts a whitelisted sort column", () => {
    expect(parseTableParams({ sort: "createdAt" }, opts).sort).toBe("createdAt");
  });

  it("only accepts asc/desc for direction", () => {
    expect(parseTableParams({ dir: "asc" }, opts).dir).toBe("asc");
    expect(parseTableParams({ dir: "desc" }, opts).dir).toBe("desc");
    expect(parseTableParams({ dir: "sideways" }, opts).dir).toBe("asc");
  });

  it("honors defaultDir", () => {
    expect(parseTableParams({}, { ...opts, defaultDir: "desc" }).dir).toBe(
      "desc",
    );
  });

  it("computes offset from a 1-based page", () => {
    const p = parseTableParams({ page: "3" }, opts);
    expect(p.page).toBe(3);
    expect(p.offset).toBe(2 * PAGE_SIZE);
  });

  it("clamps non-positive or invalid pages to 1", () => {
    expect(parseTableParams({ page: "0" }, opts).page).toBe(1);
    expect(parseTableParams({ page: "-4" }, opts).page).toBe(1);
    expect(parseTableParams({ page: "abc" }, opts).page).toBe(1);
  });

  it("whitelists type against typeKeys", () => {
    const withType = { ...opts, typeKeys: ["condo", "land"] as const };
    expect(parseTableParams({ type: "condo" }, withType).type).toBe("condo");
    expect(parseTableParams({ type: "mansion" }, withType).type).toBe("");
  });

  it("falls back to defaultStatus when status is absent or invalid", () => {
    const withStatus = {
      ...opts,
      statusKeys: ["active", "sold"] as const,
      defaultStatus: "active",
    };
    expect(parseTableParams({}, withStatus).status).toBe("active");
    expect(parseTableParams({ status: "bogus" }, withStatus).status).toBe(
      "active",
    );
    expect(parseTableParams({ status: "sold" }, withStatus).status).toBe("sold");
  });
});

describe("buildQuery", () => {
  it("returns an empty string when there are no params", () => {
    expect(buildQuery({}, {})).toBe("");
  });

  it("carries base params through and drops empty ones", () => {
    expect(buildQuery({ q: "oak", page: "" }, {})).toBe("?q=oak");
  });

  it("merges a patch on top of the base", () => {
    expect(buildQuery({ q: "oak" }, { page: 2 })).toBe("?q=oak&page=2");
  });

  it("removes a key when the patch value is null or empty", () => {
    expect(buildQuery({ q: "oak", page: "2" }, { page: null })).toBe("?q=oak");
    expect(buildQuery({ q: "oak", page: "2" }, { page: "" })).toBe("?q=oak");
  });

  it("coerces numbers to strings", () => {
    expect(buildQuery({}, { page: 5 })).toBe("?page=5");
  });
});
