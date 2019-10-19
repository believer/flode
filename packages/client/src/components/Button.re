module Primary = {
  [@react.component]
  let make = (~children, ~className=?, ~onClick=?, ~type_="button") => {
    <button
      className={Cn.make([
        "text-white rounded-full px-4 py-2 bg-blue-600
      focus:bg-blue-500 hover:bg-blue-500",
        className->Cn.unpack,
      ])}
      onClick={_ =>
        switch (onClick) {
        | Some(onClick) => onClick()
        | None => ()
        }
      }
      type_>
      children
    </button>;
  };
};

module Secondary = {
  [@react.component]
  let make = (~children, ~className=?, ~onClick=?, ~type_="button") => {
    <button
      className={Cn.make([
        "text-gray-700 rounded-full px-4 py-2 bg-gray-300
      focus:bg-gray-200 hover:bg-gray-200",
        className->Cn.unpack,
      ])}
      onClick={_ =>
        switch (onClick) {
        | Some(onClick) => onClick()
        | None => ()
        }
      }
      type_>
      children
    </button>;
  };
};
