module Header = {
  [@react.component]
  let make = (~email) => {
    <header
      className="flex flex-col items-center justify-between p-4 border-r border-gray-200">
      <Logo />
      <div>
        <Router.Link to_=Route.FeedsRoute>
          <svg
            className="text-gray-500 h-5 w-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20">
            <path
              d="M15 9h-3v2h3v3h2v-3h3V9h-3V6h-2v3zM0 3h10v2H0V3zm0 8h10v2H0v-2zm0-4h10v2H0V7zm0 8h10v2H0v-2z"
            />
          </svg>
        </Router.Link>
        <Router.Link className="block mt-5" to_=Route.HomeRoute>
          <svg
            className="text-gray-500 h-5 w-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20">
            <path
              d="M0 3h20v2H0V3zm0 4h20v2H0V7zm0 4h20v2H0v-2zm0 4h20v2H0v-2z"
            />
          </svg>
        </Router.Link>
      </div>
      <button
        onClick={_ => {
          Storage.LocalStorage.removeItem(Token);
          Route.go(LoginRoute);
        }}
        title="Logout"
        type_="button">
        <Avatar email />
      </button>
    </header>;
  };
};
