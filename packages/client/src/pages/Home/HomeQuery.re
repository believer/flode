module GetProfile = [%graphql
  {|
  query user($filter: FeedFilter) {
    user(filterFeed: $filter) {
      email
      feed {
        id
        isRead
        pubDate
        shortDescription
        title
      }
    }
  }
|}
];

module GetProfileQuery = ReasonApolloHooks.Query.Make(GetProfile);
