module SubcribeToFeed = [%graphql
  {|
  mutation subscribeToFeed($id: ID!) {
    subscribeToFeed(input: { feedId: $id }) {
      email
      feed {
        title
      }
    }
  }
|}
];

module SubcribeToFeedMutation =
  ReasonApolloHooks.Mutation.Make(SubcribeToFeed);

module GetFeeds = [%graphql
  {|
  query feeds {
    feeds {
      description
      id
      isSubscribed
      title
    }
  }
|}
];

module GetFeedsQuery = ReasonApolloHooks.Query.Make(GetFeeds);

[@react.component]
let make = () => {
  let (subscribeToFeed, _, _) =
    SubcribeToFeedMutation.use(
      ~refetchQueries=
        _ => {
          let updateFeed =
            GetFeeds.make() |> ReasonApolloHooks.Utils.toQueryObj;
          let profile =
            Home.GetProfile.make() |> ReasonApolloHooks.Utils.toQueryObj;

          [|updateFeed, profile|];
        },
      (),
    );
  let (result, _full) = GetFeedsQuery.use();

  switch (result) {
  | Loading => <p> {React.string("Loading...")} </p>
  | Data(data) =>
    <div className="grid grid-template-main bg-gray-100 flex-1">
      <div className="grid-column-main mt-20">
        {data##feeds
         ->Belt.Array.map(feed =>
             <div
               className="flex items-start justify-between mb-4 text-sm"
               key={feed##id}>
               <div className="w-3/5">
                 <div className="font-semibold mb-2">
                   {React.string(feed##title)}
                 </div>
                 {switch (feed##description) {
                  | Some(desc) =>
                    <div className="text-sm text-gray-700">
                      {React.string(desc)}
                    </div>
                  | None => React.null
                  }}
               </div>
               {switch (feed##isSubscribed) {
                | false =>
                  <Button.Primary
                    className="text-xs"
                    onClick={_ => {
                      let variables =
                        SubcribeToFeed.make(~id=feed##id, ())##variables;
                      subscribeToFeed(~variables, ()) |> ignore;
                    }}>
                    {React.string("Subscribe")}
                  </Button.Primary>
                | true =>
                  <Button.Secondary
                    className="text-xs"
                    onClick={_ => {
                      let variables =
                        SubcribeToFeed.make(~id=feed##id, ())##variables;
                      subscribeToFeed(~variables, ()) |> ignore;
                    }}>
                    {React.string("Unsubscribe")}
                  </Button.Secondary>
                }}
             </div>
           )
         ->React.array}
      </div>
    </div>
  | NoData
  | Error(_) => <p> {React.string("Get off my lawn!")} </p>
  };
};
