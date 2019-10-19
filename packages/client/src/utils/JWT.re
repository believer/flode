[@bs.module] external decode: string => Js.t('a) = "jwt-decode";

type t = {
  email: string,
  sub: string,
  iat: float,
  exp: float,
};

let useUser = () => {
  let token = Storage.LocalStorage.getItem(Token);

  switch (token) {
  | Some(t) =>
    let decodedToken = decode(t);

    Some({
      email: decodedToken##email,
      sub: decodedToken##sub,
      iat: decodedToken##iat,
      exp: decodedToken##exp,
    });
  | None => None
  };
};
