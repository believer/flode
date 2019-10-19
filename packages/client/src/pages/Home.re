module MarkAllAsRead = [%graphql
  {|
  mutation markAllAsRead {
    markAllAsRead
  }
|}
];

module MarkAllAsReadMutation = ReasonApolloHooks.Mutation.Make(MarkAllAsRead);

module MarkAsRead = [%graphql
  {|
  mutation markAsRead($id: ID!) {
    markAsRead(input: { feedItemId: $id })
  }
|}
];

module MarkAsReadMutation = ReasonApolloHooks.Mutation.Make(MarkAsRead);

module GetProfile = [%graphql
  {|
  query user($filter: FeedFilter) {
    user(filterFeed: $filter) {
      email
      feed {
        id
        isRead
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
  let updateFeed = () => {
    let updateFeed = GetProfile.make() |> ReasonApolloHooks.Utils.toQueryObj;

    [|updateFeed|];
  };

  let (markAllAsRead, _, _) =
    MarkAllAsReadMutation.use(~refetchQueries=_ => updateFeed(), ());

  let (markAsRead, _, _) =
    MarkAsReadMutation.use(~refetchQueries=_ => updateFeed(), ());

  let variables = GetProfile.make(~filter=`unread, ())##variables;
  let (result, _full) = GetProfileQuery.use(~variables, ());

  switch (result) {
  | Loading => <div className="p-5"> {React.string("Loading...")} </div>
  | Data(data) =>
    switch (data##user) {
    | Some(user) =>
      <div
        className="flex-1 bg-gray-100 grid grid-template-main overflow-auto">
        <div className="grid-column-main">
          {switch (Belt.Array.length(user##feed)) {
           | 0 =>
             <div className="flex justify-center items-center flex-col h-full">
               <div className="text-lg font-semibold mb-2">
                 {React.string("All done!")}
               </div>
               <div>
                 {React.string("You've caught up with everything.")}
               </div>
             </div>
           | _ =>
             <>
               <div className="flex justify-end mb-10 mt-20">
                 <button
                   className="text-gray-700"
                   onClick={_ => markAllAsRead() |> ignore}
                   type_="button">
                   <svg
                     className="w-4 h-4 fill-current"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20">
                     <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                   </svg>
                 </button>
               </div>
               {user##feed
                ->Belt.Array.map(feed =>
                    <button
                      className={Cn.make([
                        "flex justify-between text-sm bg-white mb-2 px-4 py-2 rounded
                     border border-gray-200 w-full",
                        "font-semibold"->Cn.ifTrue(!feed##isRead),
                      ])}
                      key={feed##id}
                      type_="button"
                      onClick={_ => {
                        let variables =
                          MarkAsRead.make(~id=feed##id, ())##variables;

                        markAsRead(~variables, ()) |> ignore;
                      }}>
                      <div> {React.string(feed##title)} </div>
                      <div className="text-xs text-gray-500 font-normal">
                        {Js.Date.fromString(feed##pubDate)
                         ->DateTime.DistanceToNow.make
                         ->React.string}
                      </div>
                    </button>
                  )
                ->React.array}
             </>
           }}
        </div>
      </div>
    | None => React.null
    }
  | NoData
  | Error(_) => <p> {React.string("Get off my lawn!")} </p>
  };
};
