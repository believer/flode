type t =
  | FeedsRoute
  | HomeRoute
  | LoginRoute
  | NotFoundRoute;

let fromString =
  fun
  | [] => HomeRoute
  | ["feeds"] => FeedsRoute
  | ["login"] => LoginRoute
  | _ => NotFoundRoute;

let toString =
  fun
  | LoginRoute => "/login"
  | FeedsRoute => "/feeds"
  | HomeRoute => "/"
  | NotFoundRoute => "/404";

let go = route => route->toString->ReasonReactRouter.push;
