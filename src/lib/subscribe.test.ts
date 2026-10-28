import { describe, expect, it } from "vitest";
import { planChoiceFromNext, readPlanChoice, subscribePath } from "./subscribe";

describe("plan choice in links", () => {
  it("builds the /subscribe link", () => {
    expect(subscribePath({ plan: "professional", interval: "year" })).toBe("/subscribe?plan=professional&interval=year");
  });

  it("reads valid plans and defaults to monthly", () => {
    expect(readPlanChoice({ plan: "top_producer", interval: "year" })).toEqual({ plan: "top_producer", interval: "year" });
    expect(readPlanChoice({ plan: "starter" })).toEqual({ plan: "starter", interval: "month" });
    expect(readPlanChoice({ plan: "starter", interval: "weekly" })).toEqual({ plan: "starter", interval: "month" });
  });

  it("rejects unknown plans", () => {
    expect(readPlanChoice({ plan: "free" })).toBeNull();
    expect(readPlanChoice({ plan: "enterprise", interval: "year" })).toBeNull();
    expect(readPlanChoice({})).toBeNull();
  });

  it("finds the plan in a sign-in's next page, and nothing else", () => {
    expect(planChoiceFromNext(subscribePath({ plan: "starter", interval: "month" }))).toEqual({ plan: "starter", interval: "month" });
    expect(planChoiceFromNext("/pricing")).toBeNull();
    expect(planChoiceFromNext("/subscribe?plan=nope")).toBeNull();
    expect(planChoiceFromNext(undefined)).toBeNull();
  });
});
