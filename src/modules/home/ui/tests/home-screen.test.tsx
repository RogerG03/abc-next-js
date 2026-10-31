import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScreen } from "../home-screen";

describe("HomeScreen", () => {
  it("explains the modular architecture", () => {
    render(<HomeScreen />);

    expect(
      screen.getByRole("heading", { name: "Una base modular lista para crecer." }),
    ).toBeVisible();
    expect(screen.getByText("Empieza simple")).toBeVisible();
  });
});
