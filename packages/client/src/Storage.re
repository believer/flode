module StoreItems = {
  type t =
    | Token;

  let toString =
    fun
    | Token => "flode/token";
};

module LocalStorage = {
  open Dom.Storage;

  let getItem = key => localStorage |> getItem(StoreItems.toString(key));

  let setItem = (key, value) =>
    localStorage |> setItem(StoreItems.toString(key), value);

  let removeItem = key =>
    localStorage |> removeItem(StoreItems.toString(key));
};

type t =
  | Loading
  | LoadedValue(option(string))
  | Error;

let useStorage = (~key) => {
  let (value, setValue) =
    React.useState(() =>
      switch (LocalStorage.getItem(key)) {
      | None => LoadedValue(None)
      | Some(v) => LoadedValue(Some(v))
      }
    );

  let handleValue = value =>
    switch (value) {
    | None => None
    | Some("") => None
    | Some(v) => Some(v)
    };

  let handleSet = value => {
    switch (value) {
    | Some(v) =>
      setValue(_ => LoadedValue(handleValue(value)));
      LocalStorage.setItem(key, v);
    | None => ()
    };
  };

  (value, handleSet);
};
