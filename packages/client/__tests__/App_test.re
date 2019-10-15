open Jest;
open Expect;
open ReactTestingLibrary;
open JestDom;

describe("App", () =>
  test("renders text", () =>
    <App />
    |> render
    |> getByText(~matcher=`Str("Welcome to your app"))
    |> expect
    |> toBeInTheDocument
  )
);

