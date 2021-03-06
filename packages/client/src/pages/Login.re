module LoginQuery = [%graphql
  {|
  mutation createToken($email: String!, $password: String!) {
    createToken(
      input: { email: $email, password: $password }
    )
  }
|}
];

module LoginMutation = ReasonApolloHooks.Mutation.Make(LoginQuery);

module LoginForm = {
  /*open Formality;*/

  type field =
    | Email
    | Password;

  type state = {
    email: string,
    password: string,
  };

  type message = string;
  type submissionError = unit;

  module EmailField = {
    let update = (state, email) => {...state, email};
  };

  module PasswordField = {
    let update = (state, password) => {...state, password};
  };

  let validators = [];
};

module LoginFormHook = Formality.Make(LoginForm);

[@react.component]
let make = () => {
  let (login, _, _) = LoginMutation.use();
  let form =
    LoginFormHook.useForm(
      ~initialState=LoginForm.{email: "", password: ""},
      ~onSubmit=(state, form) => {
        let variables =
          LoginQuery.make(~email=state.email, ~password=state.password, ())##variables;

        login(~variables, ())
        |> Js.Promise.then_(
             (
               res:
                 ReasonApolloHooks.Mutation.controlledVariantResult(
                   LoginQuery.t,
                 ),
             ) => {
             switch (res) {
             | NoData
             | Loading
             | Called
             | Error(_) => ()
             | Data(data) =>
               Storage.LocalStorage.setItem(Token, data##createToken);
               Route.go(HomeRoute);
             };

             Js.Promise.resolve();
           })
        |> ignore;

        form.notifyOnSuccess(None);
      },
    );

  let handleChange = (field, fieldUpdater, event) => {
    form.change(
      field,
      fieldUpdater(form.state, event->ReactEvent.Form.target##value),
    );
  };

  <div className="flex h-screen">
    <div className="w-full sm:w-1/2 p-8 flex flex-col">
      <div className="flex items-center text-xl font-light">
        <Logo />
        <div className="ml-5"> {React.string("Flode")} </div>
      </div>
      <form
        className="flex flex-col h-full justify-center px-4 lg:px-24"
        onSubmit={form.submit->Formality.Dom.preventDefault}>
        <div className="text-3xl font-semibold mb-8">
          {React.string("Log in")}
        </div>
        <Form.Input
          error={Email->(form.result)}
          label="E-mail"
          name="login-email"
          onChange={handleChange(Email, LoginForm.EmailField.update)}
          placeholder="you@example.com"
          value={form.state.email}
        />
        <Form.Input
          className="mt-6"
          error={Password->(form.result)}
          label="Password"
          name="login-password"
          placeholder="Enter your password"
          onChange={handleChange(Password, LoginForm.PasswordField.update)}
          type_="password"
          value={form.state.password}
        />
        <div className="mt-10">
          <Button.Primary className="w-full" type_="submit">
            {React.string("Login")}
          </Button.Primary>
        </div>
      </form>
    </div>
    <div className="bg-gray-200 flex-1 hidden sm:block" />
  </div>;
};
