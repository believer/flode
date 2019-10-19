module GetProfile = [%graphql
  {|
  query user {
    user {
      email
      feed {
        id
        pubDate
        title
      }
    }
  }
|}
];

module GetProfileQuery = ReasonApolloHooks.Query.Make(GetProfile);

[@react.component]
let make = () => {
  let (result, _full) = GetProfileQuery.use();

  switch (result) {
  | Loading => <div className="p-5"> {React.string("Loading...")} </div>
  | Data(data) =>
    switch (data##user) {
    | Some(user) =>
      <div className="flex-1 p-5">
        {user##feed
         ->Belt.Array.map(feed =>
             <div className="flex justify-between text-sm" key={feed##id}>
               <div> {React.string(feed##title)} </div>
               <div>
                 {Js.Date.fromString(feed##pubDate)
                  ->DateTime.format("yyyy-MM-dd HH:mm")
                  ->React.string}
               </div>
             </div>
           )
         ->React.array}
      </div>
    | None => React.null
    }
  | NoData
  | Error(_) => <p> {React.string("Get off my lawn!")} </p>
  };
};
