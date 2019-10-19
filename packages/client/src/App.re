[@react.component]
let make = () => {
  let url = ReasonReactRouter.useUrl();
  let route = Route.fromString(url.path);
  let user = JWT.useUser();

  switch (route, user) {
  | (LoginRoute, _) => <Login />
  | (NotFoundRoute, _) => <NotFound />

  | (HomeRoute, None)
  | (FeedsRoute, None) =>
    Route.go(LoginRoute);
    React.null;

  | (route, Some({email})) =>
    <main className="h-screen flex">
      <Layout.Header email />
      {switch (route) {
       | HomeRoute => <Home />
       | FeedsRoute => <Feeds />

       // Should be impossible to land here
       | LoginRoute
       | NotFoundRoute => React.null
       }}
    </main>
  };
};
