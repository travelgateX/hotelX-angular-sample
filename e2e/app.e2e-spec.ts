import { TravelgatexB2bPage } from "./app.po";

describe("travelgatex-b2b App", () => {
  let page: TravelgatexB2bPage;

  beforeEach(() => {
    page = new TravelgatexB2bPage();
  });

  it("should display message saying app works", () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual("app works!");
  });
});
