let handleLinkClick = (to_, e) => {
  ReactEvent.Mouse.preventDefault(e);
  Route.go(to_);
};

module Link = {
  [@react.component]
  let make = (~className="", ~to_, ~children) => {
    let href = Route.toString(to_);

    <a className href onClick={handleLinkClick(to_)}> children </a>;
  };
};

module NavLink = {
  let isActiveLink = (path, href) => {
    switch (path, href) {
    | ([], "/") => true
    | ([_, _, "installningar"], "/installningar") => false
    | (p, _) =>
      p
      |> List.exists(pathPart =>
           href |> Js.String.split("/") |> Js.Array.includes(pathPart)
         )
    };
  };

  [@react.component]
  let make = (~className, ~activeClassName, ~to_, ~children) => {
    let url = ReasonReactRouter.useUrl();
    let href = Route.toString(to_);
    let isActive = isActiveLink(url.path, href);
    let className =
      Cn.make([className, activeClassName->Cn.ifTrue(isActive)]);

    <a ariaSelected=isActive className href onClick={handleLinkClick(to_)}>
      children
    </a>;
  };
};
