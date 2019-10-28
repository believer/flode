module MarkAsRead = [%graphql
  {|
  mutation markAsRead($id: ID!) {
    markAsRead(input: { feedItemId: $id })
  }
|}
];

module MarkAsReadMutation = ReasonApolloHooks.Mutation.Make(MarkAsRead);

[@react.component]
let make = (~item, ~selectArticle) => {
  let {theme}: Theme.Context.t = Theme.Context.use();
  let updateFeed = () => {
    let updateFeed =
      HomeQuery.GetProfile.make() |> ReasonApolloHooks.Utils.toQueryObj;

    [|updateFeed|];
  };

  let (markAsRead, _, _) =
    MarkAsReadMutation.use(~refetchQueries=_ => updateFeed(), ());

  let (card, markAsReadIcon, titleColor, cardIsRead) =
    switch (theme) {
    | Light => ("bg-white", "text-gray-300", "text-gray-800", "")
    | Dark => ("bg-gray-800", "text-gray-700", "text-gray-300", "bg-gray-900")
    };

  <button
    className={Cn.make([
      card,
      "text-sm mb-1 p-5 w-full text-left",
      "opacity-75"->Cn.ifTrue(item##isRead),
      cardIsRead->Cn.ifTrue(item##isRead),
    ])}
    type_="button"
    onClick={_ => {
      let variables = MarkAsRead.make(~id=item##id, ())##variables;

      markAsRead(~variables, ()) |> ignore;
      selectArticle(item##id);
    }}>
    <div
      className=TW.([Display(Flex), JustifyContent(JustifyBetween)] |> make)>
      <div
        className={Cn.make([
          titleColor,
          TW.(
            [
              Flex(Flex1),
              FontSize(TextBase),
              FontWeight(FontSemibold),
              Margin(Mr8),
            ]
            |> make
          ),
        ])}>
        {React.string(item##title)}
      </div>
      <svg
        className={Cn.make([
          markAsReadIcon,
          "text-green-400"->Cn.ifTrue(item##isRead),
        ])}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <div className="text-gray-600 mt-4 flex items-end justify-between">
      <div className="mr-8"> {React.string(item##shortDescription)} </div>
      <div className="text-xs text-gray-500">
        {Js.Date.fromString(item##pubDate)
         ->DateTime.format("yyyy-MM-dd")
         ->React.string}
      </div>
    </div>
  </button>;
};
