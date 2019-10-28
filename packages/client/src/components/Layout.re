module Header = {
  [@react.component]
  let make = (~email) => {
    let {theme, updateTheme}: Theme.Context.t = Theme.Context.use();

    let (nav, navItem, navItemActive) =
      switch (theme) {
      | Light => ("bg-white", "border-white text-gray-700", "bg-gray-100")
      | Dark => (
          "bg-gray-900",
          "border-gray-900 text-gray-500",
          "bg-gray-800",
        )
      };

    <header
      className={Cn.make([
        nav,
        "flex flex-col items-center justify-between py-5",
      ])}>
      <Logo />
      <div>
        <Router.NavLink
          activeClassName={Cn.make([navItemActive, "border-blue-400"])}
          className={Cn.make([navItem, "border-l-4 px-8 py-3 block"])}
          to_=Route.FeedsRoute>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Router.NavLink>
        <Router.NavLink
          activeClassName={Cn.make([navItemActive, "border-blue-400"])}
          className={Cn.make([navItem, "border-l-4 px-8 py-3 block"])}
          to_=Route.HomeRoute>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </Router.NavLink>
        {switch (theme) {
         | Light =>
           <button
             className="border-l-4 border-white px-8 py-3 block text-gray-700"
             onClick={_ => updateTheme(Dark)}>
             <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round">
               <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
             </svg>
           </button>
         | Dark =>
           <button
             className="border-l-4 border-gray-900 px-8 py-3 block text-gray-700"
             onClick={_ => updateTheme(Light)}>
             <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round">
               <circle cx="12" cy="12" r="5" />
               <line x1="12" y1="1" x2="12" y2="3" />
               <line x1="12" y1="21" x2="12" y2="23" />
               <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
               <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
               <line x1="1" y1="12" x2="3" y2="12" />
               <line x1="21" y1="12" x2="23" y2="12" />
               <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
               <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
             </svg>
           </button>
         }}
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
