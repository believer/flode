type locale;

[@bs.module "date-fns/locale"] external localeSv: locale = "sv";

[@bs.module "date-fns"]
external format: (Js.Date.t, string) => string = "format";

module DistanceToNow = {
  [@bs.deriving abstract]
  type options = {
    [@bs.optional]
    locale,
    [@bs.optional]
    addSuffix: bool,
  };

  [@bs.module "date-fns"]
  external formatDistanceToNow: (Js.Date.t, options) => string =
    "formatDistanceToNow";

  let make = date => {
    formatDistanceToNow(
      date,
      options(~locale=localeSv, ~addSuffix=true, ()),
    );
  };
};
