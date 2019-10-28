import { GraphQLResolveInfo } from 'graphql';
import { RSSContext } from '../types';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};



export type AddFeedInput = {
  url: Scalars['String'],
};

export type CreateTokenInput = {
  email: Scalars['String'],
  password: Scalars['String'],
};

export type Feed = {
   __typename?: 'Feed',
  description?: Maybe<Scalars['String']>,
  id: Scalars['ID'],
  isSubscribed: Scalars['Boolean'],
  language?: Maybe<Scalars['String']>,
  link: Scalars['String'],
  title: Scalars['String'],
};

export enum FeedFilter {
  Unread = 'unread',
  Read = 'read'
}

export type FeedItem = {
   __typename?: 'FeedItem',
  category: FeedItemCategory,
  description: Scalars['String'],
  shortDescription: Scalars['String'],
  guid: Scalars['String'],
  id: Scalars['ID'],
  isRead: Scalars['Boolean'],
  link: Scalars['String'],
  pubDate: Scalars['String'],
  title: Scalars['String'],
};

export enum FeedItemCategory {
  Comics = 'Comics',
  TypeScript = 'TypeScript',
  Uncategorized = 'Uncategorized'
}

export type MarkAsReadInput = {
  feedItemId: Scalars['ID'],
};

export type Mutation = {
   __typename?: 'Mutation',
  _empty?: Maybe<Scalars['String']>,
  addFeed?: Maybe<Feed>,
  markAsRead: Scalars['Boolean'],
  markAsUnread: Scalars['Boolean'],
  markAllAsRead: Scalars['Boolean'],
  /** Update a users subscribed feeds */
  updateFeeds: Array<FeedItem>,
  subscribeToFeed: User,
  unsubscribeToFeed: User,
  createToken: Scalars['String'],
};


export type MutationAddFeedArgs = {
  input: AddFeedInput
};


export type MutationMarkAsReadArgs = {
  input: MarkAsReadInput
};


export type MutationMarkAsUnreadArgs = {
  input: MarkAsReadInput
};


export type MutationSubscribeToFeedArgs = {
  input: SubcribeToFeedInput
};


export type MutationUnsubscribeToFeedArgs = {
  input: SubcribeToFeedInput
};


export type MutationCreateTokenArgs = {
  input: CreateTokenInput
};

export type Query = {
   __typename?: 'Query',
  _empty?: Maybe<Scalars['String']>,
  article?: Maybe<FeedItem>,
  feeds: Array<Feed>,
  getStuff: Stuff,
  user?: Maybe<User>,
};


export type QueryArticleArgs = {
  id: Scalars['ID']
};


export type QueryUserArgs = {
  filterFeed?: Maybe<FeedFilter>
};

export type ReadFeedItemInput = {
  feedItemId: Scalars['ID'],
};

export type Stuff = {
   __typename?: 'Stuff',
  hello: Scalars['String'],
};

export type SubcribeToFeedInput = {
  feedId: Scalars['ID'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  email: Scalars['String'],
  feed: Array<FeedItem>,
};



export type ResolverTypeWrapper<T> = T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  FeedItem: ResolverTypeWrapper<FeedItem>,
  FeedItemCategory: FeedItemCategory,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Feed: ResolverTypeWrapper<Feed>,
  Stuff: ResolverTypeWrapper<Stuff>,
  FeedFilter: FeedFilter,
  User: ResolverTypeWrapper<User>,
  Mutation: ResolverTypeWrapper<{}>,
  AddFeedInput: AddFeedInput,
  MarkAsReadInput: MarkAsReadInput,
  SubcribeToFeedInput: SubcribeToFeedInput,
  CreateTokenInput: CreateTokenInput,
  ReadFeedItemInput: ReadFeedItemInput,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  ID: Scalars['ID'],
  FeedItem: FeedItem,
  FeedItemCategory: FeedItemCategory,
  Boolean: Scalars['Boolean'],
  Feed: Feed,
  Stuff: Stuff,
  FeedFilter: FeedFilter,
  User: User,
  Mutation: {},
  AddFeedInput: AddFeedInput,
  MarkAsReadInput: MarkAsReadInput,
  SubcribeToFeedInput: SubcribeToFeedInput,
  CreateTokenInput: CreateTokenInput,
  ReadFeedItemInput: ReadFeedItemInput,
};

export type IsAuthenticatedDirectiveResolver<Result, Parent, ContextType = RSSContext, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type HasRoleDirectiveResolver<Result, Parent, ContextType = RSSContext, Args = {   role?: Maybe<Maybe<Scalars['String']>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type FeedResolvers<ContextType = RSSContext, ParentType extends ResolversParentTypes['Feed'] = ResolversParentTypes['Feed']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isSubscribed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type FeedItemResolvers<ContextType = RSSContext, ParentType extends ResolversParentTypes['FeedItem'] = ResolversParentTypes['FeedItem']> = {
  category?: Resolver<ResolversTypes['FeedItemCategory'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  guid?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pubDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = RSSContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  addFeed?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType, RequireFields<MutationAddFeedArgs, 'input'>>,
  markAsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMarkAsReadArgs, 'input'>>,
  markAsUnread?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMarkAsUnreadArgs, 'input'>>,
  markAllAsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  updateFeeds?: Resolver<Array<ResolversTypes['FeedItem']>, ParentType, ContextType>,
  subscribeToFeed?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSubscribeToFeedArgs, 'input'>>,
  unsubscribeToFeed?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUnsubscribeToFeedArgs, 'input'>>,
  createToken?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateTokenArgs, 'input'>>,
};

export type QueryResolvers<ContextType = RSSContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  article?: Resolver<Maybe<ResolversTypes['FeedItem']>, ParentType, ContextType, RequireFields<QueryArticleArgs, 'id'>>,
  feeds?: Resolver<Array<ResolversTypes['Feed']>, ParentType, ContextType>,
  getStuff?: Resolver<ResolversTypes['Stuff'], ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, QueryUserArgs>,
};

export type StuffResolvers<ContextType = RSSContext, ParentType extends ResolversParentTypes['Stuff'] = ResolversParentTypes['Stuff']> = {
  hello?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type UserResolvers<ContextType = RSSContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  feed?: Resolver<Array<ResolversTypes['FeedItem']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = RSSContext> = {
  Feed?: FeedResolvers<ContextType>,
  FeedItem?: FeedItemResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Stuff?: StuffResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = RSSContext> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = RSSContext> = {
  isAuthenticated?: IsAuthenticatedDirectiveResolver<any, any, ContextType>,
  hasRole?: HasRoleDirectiveResolver<any, any, ContextType>,
};


/**
* @deprecated
* Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
*/
export type IDirectiveResolvers<ContextType = RSSContext> = DirectiveResolvers<ContextType>;