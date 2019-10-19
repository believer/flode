let inMemoryCache = ApolloInMemoryCache.createInMemoryCache();

let httpLink = ApolloLinks.createHttpLink(~uri=Config.apiUrl, ());

let authLink = {
  let authHandler = () => {
    let token = Storage.LocalStorage.getItem(Token);

    switch (token) {
    | Some(t) => {
        "headers": {
          "Authorization": {j|Bearer $t|j},
        },
      }
    | None => {
        "headers": {
          "Authorization": "",
        },
      }
    };
  };

  ApolloLinks.createContextLink(authHandler);
};

let client =
  ReasonApollo.createApolloClient(
    ~link=ApolloLinks.from([|authLink, httpLink|]),
    ~cache=inMemoryCache,
    (),
  );

ReactDOMRe.renderToElementWithId(
  <ReasonApolloHooks.ApolloProvider client>
    <App />
  </ReasonApolloHooks.ApolloProvider>,
  "root",
);
