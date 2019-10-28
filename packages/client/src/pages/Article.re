module GetArticle = [%graphql
  {|
  query article($id: ID!) {
    article(id: $id) {
      description
      title
    }
  }
|}
];

module GetArticleQuery = ReasonApolloHooks.Query.Make(GetArticle);

[@react.component]
let make = (~id) => {
  let {theme}: Theme.Context.t = Theme.Context.use();
  let variables = GetArticle.make(~id, ())##variables;
  let (result, _full) = GetArticleQuery.use(~variables, ());

  switch (result) {
  | Loading => <p> {React.string("Loading...")} </p>
  | Data(data) =>
    switch (data##article) {
    | Some(article) =>
      <div
        className={Cn.make([
          "grid grid-template-article py-12 overflow-auto",
          switch (theme) {
          | Light => "bg-white"
          | Dark => "bg-gray-900"
          },
        ])}>
        <div className="grid-column-main">
          <Typography.H1> {React.string(article##title)} </Typography.H1>
          <Markdown
            className={
              switch (theme) {
              | Light => ""
              | Dark => "theme-dark"
              }
            }
            text={article##description}
          />
        </div>
      </div>
    | None => React.null
    }
  | NoData
  | Error(_) => <p> {React.string("Get off my lawn!")} </p>
  };
};
