import { describe, expect, it } from "vitest";
import { capHashtags, countHashtags, fullCaption } from "./caption";

describe("capHashtags", () => {
  it("strips # and spaces and drops empty tags", () => {
    expect(capHashtags(["#Toronto", " condo life ", "#", ""])).toEqual(["Toronto", "condolife"]);
  });

  it("drops duplicates, ignoring case, keeping the first", () => {
    expect(capHashtags(["TorontoRealEstate", "#torontorealestate", "Condo", "TORONTOREALESTATE"])).toEqual(["TorontoRealEstate", "Condo"]);
    expect(capHashtags(["Québec", "québec", "QUÉBEC"])).toEqual(["Québec"]);
  });

  it("keeps at most the cap, after removing duplicates", () => {
    const tags = ["a1", "A1", "b", "c", "d", "e", "f", "g"];
    expect(capHashtags(tags, 5)).toEqual(["a1", "b", "c", "d", "e"]);
    expect(capHashtags(tags)).toHaveLength(7);
  });
});

describe("countHashtags", () => {
  const count = (caption: string, hashtags: string[] = []) => countHashtags({ caption, hashtags });

  it("counts the hashtag list", () => {
    expect(count("Just listed!", ["Toronto", "Condo", "JustListed"])).toBe(3);
  });

  it("adds hashtags typed into the caption", () => {
    expect(count("Open house Saturday #OpenHouse", ["a", "b", "c", "d", "e"])).toBe(6);
  });

  it("counts accented hashtags", () => {
    expect(count("Nouvelle inscription #québec #MontréalImmobilier")).toBe(2);
  });

  it("doesn't count a number after #, like Unit #4", () => {
    expect(count("Unit #4 at 88 Harbour Street, suite #1205")).toBe(0);
    expect(count("Unit #4B is bright")).toBe(1); // letters after the number make it a tag, as on Instagram
  });

  it("doesn't count # inside words or links", () => {
    expect(count("C# developer? See https://example.com/#tour and a#b")).toBe(0);
  });

  it("matches what fullCaption publishes", () => {
    const post = { caption: "Sold! #JustSold", hashtags: ["Stouffville", "JustSold"] };
    expect(fullCaption(post)).toBe("Sold! #JustSold\n\n#Stouffville #JustSold");
    expect(countHashtags(post)).toBe(3);
  });
});
