type state = {selectedArticle: option(string)};

type action =
  | SelectArticle(option(string));

module MarkAllAsRead = [%graphql
  {|
  mutation markAllAsRead {
    markAllAsRead
  }
|}
];

module MarkAllAsReadMutation = ReasonApolloHooks.Mutation.Make(MarkAllAsRead);

[@react.component]
let make = () => {
  let {theme}: Theme.Context.t = Theme.Context.use();
  let (state, dispatch) =
    React.useReducer(
      (_state, action) =>
        switch (action) {
        | SelectArticle(id) => {selectedArticle: id}
        },
      {selectedArticle: None},
    );

  /*let (markAllAsRead, _, _) =*/
  /*MarkAllAsReadMutation.use(~refetchQueries=_ => updateFeed(), ());*/

  let variables = HomeQuery.GetProfile.make(~filter=`unread, ())##variables;
  let (result, _full) = HomeQuery.GetProfileQuery.use(~variables, ());

  switch (result) {
  | Loading => <div className="p-5"> {React.string("Loading...")} </div>
  | Data(data) =>
    switch (data##user) {
    | Some(user) =>
      <div
        className={Cn.make([
          "flex-1 grid grid-template-main overflow-auto h-screen",
          switch (theme) {
          | Light => "bg-gray-100"
          | Dark => "bg-gray-900"
          },
        ])}>
        <div
          className={Cn.make([
            "p-1 overflow-auto",
            switch (theme) {
            | Light => "bg-gray-200"
            | Dark => "bg-gray-900"
            },
          ])}>
          {user##feed
           ->Belt.Array.map(item =>
               <FeedItem
                 item
                 key={item##id}
                 selectArticle={id => dispatch(SelectArticle(Some(id)))}
               />
             )
           ->React.array}
        </div>
        {switch (state.selectedArticle) {
         | Some(id) => <Article id />
         | None => React.null
         }}
      </div>
    | None => React.null
    }
  | NoData
  | Error(_) => <p> {React.string("Get off my lawn!")} </p>
  };
};
