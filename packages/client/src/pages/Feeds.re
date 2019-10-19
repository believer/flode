module GetFeeds = [%graphql
  {|
  query feeds {
    feeds {
      description
      id
      isSubscribed
      link
      title
    }
  }
|}
];

module GetFeedsQuery = ReasonApolloHooks.Query.Make(GetFeeds);

[@react.component]
let make = () => {
  let (result, _full) = GetFeedsQuery.use();

  <div>
    {switch (result) {
     | Loading => <p> {React.string("Loading...")} </p>
     | Data(data) =>
       <main className="h-screen flex">
         <div className="flex-1 p-5">
           {data##feeds
            ->Belt.Array.map(feed =>
                <div className="flex text-sm" key={feed##id}>
                  <div> {React.string(feed##title)} </div>
                  <div> {React.string(feed##link)} </div>
                  <div>
                    {React.string(feed##isSubscribed ? "TRUE" : "FALSE")}
                  </div>
                </div>
              )
            ->React.array}
         </div>
       </main>
     | NoData
     | Error(_) => <p> {React.string("Get off my lawn!")} </p>
     }}
  </div>;
};
