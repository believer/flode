module Themes = {
  type t =
    | Light
    | Dark;
};

module Context = {
  type t = {
    theme: Themes.t,
    updateTheme: Themes.t => unit,
  };

  include ReactContext.Make({
    type context = t;

    let defaultValue = {theme: Light, updateTheme: _ => ()};
  });
};

type state = {theme: Themes.t};

type action =
  | SwitchTheme(Themes.t);

module Provider = {
  [@react.component]
  let make = (~children) => {
    let (state, dispatch) =
      React.useReducer(
        (_state, action) =>
          switch (action) {
          | SwitchTheme(theme) => {theme: theme}
          },
        {theme: Light},
      );

    let updateTheme = theme => dispatch(SwitchTheme(theme));

    <Context.Provider value={theme: state.theme, updateTheme}>
      children
    </Context.Provider>;
  };
};
