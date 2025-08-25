
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model account_activity
 * 
 */
export type account_activity = $Result.DefaultSelection<Prisma.$account_activityPayload>
/**
 * Model accounts
 * 
 */
export type accounts = $Result.DefaultSelection<Prisma.$accountsPayload>
/**
 * Model attribute_definitions
 * 
 */
export type attribute_definitions = $Result.DefaultSelection<Prisma.$attribute_definitionsPayload>
/**
 * Model groups
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type groups = $Result.DefaultSelection<Prisma.$groupsPayload>
/**
 * Model newsletters
 * 
 */
export type newsletters = $Result.DefaultSelection<Prisma.$newslettersPayload>
/**
 * Model product_usage
 * 
 */
export type product_usage = $Result.DefaultSelection<Prisma.$product_usagePayload>
/**
 * Model products
 * 
 */
export type products = $Result.DefaultSelection<Prisma.$productsPayload>
/**
 * Model subscriptions
 * 
 */
export type subscriptions = $Result.DefaultSelection<Prisma.$subscriptionsPayload>
/**
 * Model top_pages
 * 
 */
export type top_pages = $Result.DefaultSelection<Prisma.$top_pagesPayload>
/**
 * Model user_accounts
 * 
 */
export type user_accounts = $Result.DefaultSelection<Prisma.$user_accountsPayload>
/**
 * Model user_activity
 * 
 */
export type user_activity = $Result.DefaultSelection<Prisma.$user_activityPayload>
/**
 * Model user_newsletters
 * 
 */
export type user_newsletters = $Result.DefaultSelection<Prisma.$user_newslettersPayload>
/**
 * Model users
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 * This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Account_activities
 * const account_activities = await prisma.account_activity.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Account_activities
   * const account_activities = await prisma.account_activity.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account_activity`: Exposes CRUD operations for the **account_activity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Account_activities
    * const account_activities = await prisma.account_activity.findMany()
    * ```
    */
  get account_activity(): Prisma.account_activityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accounts`: Exposes CRUD operations for the **accounts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.accounts.findMany()
    * ```
    */
  get accounts(): Prisma.accountsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.attribute_definitions`: Exposes CRUD operations for the **attribute_definitions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attribute_definitions
    * const attribute_definitions = await prisma.attribute_definitions.findMany()
    * ```
    */
  get attribute_definitions(): Prisma.attribute_definitionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groups`: Exposes CRUD operations for the **groups** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Groups
    * const groups = await prisma.groups.findMany()
    * ```
    */
  get groups(): Prisma.groupsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsletters`: Exposes CRUD operations for the **newsletters** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Newsletters
    * const newsletters = await prisma.newsletters.findMany()
    * ```
    */
  get newsletters(): Prisma.newslettersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product_usage`: Exposes CRUD operations for the **product_usage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Product_usages
    * const product_usages = await prisma.product_usage.findMany()
    * ```
    */
  get product_usage(): Prisma.product_usageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.products`: Exposes CRUD operations for the **products** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.products.findMany()
    * ```
    */
  get products(): Prisma.productsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptions`: Exposes CRUD operations for the **subscriptions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscriptions.findMany()
    * ```
    */
  get subscriptions(): Prisma.subscriptionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.top_pages`: Exposes CRUD operations for the **top_pages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Top_pages
    * const top_pages = await prisma.top_pages.findMany()
    * ```
    */
  get top_pages(): Prisma.top_pagesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_accounts`: Exposes CRUD operations for the **user_accounts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_accounts
    * const user_accounts = await prisma.user_accounts.findMany()
    * ```
    */
  get user_accounts(): Prisma.user_accountsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_activity`: Exposes CRUD operations for the **user_activity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_activities
    * const user_activities = await prisma.user_activity.findMany()
    * ```
    */
  get user_activity(): Prisma.user_activityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_newsletters`: Exposes CRUD operations for the **user_newsletters** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_newsletters
    * const user_newsletters = await prisma.user_newsletters.findMany()
    * ```
    */
  get user_newsletters(): Prisma.user_newslettersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    account_activity: 'account_activity',
    accounts: 'accounts',
    attribute_definitions: 'attribute_definitions',
    groups: 'groups',
    newsletters: 'newsletters',
    product_usage: 'product_usage',
    products: 'products',
    subscriptions: 'subscriptions',
    top_pages: 'top_pages',
    user_accounts: 'user_accounts',
    user_activity: 'user_activity',
    user_newsletters: 'user_newsletters',
    users: 'users'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account_activity" | "accounts" | "attribute_definitions" | "groups" | "newsletters" | "product_usage" | "products" | "subscriptions" | "top_pages" | "user_accounts" | "user_activity" | "user_newsletters" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      account_activity: {
        payload: Prisma.$account_activityPayload<ExtArgs>
        fields: Prisma.account_activityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.account_activityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.account_activityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>
          }
          findFirst: {
            args: Prisma.account_activityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.account_activityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>
          }
          findMany: {
            args: Prisma.account_activityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>[]
          }
          create: {
            args: Prisma.account_activityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>
          }
          createMany: {
            args: Prisma.account_activityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.account_activityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>[]
          }
          delete: {
            args: Prisma.account_activityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>
          }
          update: {
            args: Prisma.account_activityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>
          }
          deleteMany: {
            args: Prisma.account_activityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.account_activityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.account_activityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>[]
          }
          upsert: {
            args: Prisma.account_activityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$account_activityPayload>
          }
          aggregate: {
            args: Prisma.Account_activityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount_activity>
          }
          groupBy: {
            args: Prisma.account_activityGroupByArgs<ExtArgs>
            result: $Utils.Optional<Account_activityGroupByOutputType>[]
          }
          count: {
            args: Prisma.account_activityCountArgs<ExtArgs>
            result: $Utils.Optional<Account_activityCountAggregateOutputType> | number
          }
        }
      }
      accounts: {
        payload: Prisma.$accountsPayload<ExtArgs>
        fields: Prisma.accountsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.accountsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.accountsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findFirst: {
            args: Prisma.accountsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.accountsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findMany: {
            args: Prisma.accountsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>[]
          }
          create: {
            args: Prisma.accountsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          createMany: {
            args: Prisma.accountsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.accountsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>[]
          }
          delete: {
            args: Prisma.accountsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          update: {
            args: Prisma.accountsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          deleteMany: {
            args: Prisma.accountsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.accountsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.accountsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>[]
          }
          upsert: {
            args: Prisma.accountsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          aggregate: {
            args: Prisma.AccountsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccounts>
          }
          groupBy: {
            args: Prisma.accountsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountsGroupByOutputType>[]
          }
          count: {
            args: Prisma.accountsCountArgs<ExtArgs>
            result: $Utils.Optional<AccountsCountAggregateOutputType> | number
          }
        }
      }
      attribute_definitions: {
        payload: Prisma.$attribute_definitionsPayload<ExtArgs>
        fields: Prisma.attribute_definitionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.attribute_definitionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.attribute_definitionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>
          }
          findFirst: {
            args: Prisma.attribute_definitionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.attribute_definitionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>
          }
          findMany: {
            args: Prisma.attribute_definitionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>[]
          }
          create: {
            args: Prisma.attribute_definitionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>
          }
          createMany: {
            args: Prisma.attribute_definitionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.attribute_definitionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>[]
          }
          delete: {
            args: Prisma.attribute_definitionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>
          }
          update: {
            args: Prisma.attribute_definitionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>
          }
          deleteMany: {
            args: Prisma.attribute_definitionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.attribute_definitionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.attribute_definitionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>[]
          }
          upsert: {
            args: Prisma.attribute_definitionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribute_definitionsPayload>
          }
          aggregate: {
            args: Prisma.Attribute_definitionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttribute_definitions>
          }
          groupBy: {
            args: Prisma.attribute_definitionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Attribute_definitionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.attribute_definitionsCountArgs<ExtArgs>
            result: $Utils.Optional<Attribute_definitionsCountAggregateOutputType> | number
          }
        }
      }
      groups: {
        payload: Prisma.$groupsPayload<ExtArgs>
        fields: Prisma.groupsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.groupsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.groupsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>
          }
          findFirst: {
            args: Prisma.groupsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.groupsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>
          }
          findMany: {
            args: Prisma.groupsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>[]
          }
          create: {
            args: Prisma.groupsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>
          }
          createMany: {
            args: Prisma.groupsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.groupsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>[]
          }
          delete: {
            args: Prisma.groupsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>
          }
          update: {
            args: Prisma.groupsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>
          }
          deleteMany: {
            args: Prisma.groupsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.groupsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.groupsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>[]
          }
          upsert: {
            args: Prisma.groupsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$groupsPayload>
          }
          aggregate: {
            args: Prisma.GroupsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroups>
          }
          groupBy: {
            args: Prisma.groupsGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupsGroupByOutputType>[]
          }
          count: {
            args: Prisma.groupsCountArgs<ExtArgs>
            result: $Utils.Optional<GroupsCountAggregateOutputType> | number
          }
        }
      }
      newsletters: {
        payload: Prisma.$newslettersPayload<ExtArgs>
        fields: Prisma.newslettersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.newslettersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.newslettersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>
          }
          findFirst: {
            args: Prisma.newslettersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.newslettersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>
          }
          findMany: {
            args: Prisma.newslettersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>[]
          }
          create: {
            args: Prisma.newslettersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>
          }
          createMany: {
            args: Prisma.newslettersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.newslettersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>[]
          }
          delete: {
            args: Prisma.newslettersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>
          }
          update: {
            args: Prisma.newslettersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>
          }
          deleteMany: {
            args: Prisma.newslettersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.newslettersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.newslettersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>[]
          }
          upsert: {
            args: Prisma.newslettersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$newslettersPayload>
          }
          aggregate: {
            args: Prisma.NewslettersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsletters>
          }
          groupBy: {
            args: Prisma.newslettersGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewslettersGroupByOutputType>[]
          }
          count: {
            args: Prisma.newslettersCountArgs<ExtArgs>
            result: $Utils.Optional<NewslettersCountAggregateOutputType> | number
          }
        }
      }
      product_usage: {
        payload: Prisma.$product_usagePayload<ExtArgs>
        fields: Prisma.product_usageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.product_usageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.product_usageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>
          }
          findFirst: {
            args: Prisma.product_usageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.product_usageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>
          }
          findMany: {
            args: Prisma.product_usageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>[]
          }
          create: {
            args: Prisma.product_usageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>
          }
          createMany: {
            args: Prisma.product_usageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.product_usageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>[]
          }
          delete: {
            args: Prisma.product_usageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>
          }
          update: {
            args: Prisma.product_usageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>
          }
          deleteMany: {
            args: Prisma.product_usageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.product_usageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.product_usageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>[]
          }
          upsert: {
            args: Prisma.product_usageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_usagePayload>
          }
          aggregate: {
            args: Prisma.Product_usageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct_usage>
          }
          groupBy: {
            args: Prisma.product_usageGroupByArgs<ExtArgs>
            result: $Utils.Optional<Product_usageGroupByOutputType>[]
          }
          count: {
            args: Prisma.product_usageCountArgs<ExtArgs>
            result: $Utils.Optional<Product_usageCountAggregateOutputType> | number
          }
        }
      }
      products: {
        payload: Prisma.$productsPayload<ExtArgs>
        fields: Prisma.productsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.productsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.productsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>
          }
          findFirst: {
            args: Prisma.productsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.productsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>
          }
          findMany: {
            args: Prisma.productsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>[]
          }
          create: {
            args: Prisma.productsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>
          }
          createMany: {
            args: Prisma.productsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.productsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>[]
          }
          delete: {
            args: Prisma.productsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>
          }
          update: {
            args: Prisma.productsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>
          }
          deleteMany: {
            args: Prisma.productsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.productsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.productsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>[]
          }
          upsert: {
            args: Prisma.productsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productsPayload>
          }
          aggregate: {
            args: Prisma.ProductsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProducts>
          }
          groupBy: {
            args: Prisma.productsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductsGroupByOutputType>[]
          }
          count: {
            args: Prisma.productsCountArgs<ExtArgs>
            result: $Utils.Optional<ProductsCountAggregateOutputType> | number
          }
        }
      }
      subscriptions: {
        payload: Prisma.$subscriptionsPayload<ExtArgs>
        fields: Prisma.subscriptionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.subscriptionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.subscriptionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>
          }
          findFirst: {
            args: Prisma.subscriptionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.subscriptionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>
          }
          findMany: {
            args: Prisma.subscriptionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>[]
          }
          create: {
            args: Prisma.subscriptionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>
          }
          createMany: {
            args: Prisma.subscriptionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.subscriptionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>[]
          }
          delete: {
            args: Prisma.subscriptionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>
          }
          update: {
            args: Prisma.subscriptionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>
          }
          deleteMany: {
            args: Prisma.subscriptionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.subscriptionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.subscriptionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>[]
          }
          upsert: {
            args: Prisma.subscriptionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscriptionsPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptions>
          }
          groupBy: {
            args: Prisma.subscriptionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.subscriptionsCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionsCountAggregateOutputType> | number
          }
        }
      }
      top_pages: {
        payload: Prisma.$top_pagesPayload<ExtArgs>
        fields: Prisma.top_pagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.top_pagesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.top_pagesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>
          }
          findFirst: {
            args: Prisma.top_pagesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.top_pagesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>
          }
          findMany: {
            args: Prisma.top_pagesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>[]
          }
          create: {
            args: Prisma.top_pagesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>
          }
          createMany: {
            args: Prisma.top_pagesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.top_pagesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>[]
          }
          delete: {
            args: Prisma.top_pagesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>
          }
          update: {
            args: Prisma.top_pagesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>
          }
          deleteMany: {
            args: Prisma.top_pagesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.top_pagesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.top_pagesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>[]
          }
          upsert: {
            args: Prisma.top_pagesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$top_pagesPayload>
          }
          aggregate: {
            args: Prisma.Top_pagesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTop_pages>
          }
          groupBy: {
            args: Prisma.top_pagesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Top_pagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.top_pagesCountArgs<ExtArgs>
            result: $Utils.Optional<Top_pagesCountAggregateOutputType> | number
          }
        }
      }
      user_accounts: {
        payload: Prisma.$user_accountsPayload<ExtArgs>
        fields: Prisma.user_accountsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_accountsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_accountsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>
          }
          findFirst: {
            args: Prisma.user_accountsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_accountsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>
          }
          findMany: {
            args: Prisma.user_accountsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>[]
          }
          create: {
            args: Prisma.user_accountsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>
          }
          createMany: {
            args: Prisma.user_accountsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_accountsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>[]
          }
          delete: {
            args: Prisma.user_accountsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>
          }
          update: {
            args: Prisma.user_accountsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>
          }
          deleteMany: {
            args: Prisma.user_accountsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_accountsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.user_accountsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>[]
          }
          upsert: {
            args: Prisma.user_accountsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_accountsPayload>
          }
          aggregate: {
            args: Prisma.User_accountsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_accounts>
          }
          groupBy: {
            args: Prisma.user_accountsGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_accountsGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_accountsCountArgs<ExtArgs>
            result: $Utils.Optional<User_accountsCountAggregateOutputType> | number
          }
        }
      }
      user_activity: {
        payload: Prisma.$user_activityPayload<ExtArgs>
        fields: Prisma.user_activityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_activityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_activityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>
          }
          findFirst: {
            args: Prisma.user_activityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_activityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>
          }
          findMany: {
            args: Prisma.user_activityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>[]
          }
          create: {
            args: Prisma.user_activityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>
          }
          createMany: {
            args: Prisma.user_activityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_activityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>[]
          }
          delete: {
            args: Prisma.user_activityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>
          }
          update: {
            args: Prisma.user_activityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>
          }
          deleteMany: {
            args: Prisma.user_activityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_activityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.user_activityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>[]
          }
          upsert: {
            args: Prisma.user_activityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_activityPayload>
          }
          aggregate: {
            args: Prisma.User_activityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_activity>
          }
          groupBy: {
            args: Prisma.user_activityGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_activityGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_activityCountArgs<ExtArgs>
            result: $Utils.Optional<User_activityCountAggregateOutputType> | number
          }
        }
      }
      user_newsletters: {
        payload: Prisma.$user_newslettersPayload<ExtArgs>
        fields: Prisma.user_newslettersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_newslettersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_newslettersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>
          }
          findFirst: {
            args: Prisma.user_newslettersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_newslettersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>
          }
          findMany: {
            args: Prisma.user_newslettersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>[]
          }
          create: {
            args: Prisma.user_newslettersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>
          }
          createMany: {
            args: Prisma.user_newslettersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_newslettersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>[]
          }
          delete: {
            args: Prisma.user_newslettersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>
          }
          update: {
            args: Prisma.user_newslettersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>
          }
          deleteMany: {
            args: Prisma.user_newslettersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_newslettersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.user_newslettersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>[]
          }
          upsert: {
            args: Prisma.user_newslettersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_newslettersPayload>
          }
          aggregate: {
            args: Prisma.User_newslettersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_newsletters>
          }
          groupBy: {
            args: Prisma.user_newslettersGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_newslettersGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_newslettersCountArgs<ExtArgs>
            result: $Utils.Optional<User_newslettersCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    account_activity?: account_activityOmit
    accounts?: accountsOmit
    attribute_definitions?: attribute_definitionsOmit
    groups?: groupsOmit
    newsletters?: newslettersOmit
    product_usage?: product_usageOmit
    products?: productsOmit
    subscriptions?: subscriptionsOmit
    top_pages?: top_pagesOmit
    user_accounts?: user_accountsOmit
    user_activity?: user_activityOmit
    user_newsletters?: user_newslettersOmit
    users?: usersOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AccountsCountOutputType
   */

  export type AccountsCountOutputType = {
    account_activity: number
    groups: number
    product_usage: number
    subscriptions: number
    top_pages: number
    user_accounts: number
  }

  export type AccountsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account_activity?: boolean | AccountsCountOutputTypeCountAccount_activityArgs
    groups?: boolean | AccountsCountOutputTypeCountGroupsArgs
    product_usage?: boolean | AccountsCountOutputTypeCountProduct_usageArgs
    subscriptions?: boolean | AccountsCountOutputTypeCountSubscriptionsArgs
    top_pages?: boolean | AccountsCountOutputTypeCountTop_pagesArgs
    user_accounts?: boolean | AccountsCountOutputTypeCountUser_accountsArgs
  }

  // Custom InputTypes
  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountsCountOutputType
     */
    select?: AccountsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountAccount_activityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: account_activityWhereInput
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: groupsWhereInput
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountProduct_usageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: product_usageWhereInput
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subscriptionsWhereInput
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountTop_pagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: top_pagesWhereInput
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountUser_accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_accountsWhereInput
  }


  /**
   * Count Type GroupsCountOutputType
   */

  export type GroupsCountOutputType = {
    users: number
  }

  export type GroupsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | GroupsCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * GroupsCountOutputType without action
   */
  export type GroupsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupsCountOutputType
     */
    select?: GroupsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GroupsCountOutputType without action
   */
  export type GroupsCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
  }


  /**
   * Count Type NewslettersCountOutputType
   */

  export type NewslettersCountOutputType = {
    user_newsletters: number
  }

  export type NewslettersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user_newsletters?: boolean | NewslettersCountOutputTypeCountUser_newslettersArgs
  }

  // Custom InputTypes
  /**
   * NewslettersCountOutputType without action
   */
  export type NewslettersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewslettersCountOutputType
     */
    select?: NewslettersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NewslettersCountOutputType without action
   */
  export type NewslettersCountOutputTypeCountUser_newslettersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_newslettersWhereInput
  }


  /**
   * Count Type ProductsCountOutputType
   */

  export type ProductsCountOutputType = {
    product_usage: number
  }

  export type ProductsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product_usage?: boolean | ProductsCountOutputTypeCountProduct_usageArgs
  }

  // Custom InputTypes
  /**
   * ProductsCountOutputType without action
   */
  export type ProductsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductsCountOutputType
     */
    select?: ProductsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductsCountOutputType without action
   */
  export type ProductsCountOutputTypeCountProduct_usageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: product_usageWhereInput
  }


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    user_accounts: number
    user_activity: number
    user_newsletters: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user_accounts?: boolean | UsersCountOutputTypeCountUser_accountsArgs
    user_activity?: boolean | UsersCountOutputTypeCountUser_activityArgs
    user_newsletters?: boolean | UsersCountOutputTypeCountUser_newslettersArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountUser_accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_accountsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountUser_activityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_activityWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountUser_newslettersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_newslettersWhereInput
  }


  /**
   * Models
   */

  /**
   * Model account_activity
   */

  export type AggregateAccount_activity = {
    _count: Account_activityCountAggregateOutputType | null
    _avg: Account_activityAvgAggregateOutputType | null
    _sum: Account_activitySumAggregateOutputType | null
    _min: Account_activityMinAggregateOutputType | null
    _max: Account_activityMaxAggregateOutputType | null
  }

  export type Account_activityAvgAggregateOutputType = {
    id: number | null
    account_id: number | null
    active_users: number | null
    pageviews: number | null
  }

  export type Account_activitySumAggregateOutputType = {
    id: number | null
    account_id: number | null
    active_users: number | null
    pageviews: number | null
  }

  export type Account_activityMinAggregateOutputType = {
    id: number | null
    account_id: number | null
    date: Date | null
    active_users: number | null
    pageviews: number | null
    created_at: Date | null
  }

  export type Account_activityMaxAggregateOutputType = {
    id: number | null
    account_id: number | null
    date: Date | null
    active_users: number | null
    pageviews: number | null
    created_at: Date | null
  }

  export type Account_activityCountAggregateOutputType = {
    id: number
    account_id: number
    date: number
    active_users: number
    pageviews: number
    created_at: number
    _all: number
  }


  export type Account_activityAvgAggregateInputType = {
    id?: true
    account_id?: true
    active_users?: true
    pageviews?: true
  }

  export type Account_activitySumAggregateInputType = {
    id?: true
    account_id?: true
    active_users?: true
    pageviews?: true
  }

  export type Account_activityMinAggregateInputType = {
    id?: true
    account_id?: true
    date?: true
    active_users?: true
    pageviews?: true
    created_at?: true
  }

  export type Account_activityMaxAggregateInputType = {
    id?: true
    account_id?: true
    date?: true
    active_users?: true
    pageviews?: true
    created_at?: true
  }

  export type Account_activityCountAggregateInputType = {
    id?: true
    account_id?: true
    date?: true
    active_users?: true
    pageviews?: true
    created_at?: true
    _all?: true
  }

  export type Account_activityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which account_activity to aggregate.
     */
    where?: account_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of account_activities to fetch.
     */
    orderBy?: account_activityOrderByWithRelationInput | account_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: account_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` account_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` account_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned account_activities
    **/
    _count?: true | Account_activityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Account_activityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Account_activitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Account_activityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Account_activityMaxAggregateInputType
  }

  export type GetAccount_activityAggregateType<T extends Account_activityAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount_activity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount_activity[P]>
      : GetScalarType<T[P], AggregateAccount_activity[P]>
  }




  export type account_activityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: account_activityWhereInput
    orderBy?: account_activityOrderByWithAggregationInput | account_activityOrderByWithAggregationInput[]
    by: Account_activityScalarFieldEnum[] | Account_activityScalarFieldEnum
    having?: account_activityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Account_activityCountAggregateInputType | true
    _avg?: Account_activityAvgAggregateInputType
    _sum?: Account_activitySumAggregateInputType
    _min?: Account_activityMinAggregateInputType
    _max?: Account_activityMaxAggregateInputType
  }

  export type Account_activityGroupByOutputType = {
    id: number
    account_id: number | null
    date: Date
    active_users: number | null
    pageviews: number | null
    created_at: Date | null
    _count: Account_activityCountAggregateOutputType | null
    _avg: Account_activityAvgAggregateOutputType | null
    _sum: Account_activitySumAggregateOutputType | null
    _min: Account_activityMinAggregateOutputType | null
    _max: Account_activityMaxAggregateOutputType | null
  }

  type GetAccount_activityGroupByPayload<T extends account_activityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Account_activityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Account_activityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Account_activityGroupByOutputType[P]>
            : GetScalarType<T[P], Account_activityGroupByOutputType[P]>
        }
      >
    >


  export type account_activitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    date?: boolean
    active_users?: boolean
    pageviews?: boolean
    created_at?: boolean
    accounts?: boolean | account_activity$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["account_activity"]>

  export type account_activitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    date?: boolean
    active_users?: boolean
    pageviews?: boolean
    created_at?: boolean
    accounts?: boolean | account_activity$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["account_activity"]>

  export type account_activitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    date?: boolean
    active_users?: boolean
    pageviews?: boolean
    created_at?: boolean
    accounts?: boolean | account_activity$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["account_activity"]>

  export type account_activitySelectScalar = {
    id?: boolean
    account_id?: boolean
    date?: boolean
    active_users?: boolean
    pageviews?: boolean
    created_at?: boolean
  }

  export type account_activityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "account_id" | "date" | "active_users" | "pageviews" | "created_at", ExtArgs["result"]["account_activity"]>
  export type account_activityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | account_activity$accountsArgs<ExtArgs>
  }
  export type account_activityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | account_activity$accountsArgs<ExtArgs>
  }
  export type account_activityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | account_activity$accountsArgs<ExtArgs>
  }

  export type $account_activityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "account_activity"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      account_id: number | null
      date: Date
      active_users: number | null
      pageviews: number | null
      created_at: Date | null
    }, ExtArgs["result"]["account_activity"]>
    composites: {}
  }

  type account_activityGetPayload<S extends boolean | null | undefined | account_activityDefaultArgs> = $Result.GetResult<Prisma.$account_activityPayload, S>

  type account_activityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<account_activityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Account_activityCountAggregateInputType | true
    }

  export interface account_activityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['account_activity'], meta: { name: 'account_activity' } }
    /**
     * Find zero or one Account_activity that matches the filter.
     * @param {account_activityFindUniqueArgs} args - Arguments to find a Account_activity
     * @example
     * // Get one Account_activity
     * const account_activity = await prisma.account_activity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends account_activityFindUniqueArgs>(args: SelectSubset<T, account_activityFindUniqueArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account_activity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {account_activityFindUniqueOrThrowArgs} args - Arguments to find a Account_activity
     * @example
     * // Get one Account_activity
     * const account_activity = await prisma.account_activity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends account_activityFindUniqueOrThrowArgs>(args: SelectSubset<T, account_activityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account_activity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {account_activityFindFirstArgs} args - Arguments to find a Account_activity
     * @example
     * // Get one Account_activity
     * const account_activity = await prisma.account_activity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends account_activityFindFirstArgs>(args?: SelectSubset<T, account_activityFindFirstArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account_activity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {account_activityFindFirstOrThrowArgs} args - Arguments to find a Account_activity
     * @example
     * // Get one Account_activity
     * const account_activity = await prisma.account_activity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends account_activityFindFirstOrThrowArgs>(args?: SelectSubset<T, account_activityFindFirstOrThrowArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Account_activities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {account_activityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Account_activities
     * const account_activities = await prisma.account_activity.findMany()
     * 
     * // Get first 10 Account_activities
     * const account_activities = await prisma.account_activity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const account_activityWithIdOnly = await prisma.account_activity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends account_activityFindManyArgs>(args?: SelectSubset<T, account_activityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account_activity.
     * @param {account_activityCreateArgs} args - Arguments to create a Account_activity.
     * @example
     * // Create one Account_activity
     * const Account_activity = await prisma.account_activity.create({
     *   data: {
     *     // ... data to create a Account_activity
     *   }
     * })
     * 
     */
    create<T extends account_activityCreateArgs>(args: SelectSubset<T, account_activityCreateArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Account_activities.
     * @param {account_activityCreateManyArgs} args - Arguments to create many Account_activities.
     * @example
     * // Create many Account_activities
     * const account_activity = await prisma.account_activity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends account_activityCreateManyArgs>(args?: SelectSubset<T, account_activityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Account_activities and returns the data saved in the database.
     * @param {account_activityCreateManyAndReturnArgs} args - Arguments to create many Account_activities.
     * @example
     * // Create many Account_activities
     * const account_activity = await prisma.account_activity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Account_activities and only return the `id`
     * const account_activityWithIdOnly = await prisma.account_activity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends account_activityCreateManyAndReturnArgs>(args?: SelectSubset<T, account_activityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account_activity.
     * @param {account_activityDeleteArgs} args - Arguments to delete one Account_activity.
     * @example
     * // Delete one Account_activity
     * const Account_activity = await prisma.account_activity.delete({
     *   where: {
     *     // ... filter to delete one Account_activity
     *   }
     * })
     * 
     */
    delete<T extends account_activityDeleteArgs>(args: SelectSubset<T, account_activityDeleteArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account_activity.
     * @param {account_activityUpdateArgs} args - Arguments to update one Account_activity.
     * @example
     * // Update one Account_activity
     * const account_activity = await prisma.account_activity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends account_activityUpdateArgs>(args: SelectSubset<T, account_activityUpdateArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Account_activities.
     * @param {account_activityDeleteManyArgs} args - Arguments to filter Account_activities to delete.
     * @example
     * // Delete a few Account_activities
     * const { count } = await prisma.account_activity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends account_activityDeleteManyArgs>(args?: SelectSubset<T, account_activityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Account_activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {account_activityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Account_activities
     * const account_activity = await prisma.account_activity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends account_activityUpdateManyArgs>(args: SelectSubset<T, account_activityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Account_activities and returns the data updated in the database.
     * @param {account_activityUpdateManyAndReturnArgs} args - Arguments to update many Account_activities.
     * @example
     * // Update many Account_activities
     * const account_activity = await prisma.account_activity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Account_activities and only return the `id`
     * const account_activityWithIdOnly = await prisma.account_activity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends account_activityUpdateManyAndReturnArgs>(args: SelectSubset<T, account_activityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account_activity.
     * @param {account_activityUpsertArgs} args - Arguments to update or create a Account_activity.
     * @example
     * // Update or create a Account_activity
     * const account_activity = await prisma.account_activity.upsert({
     *   create: {
     *     // ... data to create a Account_activity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account_activity we want to update
     *   }
     * })
     */
    upsert<T extends account_activityUpsertArgs>(args: SelectSubset<T, account_activityUpsertArgs<ExtArgs>>): Prisma__account_activityClient<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Account_activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {account_activityCountArgs} args - Arguments to filter Account_activities to count.
     * @example
     * // Count the number of Account_activities
     * const count = await prisma.account_activity.count({
     *   where: {
     *     // ... the filter for the Account_activities we want to count
     *   }
     * })
    **/
    count<T extends account_activityCountArgs>(
      args?: Subset<T, account_activityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Account_activityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account_activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Account_activityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Account_activityAggregateArgs>(args: Subset<T, Account_activityAggregateArgs>): Prisma.PrismaPromise<GetAccount_activityAggregateType<T>>

    /**
     * Group by Account_activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {account_activityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends account_activityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: account_activityGroupByArgs['orderBy'] }
        : { orderBy?: account_activityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, account_activityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccount_activityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the account_activity model
   */
  readonly fields: account_activityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for account_activity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__account_activityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends account_activity$accountsArgs<ExtArgs> = {}>(args?: Subset<T, account_activity$accountsArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the account_activity model
   */
  interface account_activityFieldRefs {
    readonly id: FieldRef<"account_activity", 'Int'>
    readonly account_id: FieldRef<"account_activity", 'Int'>
    readonly date: FieldRef<"account_activity", 'DateTime'>
    readonly active_users: FieldRef<"account_activity", 'Int'>
    readonly pageviews: FieldRef<"account_activity", 'Int'>
    readonly created_at: FieldRef<"account_activity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * account_activity findUnique
   */
  export type account_activityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * Filter, which account_activity to fetch.
     */
    where: account_activityWhereUniqueInput
  }

  /**
   * account_activity findUniqueOrThrow
   */
  export type account_activityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * Filter, which account_activity to fetch.
     */
    where: account_activityWhereUniqueInput
  }

  /**
   * account_activity findFirst
   */
  export type account_activityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * Filter, which account_activity to fetch.
     */
    where?: account_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of account_activities to fetch.
     */
    orderBy?: account_activityOrderByWithRelationInput | account_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for account_activities.
     */
    cursor?: account_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` account_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` account_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of account_activities.
     */
    distinct?: Account_activityScalarFieldEnum | Account_activityScalarFieldEnum[]
  }

  /**
   * account_activity findFirstOrThrow
   */
  export type account_activityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * Filter, which account_activity to fetch.
     */
    where?: account_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of account_activities to fetch.
     */
    orderBy?: account_activityOrderByWithRelationInput | account_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for account_activities.
     */
    cursor?: account_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` account_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` account_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of account_activities.
     */
    distinct?: Account_activityScalarFieldEnum | Account_activityScalarFieldEnum[]
  }

  /**
   * account_activity findMany
   */
  export type account_activityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * Filter, which account_activities to fetch.
     */
    where?: account_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of account_activities to fetch.
     */
    orderBy?: account_activityOrderByWithRelationInput | account_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing account_activities.
     */
    cursor?: account_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` account_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` account_activities.
     */
    skip?: number
    distinct?: Account_activityScalarFieldEnum | Account_activityScalarFieldEnum[]
  }

  /**
   * account_activity create
   */
  export type account_activityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * The data needed to create a account_activity.
     */
    data: XOR<account_activityCreateInput, account_activityUncheckedCreateInput>
  }

  /**
   * account_activity createMany
   */
  export type account_activityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many account_activities.
     */
    data: account_activityCreateManyInput | account_activityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * account_activity createManyAndReturn
   */
  export type account_activityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * The data used to create many account_activities.
     */
    data: account_activityCreateManyInput | account_activityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * account_activity update
   */
  export type account_activityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * The data needed to update a account_activity.
     */
    data: XOR<account_activityUpdateInput, account_activityUncheckedUpdateInput>
    /**
     * Choose, which account_activity to update.
     */
    where: account_activityWhereUniqueInput
  }

  /**
   * account_activity updateMany
   */
  export type account_activityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update account_activities.
     */
    data: XOR<account_activityUpdateManyMutationInput, account_activityUncheckedUpdateManyInput>
    /**
     * Filter which account_activities to update
     */
    where?: account_activityWhereInput
    /**
     * Limit how many account_activities to update.
     */
    limit?: number
  }

  /**
   * account_activity updateManyAndReturn
   */
  export type account_activityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * The data used to update account_activities.
     */
    data: XOR<account_activityUpdateManyMutationInput, account_activityUncheckedUpdateManyInput>
    /**
     * Filter which account_activities to update
     */
    where?: account_activityWhereInput
    /**
     * Limit how many account_activities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * account_activity upsert
   */
  export type account_activityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * The filter to search for the account_activity to update in case it exists.
     */
    where: account_activityWhereUniqueInput
    /**
     * In case the account_activity found by the `where` argument doesn't exist, create a new account_activity with this data.
     */
    create: XOR<account_activityCreateInput, account_activityUncheckedCreateInput>
    /**
     * In case the account_activity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<account_activityUpdateInput, account_activityUncheckedUpdateInput>
  }

  /**
   * account_activity delete
   */
  export type account_activityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    /**
     * Filter which account_activity to delete.
     */
    where: account_activityWhereUniqueInput
  }

  /**
   * account_activity deleteMany
   */
  export type account_activityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which account_activities to delete
     */
    where?: account_activityWhereInput
    /**
     * Limit how many account_activities to delete.
     */
    limit?: number
  }

  /**
   * account_activity.accounts
   */
  export type account_activity$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    where?: accountsWhereInput
  }

  /**
   * account_activity without action
   */
  export type account_activityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
  }


  /**
   * Model accounts
   */

  export type AggregateAccounts = {
    _count: AccountsCountAggregateOutputType | null
    _avg: AccountsAvgAggregateOutputType | null
    _sum: AccountsSumAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  export type AccountsAvgAggregateOutputType = {
    id: number | null
    total_users: number | null
    active_users: number | null
    mrr: Decimal | null
    health_score: number | null
  }

  export type AccountsSumAggregateOutputType = {
    id: number | null
    total_users: number | null
    active_users: number | null
    mrr: Decimal | null
    health_score: number | null
  }

  export type AccountsMinAggregateOutputType = {
    id: number | null
    external_id: string | null
    name: string | null
    type: string | null
    status: string | null
    industry: string | null
    website: string | null
    contact_name: string | null
    contact_email: string | null
    contact_phone: string | null
    address: string | null
    total_users: number | null
    active_users: number | null
    mrr: Decimal | null
    subscription_start: Date | null
    next_billing: Date | null
    health_score: number | null
    rep_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AccountsMaxAggregateOutputType = {
    id: number | null
    external_id: string | null
    name: string | null
    type: string | null
    status: string | null
    industry: string | null
    website: string | null
    contact_name: string | null
    contact_email: string | null
    contact_phone: string | null
    address: string | null
    total_users: number | null
    active_users: number | null
    mrr: Decimal | null
    subscription_start: Date | null
    next_billing: Date | null
    health_score: number | null
    rep_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AccountsCountAggregateOutputType = {
    id: number
    external_id: number
    name: number
    type: number
    status: number
    industry: number
    website: number
    contact_name: number
    contact_email: number
    contact_phone: number
    address: number
    total_users: number
    active_users: number
    mrr: number
    subscription_start: number
    next_billing: number
    health_score: number
    rep_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type AccountsAvgAggregateInputType = {
    id?: true
    total_users?: true
    active_users?: true
    mrr?: true
    health_score?: true
  }

  export type AccountsSumAggregateInputType = {
    id?: true
    total_users?: true
    active_users?: true
    mrr?: true
    health_score?: true
  }

  export type AccountsMinAggregateInputType = {
    id?: true
    external_id?: true
    name?: true
    type?: true
    status?: true
    industry?: true
    website?: true
    contact_name?: true
    contact_email?: true
    contact_phone?: true
    address?: true
    total_users?: true
    active_users?: true
    mrr?: true
    subscription_start?: true
    next_billing?: true
    health_score?: true
    rep_id?: true
    created_at?: true
    updated_at?: true
  }

  export type AccountsMaxAggregateInputType = {
    id?: true
    external_id?: true
    name?: true
    type?: true
    status?: true
    industry?: true
    website?: true
    contact_name?: true
    contact_email?: true
    contact_phone?: true
    address?: true
    total_users?: true
    active_users?: true
    mrr?: true
    subscription_start?: true
    next_billing?: true
    health_score?: true
    rep_id?: true
    created_at?: true
    updated_at?: true
  }

  export type AccountsCountAggregateInputType = {
    id?: true
    external_id?: true
    name?: true
    type?: true
    status?: true
    industry?: true
    website?: true
    contact_name?: true
    contact_email?: true
    contact_phone?: true
    address?: true
    total_users?: true
    active_users?: true
    mrr?: true
    subscription_start?: true
    next_billing?: true
    health_score?: true
    rep_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type AccountsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to aggregate.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accounts
    **/
    _count?: true | AccountsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountsMaxAggregateInputType
  }

  export type GetAccountsAggregateType<T extends AccountsAggregateArgs> = {
        [P in keyof T & keyof AggregateAccounts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccounts[P]>
      : GetScalarType<T[P], AggregateAccounts[P]>
  }




  export type accountsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accountsWhereInput
    orderBy?: accountsOrderByWithAggregationInput | accountsOrderByWithAggregationInput[]
    by: AccountsScalarFieldEnum[] | AccountsScalarFieldEnum
    having?: accountsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountsCountAggregateInputType | true
    _avg?: AccountsAvgAggregateInputType
    _sum?: AccountsSumAggregateInputType
    _min?: AccountsMinAggregateInputType
    _max?: AccountsMaxAggregateInputType
  }

  export type AccountsGroupByOutputType = {
    id: number
    external_id: string
    name: string
    type: string | null
    status: string
    industry: string | null
    website: string | null
    contact_name: string | null
    contact_email: string | null
    contact_phone: string | null
    address: string | null
    total_users: number | null
    active_users: number | null
    mrr: Decimal | null
    subscription_start: Date | null
    next_billing: Date | null
    health_score: number | null
    rep_id: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: AccountsCountAggregateOutputType | null
    _avg: AccountsAvgAggregateOutputType | null
    _sum: AccountsSumAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  type GetAccountsGroupByPayload<T extends accountsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountsGroupByOutputType[P]>
            : GetScalarType<T[P], AccountsGroupByOutputType[P]>
        }
      >
    >


  export type accountsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    industry?: boolean
    website?: boolean
    contact_name?: boolean
    contact_email?: boolean
    contact_phone?: boolean
    address?: boolean
    total_users?: boolean
    active_users?: boolean
    mrr?: boolean
    subscription_start?: boolean
    next_billing?: boolean
    health_score?: boolean
    rep_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    account_activity?: boolean | accounts$account_activityArgs<ExtArgs>
    groups?: boolean | accounts$groupsArgs<ExtArgs>
    product_usage?: boolean | accounts$product_usageArgs<ExtArgs>
    subscriptions?: boolean | accounts$subscriptionsArgs<ExtArgs>
    top_pages?: boolean | accounts$top_pagesArgs<ExtArgs>
    user_accounts?: boolean | accounts$user_accountsArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accounts"]>

  export type accountsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    industry?: boolean
    website?: boolean
    contact_name?: boolean
    contact_email?: boolean
    contact_phone?: boolean
    address?: boolean
    total_users?: boolean
    active_users?: boolean
    mrr?: boolean
    subscription_start?: boolean
    next_billing?: boolean
    health_score?: boolean
    rep_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["accounts"]>

  export type accountsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    industry?: boolean
    website?: boolean
    contact_name?: boolean
    contact_email?: boolean
    contact_phone?: boolean
    address?: boolean
    total_users?: boolean
    active_users?: boolean
    mrr?: boolean
    subscription_start?: boolean
    next_billing?: boolean
    health_score?: boolean
    rep_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["accounts"]>

  export type accountsSelectScalar = {
    id?: boolean
    external_id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    industry?: boolean
    website?: boolean
    contact_name?: boolean
    contact_email?: boolean
    contact_phone?: boolean
    address?: boolean
    total_users?: boolean
    active_users?: boolean
    mrr?: boolean
    subscription_start?: boolean
    next_billing?: boolean
    health_score?: boolean
    rep_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type accountsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "external_id" | "name" | "type" | "status" | "industry" | "website" | "contact_name" | "contact_email" | "contact_phone" | "address" | "total_users" | "active_users" | "mrr" | "subscription_start" | "next_billing" | "health_score" | "rep_id" | "created_at" | "updated_at", ExtArgs["result"]["accounts"]>
  export type accountsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account_activity?: boolean | accounts$account_activityArgs<ExtArgs>
    groups?: boolean | accounts$groupsArgs<ExtArgs>
    product_usage?: boolean | accounts$product_usageArgs<ExtArgs>
    subscriptions?: boolean | accounts$subscriptionsArgs<ExtArgs>
    top_pages?: boolean | accounts$top_pagesArgs<ExtArgs>
    user_accounts?: boolean | accounts$user_accountsArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type accountsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type accountsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $accountsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "accounts"
    objects: {
      account_activity: Prisma.$account_activityPayload<ExtArgs>[]
      groups: Prisma.$groupsPayload<ExtArgs>[]
      product_usage: Prisma.$product_usagePayload<ExtArgs>[]
      subscriptions: Prisma.$subscriptionsPayload<ExtArgs>[]
      top_pages: Prisma.$top_pagesPayload<ExtArgs>[]
      user_accounts: Prisma.$user_accountsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      external_id: string
      name: string
      type: string | null
      status: string
      industry: string | null
      website: string | null
      contact_name: string | null
      contact_email: string | null
      contact_phone: string | null
      address: string | null
      total_users: number | null
      active_users: number | null
      mrr: Prisma.Decimal | null
      subscription_start: Date | null
      next_billing: Date | null
      health_score: number | null
      rep_id: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["accounts"]>
    composites: {}
  }

  type accountsGetPayload<S extends boolean | null | undefined | accountsDefaultArgs> = $Result.GetResult<Prisma.$accountsPayload, S>

  type accountsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<accountsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountsCountAggregateInputType | true
    }

  export interface accountsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['accounts'], meta: { name: 'accounts' } }
    /**
     * Find zero or one Accounts that matches the filter.
     * @param {accountsFindUniqueArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends accountsFindUniqueArgs>(args: SelectSubset<T, accountsFindUniqueArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Accounts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {accountsFindUniqueOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends accountsFindUniqueOrThrowArgs>(args: SelectSubset<T, accountsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends accountsFindFirstArgs>(args?: SelectSubset<T, accountsFindFirstArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends accountsFindFirstOrThrowArgs>(args?: SelectSubset<T, accountsFindFirstOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.accounts.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.accounts.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountsWithIdOnly = await prisma.accounts.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends accountsFindManyArgs>(args?: SelectSubset<T, accountsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Accounts.
     * @param {accountsCreateArgs} args - Arguments to create a Accounts.
     * @example
     * // Create one Accounts
     * const Accounts = await prisma.accounts.create({
     *   data: {
     *     // ... data to create a Accounts
     *   }
     * })
     * 
     */
    create<T extends accountsCreateArgs>(args: SelectSubset<T, accountsCreateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {accountsCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const accounts = await prisma.accounts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends accountsCreateManyArgs>(args?: SelectSubset<T, accountsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {accountsCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const accounts = await prisma.accounts.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountsWithIdOnly = await prisma.accounts.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends accountsCreateManyAndReturnArgs>(args?: SelectSubset<T, accountsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Accounts.
     * @param {accountsDeleteArgs} args - Arguments to delete one Accounts.
     * @example
     * // Delete one Accounts
     * const Accounts = await prisma.accounts.delete({
     *   where: {
     *     // ... filter to delete one Accounts
     *   }
     * })
     * 
     */
    delete<T extends accountsDeleteArgs>(args: SelectSubset<T, accountsDeleteArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Accounts.
     * @param {accountsUpdateArgs} args - Arguments to update one Accounts.
     * @example
     * // Update one Accounts
     * const accounts = await prisma.accounts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends accountsUpdateArgs>(args: SelectSubset<T, accountsUpdateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {accountsDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.accounts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends accountsDeleteManyArgs>(args?: SelectSubset<T, accountsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const accounts = await prisma.accounts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends accountsUpdateManyArgs>(args: SelectSubset<T, accountsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {accountsUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const accounts = await prisma.accounts.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountsWithIdOnly = await prisma.accounts.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends accountsUpdateManyAndReturnArgs>(args: SelectSubset<T, accountsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Accounts.
     * @param {accountsUpsertArgs} args - Arguments to update or create a Accounts.
     * @example
     * // Update or create a Accounts
     * const accounts = await prisma.accounts.upsert({
     *   create: {
     *     // ... data to create a Accounts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Accounts we want to update
     *   }
     * })
     */
    upsert<T extends accountsUpsertArgs>(args: SelectSubset<T, accountsUpsertArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.accounts.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends accountsCountArgs>(
      args?: Subset<T, accountsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountsAggregateArgs>(args: Subset<T, AccountsAggregateArgs>): Prisma.PrismaPromise<GetAccountsAggregateType<T>>

    /**
     * Group by Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends accountsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: accountsGroupByArgs['orderBy'] }
        : { orderBy?: accountsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, accountsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the accounts model
   */
  readonly fields: accountsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for accounts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__accountsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account_activity<T extends accounts$account_activityArgs<ExtArgs> = {}>(args?: Subset<T, accounts$account_activityArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$account_activityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    groups<T extends accounts$groupsArgs<ExtArgs> = {}>(args?: Subset<T, accounts$groupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    product_usage<T extends accounts$product_usageArgs<ExtArgs> = {}>(args?: Subset<T, accounts$product_usageArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscriptions<T extends accounts$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, accounts$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    top_pages<T extends accounts$top_pagesArgs<ExtArgs> = {}>(args?: Subset<T, accounts$top_pagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_accounts<T extends accounts$user_accountsArgs<ExtArgs> = {}>(args?: Subset<T, accounts$user_accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the accounts model
   */
  interface accountsFieldRefs {
    readonly id: FieldRef<"accounts", 'Int'>
    readonly external_id: FieldRef<"accounts", 'String'>
    readonly name: FieldRef<"accounts", 'String'>
    readonly type: FieldRef<"accounts", 'String'>
    readonly status: FieldRef<"accounts", 'String'>
    readonly industry: FieldRef<"accounts", 'String'>
    readonly website: FieldRef<"accounts", 'String'>
    readonly contact_name: FieldRef<"accounts", 'String'>
    readonly contact_email: FieldRef<"accounts", 'String'>
    readonly contact_phone: FieldRef<"accounts", 'String'>
    readonly address: FieldRef<"accounts", 'String'>
    readonly total_users: FieldRef<"accounts", 'Int'>
    readonly active_users: FieldRef<"accounts", 'Int'>
    readonly mrr: FieldRef<"accounts", 'Decimal'>
    readonly subscription_start: FieldRef<"accounts", 'DateTime'>
    readonly next_billing: FieldRef<"accounts", 'DateTime'>
    readonly health_score: FieldRef<"accounts", 'Int'>
    readonly rep_id: FieldRef<"accounts", 'String'>
    readonly created_at: FieldRef<"accounts", 'DateTime'>
    readonly updated_at: FieldRef<"accounts", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * accounts findUnique
   */
  export type accountsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findUniqueOrThrow
   */
  export type accountsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findFirst
   */
  export type accountsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findFirstOrThrow
   */
  export type accountsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findMany
   */
  export type accountsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts create
   */
  export type accountsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to create a accounts.
     */
    data: XOR<accountsCreateInput, accountsUncheckedCreateInput>
  }

  /**
   * accounts createMany
   */
  export type accountsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many accounts.
     */
    data: accountsCreateManyInput | accountsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * accounts createManyAndReturn
   */
  export type accountsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * The data used to create many accounts.
     */
    data: accountsCreateManyInput | accountsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * accounts update
   */
  export type accountsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to update a accounts.
     */
    data: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
    /**
     * Choose, which accounts to update.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts updateMany
   */
  export type accountsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update accounts.
     */
    data: XOR<accountsUpdateManyMutationInput, accountsUncheckedUpdateManyInput>
    /**
     * Filter which accounts to update
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to update.
     */
    limit?: number
  }

  /**
   * accounts updateManyAndReturn
   */
  export type accountsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * The data used to update accounts.
     */
    data: XOR<accountsUpdateManyMutationInput, accountsUncheckedUpdateManyInput>
    /**
     * Filter which accounts to update
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to update.
     */
    limit?: number
  }

  /**
   * accounts upsert
   */
  export type accountsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The filter to search for the accounts to update in case it exists.
     */
    where: accountsWhereUniqueInput
    /**
     * In case the accounts found by the `where` argument doesn't exist, create a new accounts with this data.
     */
    create: XOR<accountsCreateInput, accountsUncheckedCreateInput>
    /**
     * In case the accounts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
  }

  /**
   * accounts delete
   */
  export type accountsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter which accounts to delete.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts deleteMany
   */
  export type accountsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to delete
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to delete.
     */
    limit?: number
  }

  /**
   * accounts.account_activity
   */
  export type accounts$account_activityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account_activity
     */
    select?: account_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the account_activity
     */
    omit?: account_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: account_activityInclude<ExtArgs> | null
    where?: account_activityWhereInput
    orderBy?: account_activityOrderByWithRelationInput | account_activityOrderByWithRelationInput[]
    cursor?: account_activityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Account_activityScalarFieldEnum | Account_activityScalarFieldEnum[]
  }

  /**
   * accounts.groups
   */
  export type accounts$groupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    where?: groupsWhereInput
    orderBy?: groupsOrderByWithRelationInput | groupsOrderByWithRelationInput[]
    cursor?: groupsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GroupsScalarFieldEnum | GroupsScalarFieldEnum[]
  }

  /**
   * accounts.product_usage
   */
  export type accounts$product_usageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    where?: product_usageWhereInput
    orderBy?: product_usageOrderByWithRelationInput | product_usageOrderByWithRelationInput[]
    cursor?: product_usageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Product_usageScalarFieldEnum | Product_usageScalarFieldEnum[]
  }

  /**
   * accounts.subscriptions
   */
  export type accounts$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    where?: subscriptionsWhereInput
    orderBy?: subscriptionsOrderByWithRelationInput | subscriptionsOrderByWithRelationInput[]
    cursor?: subscriptionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * accounts.top_pages
   */
  export type accounts$top_pagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    where?: top_pagesWhereInput
    orderBy?: top_pagesOrderByWithRelationInput | top_pagesOrderByWithRelationInput[]
    cursor?: top_pagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Top_pagesScalarFieldEnum | Top_pagesScalarFieldEnum[]
  }

  /**
   * accounts.user_accounts
   */
  export type accounts$user_accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    where?: user_accountsWhereInput
    orderBy?: user_accountsOrderByWithRelationInput | user_accountsOrderByWithRelationInput[]
    cursor?: user_accountsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_accountsScalarFieldEnum | User_accountsScalarFieldEnum[]
  }

  /**
   * accounts without action
   */
  export type accountsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
  }


  /**
   * Model attribute_definitions
   */

  export type AggregateAttribute_definitions = {
    _count: Attribute_definitionsCountAggregateOutputType | null
    _min: Attribute_definitionsMinAggregateOutputType | null
    _max: Attribute_definitionsMaxAggregateOutputType | null
  }

  export type Attribute_definitionsMinAggregateOutputType = {
    slug: string | null
    label: string | null
    input_type: string | null
    required: boolean | null
  }

  export type Attribute_definitionsMaxAggregateOutputType = {
    slug: string | null
    label: string | null
    input_type: string | null
    required: boolean | null
  }

  export type Attribute_definitionsCountAggregateOutputType = {
    slug: number
    label: number
    input_type: number
    required: number
    select_options: number
    _all: number
  }


  export type Attribute_definitionsMinAggregateInputType = {
    slug?: true
    label?: true
    input_type?: true
    required?: true
  }

  export type Attribute_definitionsMaxAggregateInputType = {
    slug?: true
    label?: true
    input_type?: true
    required?: true
  }

  export type Attribute_definitionsCountAggregateInputType = {
    slug?: true
    label?: true
    input_type?: true
    required?: true
    select_options?: true
    _all?: true
  }

  export type Attribute_definitionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which attribute_definitions to aggregate.
     */
    where?: attribute_definitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribute_definitions to fetch.
     */
    orderBy?: attribute_definitionsOrderByWithRelationInput | attribute_definitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: attribute_definitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribute_definitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribute_definitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned attribute_definitions
    **/
    _count?: true | Attribute_definitionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Attribute_definitionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Attribute_definitionsMaxAggregateInputType
  }

  export type GetAttribute_definitionsAggregateType<T extends Attribute_definitionsAggregateArgs> = {
        [P in keyof T & keyof AggregateAttribute_definitions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttribute_definitions[P]>
      : GetScalarType<T[P], AggregateAttribute_definitions[P]>
  }




  export type attribute_definitionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: attribute_definitionsWhereInput
    orderBy?: attribute_definitionsOrderByWithAggregationInput | attribute_definitionsOrderByWithAggregationInput[]
    by: Attribute_definitionsScalarFieldEnum[] | Attribute_definitionsScalarFieldEnum
    having?: attribute_definitionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Attribute_definitionsCountAggregateInputType | true
    _min?: Attribute_definitionsMinAggregateInputType
    _max?: Attribute_definitionsMaxAggregateInputType
  }

  export type Attribute_definitionsGroupByOutputType = {
    slug: string
    label: string | null
    input_type: string | null
    required: boolean | null
    select_options: JsonValue | null
    _count: Attribute_definitionsCountAggregateOutputType | null
    _min: Attribute_definitionsMinAggregateOutputType | null
    _max: Attribute_definitionsMaxAggregateOutputType | null
  }

  type GetAttribute_definitionsGroupByPayload<T extends attribute_definitionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Attribute_definitionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Attribute_definitionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Attribute_definitionsGroupByOutputType[P]>
            : GetScalarType<T[P], Attribute_definitionsGroupByOutputType[P]>
        }
      >
    >


  export type attribute_definitionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    label?: boolean
    input_type?: boolean
    required?: boolean
    select_options?: boolean
  }, ExtArgs["result"]["attribute_definitions"]>

  export type attribute_definitionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    label?: boolean
    input_type?: boolean
    required?: boolean
    select_options?: boolean
  }, ExtArgs["result"]["attribute_definitions"]>

  export type attribute_definitionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    label?: boolean
    input_type?: boolean
    required?: boolean
    select_options?: boolean
  }, ExtArgs["result"]["attribute_definitions"]>

  export type attribute_definitionsSelectScalar = {
    slug?: boolean
    label?: boolean
    input_type?: boolean
    required?: boolean
    select_options?: boolean
  }

  export type attribute_definitionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"slug" | "label" | "input_type" | "required" | "select_options", ExtArgs["result"]["attribute_definitions"]>

  export type $attribute_definitionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "attribute_definitions"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      slug: string
      label: string | null
      input_type: string | null
      required: boolean | null
      select_options: Prisma.JsonValue | null
    }, ExtArgs["result"]["attribute_definitions"]>
    composites: {}
  }

  type attribute_definitionsGetPayload<S extends boolean | null | undefined | attribute_definitionsDefaultArgs> = $Result.GetResult<Prisma.$attribute_definitionsPayload, S>

  type attribute_definitionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<attribute_definitionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Attribute_definitionsCountAggregateInputType | true
    }

  export interface attribute_definitionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['attribute_definitions'], meta: { name: 'attribute_definitions' } }
    /**
     * Find zero or one Attribute_definitions that matches the filter.
     * @param {attribute_definitionsFindUniqueArgs} args - Arguments to find a Attribute_definitions
     * @example
     * // Get one Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends attribute_definitionsFindUniqueArgs>(args: SelectSubset<T, attribute_definitionsFindUniqueArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Attribute_definitions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {attribute_definitionsFindUniqueOrThrowArgs} args - Arguments to find a Attribute_definitions
     * @example
     * // Get one Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends attribute_definitionsFindUniqueOrThrowArgs>(args: SelectSubset<T, attribute_definitionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Attribute_definitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribute_definitionsFindFirstArgs} args - Arguments to find a Attribute_definitions
     * @example
     * // Get one Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends attribute_definitionsFindFirstArgs>(args?: SelectSubset<T, attribute_definitionsFindFirstArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Attribute_definitions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribute_definitionsFindFirstOrThrowArgs} args - Arguments to find a Attribute_definitions
     * @example
     * // Get one Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends attribute_definitionsFindFirstOrThrowArgs>(args?: SelectSubset<T, attribute_definitionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Attribute_definitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribute_definitionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.findMany()
     * 
     * // Get first 10 Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.findMany({ take: 10 })
     * 
     * // Only select the `slug`
     * const attribute_definitionsWithSlugOnly = await prisma.attribute_definitions.findMany({ select: { slug: true } })
     * 
     */
    findMany<T extends attribute_definitionsFindManyArgs>(args?: SelectSubset<T, attribute_definitionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Attribute_definitions.
     * @param {attribute_definitionsCreateArgs} args - Arguments to create a Attribute_definitions.
     * @example
     * // Create one Attribute_definitions
     * const Attribute_definitions = await prisma.attribute_definitions.create({
     *   data: {
     *     // ... data to create a Attribute_definitions
     *   }
     * })
     * 
     */
    create<T extends attribute_definitionsCreateArgs>(args: SelectSubset<T, attribute_definitionsCreateArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Attribute_definitions.
     * @param {attribute_definitionsCreateManyArgs} args - Arguments to create many Attribute_definitions.
     * @example
     * // Create many Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends attribute_definitionsCreateManyArgs>(args?: SelectSubset<T, attribute_definitionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Attribute_definitions and returns the data saved in the database.
     * @param {attribute_definitionsCreateManyAndReturnArgs} args - Arguments to create many Attribute_definitions.
     * @example
     * // Create many Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Attribute_definitions and only return the `slug`
     * const attribute_definitionsWithSlugOnly = await prisma.attribute_definitions.createManyAndReturn({
     *   select: { slug: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends attribute_definitionsCreateManyAndReturnArgs>(args?: SelectSubset<T, attribute_definitionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Attribute_definitions.
     * @param {attribute_definitionsDeleteArgs} args - Arguments to delete one Attribute_definitions.
     * @example
     * // Delete one Attribute_definitions
     * const Attribute_definitions = await prisma.attribute_definitions.delete({
     *   where: {
     *     // ... filter to delete one Attribute_definitions
     *   }
     * })
     * 
     */
    delete<T extends attribute_definitionsDeleteArgs>(args: SelectSubset<T, attribute_definitionsDeleteArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Attribute_definitions.
     * @param {attribute_definitionsUpdateArgs} args - Arguments to update one Attribute_definitions.
     * @example
     * // Update one Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends attribute_definitionsUpdateArgs>(args: SelectSubset<T, attribute_definitionsUpdateArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Attribute_definitions.
     * @param {attribute_definitionsDeleteManyArgs} args - Arguments to filter Attribute_definitions to delete.
     * @example
     * // Delete a few Attribute_definitions
     * const { count } = await prisma.attribute_definitions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends attribute_definitionsDeleteManyArgs>(args?: SelectSubset<T, attribute_definitionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attribute_definitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribute_definitionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends attribute_definitionsUpdateManyArgs>(args: SelectSubset<T, attribute_definitionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attribute_definitions and returns the data updated in the database.
     * @param {attribute_definitionsUpdateManyAndReturnArgs} args - Arguments to update many Attribute_definitions.
     * @example
     * // Update many Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Attribute_definitions and only return the `slug`
     * const attribute_definitionsWithSlugOnly = await prisma.attribute_definitions.updateManyAndReturn({
     *   select: { slug: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends attribute_definitionsUpdateManyAndReturnArgs>(args: SelectSubset<T, attribute_definitionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Attribute_definitions.
     * @param {attribute_definitionsUpsertArgs} args - Arguments to update or create a Attribute_definitions.
     * @example
     * // Update or create a Attribute_definitions
     * const attribute_definitions = await prisma.attribute_definitions.upsert({
     *   create: {
     *     // ... data to create a Attribute_definitions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attribute_definitions we want to update
     *   }
     * })
     */
    upsert<T extends attribute_definitionsUpsertArgs>(args: SelectSubset<T, attribute_definitionsUpsertArgs<ExtArgs>>): Prisma__attribute_definitionsClient<$Result.GetResult<Prisma.$attribute_definitionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Attribute_definitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribute_definitionsCountArgs} args - Arguments to filter Attribute_definitions to count.
     * @example
     * // Count the number of Attribute_definitions
     * const count = await prisma.attribute_definitions.count({
     *   where: {
     *     // ... the filter for the Attribute_definitions we want to count
     *   }
     * })
    **/
    count<T extends attribute_definitionsCountArgs>(
      args?: Subset<T, attribute_definitionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Attribute_definitionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attribute_definitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Attribute_definitionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Attribute_definitionsAggregateArgs>(args: Subset<T, Attribute_definitionsAggregateArgs>): Prisma.PrismaPromise<GetAttribute_definitionsAggregateType<T>>

    /**
     * Group by Attribute_definitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribute_definitionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends attribute_definitionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: attribute_definitionsGroupByArgs['orderBy'] }
        : { orderBy?: attribute_definitionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, attribute_definitionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttribute_definitionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the attribute_definitions model
   */
  readonly fields: attribute_definitionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for attribute_definitions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__attribute_definitionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the attribute_definitions model
   */
  interface attribute_definitionsFieldRefs {
    readonly slug: FieldRef<"attribute_definitions", 'String'>
    readonly label: FieldRef<"attribute_definitions", 'String'>
    readonly input_type: FieldRef<"attribute_definitions", 'String'>
    readonly required: FieldRef<"attribute_definitions", 'Boolean'>
    readonly select_options: FieldRef<"attribute_definitions", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * attribute_definitions findUnique
   */
  export type attribute_definitionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * Filter, which attribute_definitions to fetch.
     */
    where: attribute_definitionsWhereUniqueInput
  }

  /**
   * attribute_definitions findUniqueOrThrow
   */
  export type attribute_definitionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * Filter, which attribute_definitions to fetch.
     */
    where: attribute_definitionsWhereUniqueInput
  }

  /**
   * attribute_definitions findFirst
   */
  export type attribute_definitionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * Filter, which attribute_definitions to fetch.
     */
    where?: attribute_definitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribute_definitions to fetch.
     */
    orderBy?: attribute_definitionsOrderByWithRelationInput | attribute_definitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for attribute_definitions.
     */
    cursor?: attribute_definitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribute_definitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribute_definitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of attribute_definitions.
     */
    distinct?: Attribute_definitionsScalarFieldEnum | Attribute_definitionsScalarFieldEnum[]
  }

  /**
   * attribute_definitions findFirstOrThrow
   */
  export type attribute_definitionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * Filter, which attribute_definitions to fetch.
     */
    where?: attribute_definitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribute_definitions to fetch.
     */
    orderBy?: attribute_definitionsOrderByWithRelationInput | attribute_definitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for attribute_definitions.
     */
    cursor?: attribute_definitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribute_definitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribute_definitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of attribute_definitions.
     */
    distinct?: Attribute_definitionsScalarFieldEnum | Attribute_definitionsScalarFieldEnum[]
  }

  /**
   * attribute_definitions findMany
   */
  export type attribute_definitionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * Filter, which attribute_definitions to fetch.
     */
    where?: attribute_definitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribute_definitions to fetch.
     */
    orderBy?: attribute_definitionsOrderByWithRelationInput | attribute_definitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing attribute_definitions.
     */
    cursor?: attribute_definitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribute_definitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribute_definitions.
     */
    skip?: number
    distinct?: Attribute_definitionsScalarFieldEnum | Attribute_definitionsScalarFieldEnum[]
  }

  /**
   * attribute_definitions create
   */
  export type attribute_definitionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * The data needed to create a attribute_definitions.
     */
    data: XOR<attribute_definitionsCreateInput, attribute_definitionsUncheckedCreateInput>
  }

  /**
   * attribute_definitions createMany
   */
  export type attribute_definitionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many attribute_definitions.
     */
    data: attribute_definitionsCreateManyInput | attribute_definitionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * attribute_definitions createManyAndReturn
   */
  export type attribute_definitionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * The data used to create many attribute_definitions.
     */
    data: attribute_definitionsCreateManyInput | attribute_definitionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * attribute_definitions update
   */
  export type attribute_definitionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * The data needed to update a attribute_definitions.
     */
    data: XOR<attribute_definitionsUpdateInput, attribute_definitionsUncheckedUpdateInput>
    /**
     * Choose, which attribute_definitions to update.
     */
    where: attribute_definitionsWhereUniqueInput
  }

  /**
   * attribute_definitions updateMany
   */
  export type attribute_definitionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update attribute_definitions.
     */
    data: XOR<attribute_definitionsUpdateManyMutationInput, attribute_definitionsUncheckedUpdateManyInput>
    /**
     * Filter which attribute_definitions to update
     */
    where?: attribute_definitionsWhereInput
    /**
     * Limit how many attribute_definitions to update.
     */
    limit?: number
  }

  /**
   * attribute_definitions updateManyAndReturn
   */
  export type attribute_definitionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * The data used to update attribute_definitions.
     */
    data: XOR<attribute_definitionsUpdateManyMutationInput, attribute_definitionsUncheckedUpdateManyInput>
    /**
     * Filter which attribute_definitions to update
     */
    where?: attribute_definitionsWhereInput
    /**
     * Limit how many attribute_definitions to update.
     */
    limit?: number
  }

  /**
   * attribute_definitions upsert
   */
  export type attribute_definitionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * The filter to search for the attribute_definitions to update in case it exists.
     */
    where: attribute_definitionsWhereUniqueInput
    /**
     * In case the attribute_definitions found by the `where` argument doesn't exist, create a new attribute_definitions with this data.
     */
    create: XOR<attribute_definitionsCreateInput, attribute_definitionsUncheckedCreateInput>
    /**
     * In case the attribute_definitions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<attribute_definitionsUpdateInput, attribute_definitionsUncheckedUpdateInput>
  }

  /**
   * attribute_definitions delete
   */
  export type attribute_definitionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
    /**
     * Filter which attribute_definitions to delete.
     */
    where: attribute_definitionsWhereUniqueInput
  }

  /**
   * attribute_definitions deleteMany
   */
  export type attribute_definitionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which attribute_definitions to delete
     */
    where?: attribute_definitionsWhereInput
    /**
     * Limit how many attribute_definitions to delete.
     */
    limit?: number
  }

  /**
   * attribute_definitions without action
   */
  export type attribute_definitionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribute_definitions
     */
    select?: attribute_definitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribute_definitions
     */
    omit?: attribute_definitionsOmit<ExtArgs> | null
  }


  /**
   * Model groups
   */

  export type AggregateGroups = {
    _count: GroupsCountAggregateOutputType | null
    _avg: GroupsAvgAggregateOutputType | null
    _sum: GroupsSumAggregateOutputType | null
    _min: GroupsMinAggregateOutputType | null
    _max: GroupsMaxAggregateOutputType | null
  }

  export type GroupsAvgAggregateOutputType = {
    user_count: number | null
    account_id: number | null
  }

  export type GroupsSumAggregateOutputType = {
    user_count: number | null
    account_id: number | null
  }

  export type GroupsMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    color: string | null
    icon: string | null
    default_template: string | null
    created_at: Date | null
    updated_at: Date | null
    user_count: number | null
    account_id: number | null
    account_id_new: string | null
  }

  export type GroupsMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    color: string | null
    icon: string | null
    default_template: string | null
    created_at: Date | null
    updated_at: Date | null
    user_count: number | null
    account_id: number | null
    account_id_new: string | null
  }

  export type GroupsCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    color: number
    icon: number
    default_template: number
    product_grant_ids: number
    demographics: number
    created_at: number
    updated_at: number
    user_count: number
    account_id: number
    account_id_new: number
    _all: number
  }


  export type GroupsAvgAggregateInputType = {
    user_count?: true
    account_id?: true
  }

  export type GroupsSumAggregateInputType = {
    user_count?: true
    account_id?: true
  }

  export type GroupsMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    color?: true
    icon?: true
    default_template?: true
    created_at?: true
    updated_at?: true
    user_count?: true
    account_id?: true
    account_id_new?: true
  }

  export type GroupsMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    color?: true
    icon?: true
    default_template?: true
    created_at?: true
    updated_at?: true
    user_count?: true
    account_id?: true
    account_id_new?: true
  }

  export type GroupsCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    color?: true
    icon?: true
    default_template?: true
    product_grant_ids?: true
    demographics?: true
    created_at?: true
    updated_at?: true
    user_count?: true
    account_id?: true
    account_id_new?: true
    _all?: true
  }

  export type GroupsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which groups to aggregate.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: groupsOrderByWithRelationInput | groupsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned groups
    **/
    _count?: true | GroupsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GroupsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GroupsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupsMaxAggregateInputType
  }

  export type GetGroupsAggregateType<T extends GroupsAggregateArgs> = {
        [P in keyof T & keyof AggregateGroups]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroups[P]>
      : GetScalarType<T[P], AggregateGroups[P]>
  }




  export type groupsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: groupsWhereInput
    orderBy?: groupsOrderByWithAggregationInput | groupsOrderByWithAggregationInput[]
    by: GroupsScalarFieldEnum[] | GroupsScalarFieldEnum
    having?: groupsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupsCountAggregateInputType | true
    _avg?: GroupsAvgAggregateInputType
    _sum?: GroupsSumAggregateInputType
    _min?: GroupsMinAggregateInputType
    _max?: GroupsMaxAggregateInputType
  }

  export type GroupsGroupByOutputType = {
    id: string
    slug: string
    name: string
    color: string | null
    icon: string | null
    default_template: string | null
    product_grant_ids: string[]
    demographics: JsonValue
    created_at: Date
    updated_at: Date
    user_count: number
    account_id: number
    account_id_new: string | null
    _count: GroupsCountAggregateOutputType | null
    _avg: GroupsAvgAggregateOutputType | null
    _sum: GroupsSumAggregateOutputType | null
    _min: GroupsMinAggregateOutputType | null
    _max: GroupsMaxAggregateOutputType | null
  }

  type GetGroupsGroupByPayload<T extends groupsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupsGroupByOutputType[P]>
            : GetScalarType<T[P], GroupsGroupByOutputType[P]>
        }
      >
    >


  export type groupsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    color?: boolean
    icon?: boolean
    default_template?: boolean
    product_grant_ids?: boolean
    demographics?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_count?: boolean
    account_id?: boolean
    account_id_new?: boolean
    accounts?: boolean | groups$accountsArgs<ExtArgs>
    users?: boolean | groups$usersArgs<ExtArgs>
    _count?: boolean | GroupsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groups"]>

  export type groupsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    color?: boolean
    icon?: boolean
    default_template?: boolean
    product_grant_ids?: boolean
    demographics?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_count?: boolean
    account_id?: boolean
    account_id_new?: boolean
    accounts?: boolean | groups$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["groups"]>

  export type groupsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    color?: boolean
    icon?: boolean
    default_template?: boolean
    product_grant_ids?: boolean
    demographics?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_count?: boolean
    account_id?: boolean
    account_id_new?: boolean
    accounts?: boolean | groups$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["groups"]>

  export type groupsSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    color?: boolean
    icon?: boolean
    default_template?: boolean
    product_grant_ids?: boolean
    demographics?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_count?: boolean
    account_id?: boolean
    account_id_new?: boolean
  }

  export type groupsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "name" | "color" | "icon" | "default_template" | "product_grant_ids" | "demographics" | "created_at" | "updated_at" | "user_count" | "account_id" | "account_id_new", ExtArgs["result"]["groups"]>
  export type groupsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | groups$accountsArgs<ExtArgs>
    users?: boolean | groups$usersArgs<ExtArgs>
    _count?: boolean | GroupsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type groupsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | groups$accountsArgs<ExtArgs>
  }
  export type groupsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | groups$accountsArgs<ExtArgs>
  }

  export type $groupsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "groups"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs> | null
      users: Prisma.$usersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      color: string | null
      icon: string | null
      default_template: string | null
      product_grant_ids: string[]
      demographics: Prisma.JsonValue
      created_at: Date
      updated_at: Date
      user_count: number
      account_id: number
      account_id_new: string | null
    }, ExtArgs["result"]["groups"]>
    composites: {}
  }

  type groupsGetPayload<S extends boolean | null | undefined | groupsDefaultArgs> = $Result.GetResult<Prisma.$groupsPayload, S>

  type groupsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<groupsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroupsCountAggregateInputType | true
    }

  export interface groupsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['groups'], meta: { name: 'groups' } }
    /**
     * Find zero or one Groups that matches the filter.
     * @param {groupsFindUniqueArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends groupsFindUniqueArgs>(args: SelectSubset<T, groupsFindUniqueArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Groups that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {groupsFindUniqueOrThrowArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends groupsFindUniqueOrThrowArgs>(args: SelectSubset<T, groupsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Groups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsFindFirstArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends groupsFindFirstArgs>(args?: SelectSubset<T, groupsFindFirstArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Groups that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsFindFirstOrThrowArgs} args - Arguments to find a Groups
     * @example
     * // Get one Groups
     * const groups = await prisma.groups.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends groupsFindFirstOrThrowArgs>(args?: SelectSubset<T, groupsFindFirstOrThrowArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Groups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Groups
     * const groups = await prisma.groups.findMany()
     * 
     * // Get first 10 Groups
     * const groups = await prisma.groups.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupsWithIdOnly = await prisma.groups.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends groupsFindManyArgs>(args?: SelectSubset<T, groupsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Groups.
     * @param {groupsCreateArgs} args - Arguments to create a Groups.
     * @example
     * // Create one Groups
     * const Groups = await prisma.groups.create({
     *   data: {
     *     // ... data to create a Groups
     *   }
     * })
     * 
     */
    create<T extends groupsCreateArgs>(args: SelectSubset<T, groupsCreateArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Groups.
     * @param {groupsCreateManyArgs} args - Arguments to create many Groups.
     * @example
     * // Create many Groups
     * const groups = await prisma.groups.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends groupsCreateManyArgs>(args?: SelectSubset<T, groupsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Groups and returns the data saved in the database.
     * @param {groupsCreateManyAndReturnArgs} args - Arguments to create many Groups.
     * @example
     * // Create many Groups
     * const groups = await prisma.groups.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Groups and only return the `id`
     * const groupsWithIdOnly = await prisma.groups.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends groupsCreateManyAndReturnArgs>(args?: SelectSubset<T, groupsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Groups.
     * @param {groupsDeleteArgs} args - Arguments to delete one Groups.
     * @example
     * // Delete one Groups
     * const Groups = await prisma.groups.delete({
     *   where: {
     *     // ... filter to delete one Groups
     *   }
     * })
     * 
     */
    delete<T extends groupsDeleteArgs>(args: SelectSubset<T, groupsDeleteArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Groups.
     * @param {groupsUpdateArgs} args - Arguments to update one Groups.
     * @example
     * // Update one Groups
     * const groups = await prisma.groups.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends groupsUpdateArgs>(args: SelectSubset<T, groupsUpdateArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Groups.
     * @param {groupsDeleteManyArgs} args - Arguments to filter Groups to delete.
     * @example
     * // Delete a few Groups
     * const { count } = await prisma.groups.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends groupsDeleteManyArgs>(args?: SelectSubset<T, groupsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Groups
     * const groups = await prisma.groups.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends groupsUpdateManyArgs>(args: SelectSubset<T, groupsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Groups and returns the data updated in the database.
     * @param {groupsUpdateManyAndReturnArgs} args - Arguments to update many Groups.
     * @example
     * // Update many Groups
     * const groups = await prisma.groups.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Groups and only return the `id`
     * const groupsWithIdOnly = await prisma.groups.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends groupsUpdateManyAndReturnArgs>(args: SelectSubset<T, groupsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Groups.
     * @param {groupsUpsertArgs} args - Arguments to update or create a Groups.
     * @example
     * // Update or create a Groups
     * const groups = await prisma.groups.upsert({
     *   create: {
     *     // ... data to create a Groups
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Groups we want to update
     *   }
     * })
     */
    upsert<T extends groupsUpsertArgs>(args: SelectSubset<T, groupsUpsertArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsCountArgs} args - Arguments to filter Groups to count.
     * @example
     * // Count the number of Groups
     * const count = await prisma.groups.count({
     *   where: {
     *     // ... the filter for the Groups we want to count
     *   }
     * })
    **/
    count<T extends groupsCountArgs>(
      args?: Subset<T, groupsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GroupsAggregateArgs>(args: Subset<T, GroupsAggregateArgs>): Prisma.PrismaPromise<GetGroupsAggregateType<T>>

    /**
     * Group by Groups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {groupsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends groupsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: groupsGroupByArgs['orderBy'] }
        : { orderBy?: groupsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, groupsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the groups model
   */
  readonly fields: groupsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for groups.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__groupsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends groups$accountsArgs<ExtArgs> = {}>(args?: Subset<T, groups$accountsArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    users<T extends groups$usersArgs<ExtArgs> = {}>(args?: Subset<T, groups$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the groups model
   */
  interface groupsFieldRefs {
    readonly id: FieldRef<"groups", 'String'>
    readonly slug: FieldRef<"groups", 'String'>
    readonly name: FieldRef<"groups", 'String'>
    readonly color: FieldRef<"groups", 'String'>
    readonly icon: FieldRef<"groups", 'String'>
    readonly default_template: FieldRef<"groups", 'String'>
    readonly product_grant_ids: FieldRef<"groups", 'String[]'>
    readonly demographics: FieldRef<"groups", 'Json'>
    readonly created_at: FieldRef<"groups", 'DateTime'>
    readonly updated_at: FieldRef<"groups", 'DateTime'>
    readonly user_count: FieldRef<"groups", 'Int'>
    readonly account_id: FieldRef<"groups", 'Int'>
    readonly account_id_new: FieldRef<"groups", 'String'>
  }
    

  // Custom InputTypes
  /**
   * groups findUnique
   */
  export type groupsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * Filter, which groups to fetch.
     */
    where: groupsWhereUniqueInput
  }

  /**
   * groups findUniqueOrThrow
   */
  export type groupsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * Filter, which groups to fetch.
     */
    where: groupsWhereUniqueInput
  }

  /**
   * groups findFirst
   */
  export type groupsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * Filter, which groups to fetch.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: groupsOrderByWithRelationInput | groupsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for groups.
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of groups.
     */
    distinct?: GroupsScalarFieldEnum | GroupsScalarFieldEnum[]
  }

  /**
   * groups findFirstOrThrow
   */
  export type groupsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * Filter, which groups to fetch.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: groupsOrderByWithRelationInput | groupsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for groups.
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of groups.
     */
    distinct?: GroupsScalarFieldEnum | GroupsScalarFieldEnum[]
  }

  /**
   * groups findMany
   */
  export type groupsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * Filter, which groups to fetch.
     */
    where?: groupsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of groups to fetch.
     */
    orderBy?: groupsOrderByWithRelationInput | groupsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing groups.
     */
    cursor?: groupsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` groups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` groups.
     */
    skip?: number
    distinct?: GroupsScalarFieldEnum | GroupsScalarFieldEnum[]
  }

  /**
   * groups create
   */
  export type groupsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * The data needed to create a groups.
     */
    data: XOR<groupsCreateInput, groupsUncheckedCreateInput>
  }

  /**
   * groups createMany
   */
  export type groupsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many groups.
     */
    data: groupsCreateManyInput | groupsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * groups createManyAndReturn
   */
  export type groupsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * The data used to create many groups.
     */
    data: groupsCreateManyInput | groupsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * groups update
   */
  export type groupsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * The data needed to update a groups.
     */
    data: XOR<groupsUpdateInput, groupsUncheckedUpdateInput>
    /**
     * Choose, which groups to update.
     */
    where: groupsWhereUniqueInput
  }

  /**
   * groups updateMany
   */
  export type groupsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update groups.
     */
    data: XOR<groupsUpdateManyMutationInput, groupsUncheckedUpdateManyInput>
    /**
     * Filter which groups to update
     */
    where?: groupsWhereInput
    /**
     * Limit how many groups to update.
     */
    limit?: number
  }

  /**
   * groups updateManyAndReturn
   */
  export type groupsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * The data used to update groups.
     */
    data: XOR<groupsUpdateManyMutationInput, groupsUncheckedUpdateManyInput>
    /**
     * Filter which groups to update
     */
    where?: groupsWhereInput
    /**
     * Limit how many groups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * groups upsert
   */
  export type groupsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * The filter to search for the groups to update in case it exists.
     */
    where: groupsWhereUniqueInput
    /**
     * In case the groups found by the `where` argument doesn't exist, create a new groups with this data.
     */
    create: XOR<groupsCreateInput, groupsUncheckedCreateInput>
    /**
     * In case the groups was found with the provided `where` argument, update it with this data.
     */
    update: XOR<groupsUpdateInput, groupsUncheckedUpdateInput>
  }

  /**
   * groups delete
   */
  export type groupsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    /**
     * Filter which groups to delete.
     */
    where: groupsWhereUniqueInput
  }

  /**
   * groups deleteMany
   */
  export type groupsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which groups to delete
     */
    where?: groupsWhereInput
    /**
     * Limit how many groups to delete.
     */
    limit?: number
  }

  /**
   * groups.accounts
   */
  export type groups$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    where?: accountsWhereInput
  }

  /**
   * groups.users
   */
  export type groups$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    cursor?: usersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * groups without action
   */
  export type groupsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
  }


  /**
   * Model newsletters
   */

  export type AggregateNewsletters = {
    _count: NewslettersCountAggregateOutputType | null
    _avg: NewslettersAvgAggregateOutputType | null
    _sum: NewslettersSumAggregateOutputType | null
    _min: NewslettersMinAggregateOutputType | null
    _max: NewslettersMaxAggregateOutputType | null
  }

  export type NewslettersAvgAggregateOutputType = {
    id: number | null
  }

  export type NewslettersSumAggregateOutputType = {
    id: number | null
  }

  export type NewslettersMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    created_at: Date | null
  }

  export type NewslettersMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    created_at: Date | null
  }

  export type NewslettersCountAggregateOutputType = {
    id: number
    name: number
    description: number
    created_at: number
    _all: number
  }


  export type NewslettersAvgAggregateInputType = {
    id?: true
  }

  export type NewslettersSumAggregateInputType = {
    id?: true
  }

  export type NewslettersMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
  }

  export type NewslettersMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
  }

  export type NewslettersCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
    _all?: true
  }

  export type NewslettersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which newsletters to aggregate.
     */
    where?: newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of newsletters to fetch.
     */
    orderBy?: newslettersOrderByWithRelationInput | newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned newsletters
    **/
    _count?: true | NewslettersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewslettersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewslettersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewslettersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewslettersMaxAggregateInputType
  }

  export type GetNewslettersAggregateType<T extends NewslettersAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsletters]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsletters[P]>
      : GetScalarType<T[P], AggregateNewsletters[P]>
  }




  export type newslettersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: newslettersWhereInput
    orderBy?: newslettersOrderByWithAggregationInput | newslettersOrderByWithAggregationInput[]
    by: NewslettersScalarFieldEnum[] | NewslettersScalarFieldEnum
    having?: newslettersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewslettersCountAggregateInputType | true
    _avg?: NewslettersAvgAggregateInputType
    _sum?: NewslettersSumAggregateInputType
    _min?: NewslettersMinAggregateInputType
    _max?: NewslettersMaxAggregateInputType
  }

  export type NewslettersGroupByOutputType = {
    id: number
    name: string
    description: string | null
    created_at: Date | null
    _count: NewslettersCountAggregateOutputType | null
    _avg: NewslettersAvgAggregateOutputType | null
    _sum: NewslettersSumAggregateOutputType | null
    _min: NewslettersMinAggregateOutputType | null
    _max: NewslettersMaxAggregateOutputType | null
  }

  type GetNewslettersGroupByPayload<T extends newslettersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewslettersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewslettersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewslettersGroupByOutputType[P]>
            : GetScalarType<T[P], NewslettersGroupByOutputType[P]>
        }
      >
    >


  export type newslettersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
    user_newsletters?: boolean | newsletters$user_newslettersArgs<ExtArgs>
    _count?: boolean | NewslettersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsletters"]>

  export type newslettersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["newsletters"]>

  export type newslettersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["newsletters"]>

  export type newslettersSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }

  export type newslettersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "created_at", ExtArgs["result"]["newsletters"]>
  export type newslettersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user_newsletters?: boolean | newsletters$user_newslettersArgs<ExtArgs>
    _count?: boolean | NewslettersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type newslettersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type newslettersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $newslettersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "newsletters"
    objects: {
      user_newsletters: Prisma.$user_newslettersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string | null
      created_at: Date | null
    }, ExtArgs["result"]["newsletters"]>
    composites: {}
  }

  type newslettersGetPayload<S extends boolean | null | undefined | newslettersDefaultArgs> = $Result.GetResult<Prisma.$newslettersPayload, S>

  type newslettersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<newslettersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewslettersCountAggregateInputType | true
    }

  export interface newslettersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['newsletters'], meta: { name: 'newsletters' } }
    /**
     * Find zero or one Newsletters that matches the filter.
     * @param {newslettersFindUniqueArgs} args - Arguments to find a Newsletters
     * @example
     * // Get one Newsletters
     * const newsletters = await prisma.newsletters.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends newslettersFindUniqueArgs>(args: SelectSubset<T, newslettersFindUniqueArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Newsletters that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {newslettersFindUniqueOrThrowArgs} args - Arguments to find a Newsletters
     * @example
     * // Get one Newsletters
     * const newsletters = await prisma.newsletters.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends newslettersFindUniqueOrThrowArgs>(args: SelectSubset<T, newslettersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Newsletters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {newslettersFindFirstArgs} args - Arguments to find a Newsletters
     * @example
     * // Get one Newsletters
     * const newsletters = await prisma.newsletters.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends newslettersFindFirstArgs>(args?: SelectSubset<T, newslettersFindFirstArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Newsletters that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {newslettersFindFirstOrThrowArgs} args - Arguments to find a Newsletters
     * @example
     * // Get one Newsletters
     * const newsletters = await prisma.newsletters.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends newslettersFindFirstOrThrowArgs>(args?: SelectSubset<T, newslettersFindFirstOrThrowArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Newsletters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {newslettersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Newsletters
     * const newsletters = await prisma.newsletters.findMany()
     * 
     * // Get first 10 Newsletters
     * const newsletters = await prisma.newsletters.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newslettersWithIdOnly = await prisma.newsletters.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends newslettersFindManyArgs>(args?: SelectSubset<T, newslettersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Newsletters.
     * @param {newslettersCreateArgs} args - Arguments to create a Newsletters.
     * @example
     * // Create one Newsletters
     * const Newsletters = await prisma.newsletters.create({
     *   data: {
     *     // ... data to create a Newsletters
     *   }
     * })
     * 
     */
    create<T extends newslettersCreateArgs>(args: SelectSubset<T, newslettersCreateArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Newsletters.
     * @param {newslettersCreateManyArgs} args - Arguments to create many Newsletters.
     * @example
     * // Create many Newsletters
     * const newsletters = await prisma.newsletters.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends newslettersCreateManyArgs>(args?: SelectSubset<T, newslettersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Newsletters and returns the data saved in the database.
     * @param {newslettersCreateManyAndReturnArgs} args - Arguments to create many Newsletters.
     * @example
     * // Create many Newsletters
     * const newsletters = await prisma.newsletters.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Newsletters and only return the `id`
     * const newslettersWithIdOnly = await prisma.newsletters.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends newslettersCreateManyAndReturnArgs>(args?: SelectSubset<T, newslettersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Newsletters.
     * @param {newslettersDeleteArgs} args - Arguments to delete one Newsletters.
     * @example
     * // Delete one Newsletters
     * const Newsletters = await prisma.newsletters.delete({
     *   where: {
     *     // ... filter to delete one Newsletters
     *   }
     * })
     * 
     */
    delete<T extends newslettersDeleteArgs>(args: SelectSubset<T, newslettersDeleteArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Newsletters.
     * @param {newslettersUpdateArgs} args - Arguments to update one Newsletters.
     * @example
     * // Update one Newsletters
     * const newsletters = await prisma.newsletters.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends newslettersUpdateArgs>(args: SelectSubset<T, newslettersUpdateArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Newsletters.
     * @param {newslettersDeleteManyArgs} args - Arguments to filter Newsletters to delete.
     * @example
     * // Delete a few Newsletters
     * const { count } = await prisma.newsletters.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends newslettersDeleteManyArgs>(args?: SelectSubset<T, newslettersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {newslettersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Newsletters
     * const newsletters = await prisma.newsletters.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends newslettersUpdateManyArgs>(args: SelectSubset<T, newslettersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Newsletters and returns the data updated in the database.
     * @param {newslettersUpdateManyAndReturnArgs} args - Arguments to update many Newsletters.
     * @example
     * // Update many Newsletters
     * const newsletters = await prisma.newsletters.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Newsletters and only return the `id`
     * const newslettersWithIdOnly = await prisma.newsletters.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends newslettersUpdateManyAndReturnArgs>(args: SelectSubset<T, newslettersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Newsletters.
     * @param {newslettersUpsertArgs} args - Arguments to update or create a Newsletters.
     * @example
     * // Update or create a Newsletters
     * const newsletters = await prisma.newsletters.upsert({
     *   create: {
     *     // ... data to create a Newsletters
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Newsletters we want to update
     *   }
     * })
     */
    upsert<T extends newslettersUpsertArgs>(args: SelectSubset<T, newslettersUpsertArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {newslettersCountArgs} args - Arguments to filter Newsletters to count.
     * @example
     * // Count the number of Newsletters
     * const count = await prisma.newsletters.count({
     *   where: {
     *     // ... the filter for the Newsletters we want to count
     *   }
     * })
    **/
    count<T extends newslettersCountArgs>(
      args?: Subset<T, newslettersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewslettersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewslettersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewslettersAggregateArgs>(args: Subset<T, NewslettersAggregateArgs>): Prisma.PrismaPromise<GetNewslettersAggregateType<T>>

    /**
     * Group by Newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {newslettersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends newslettersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: newslettersGroupByArgs['orderBy'] }
        : { orderBy?: newslettersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, newslettersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewslettersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the newsletters model
   */
  readonly fields: newslettersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for newsletters.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__newslettersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user_newsletters<T extends newsletters$user_newslettersArgs<ExtArgs> = {}>(args?: Subset<T, newsletters$user_newslettersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the newsletters model
   */
  interface newslettersFieldRefs {
    readonly id: FieldRef<"newsletters", 'Int'>
    readonly name: FieldRef<"newsletters", 'String'>
    readonly description: FieldRef<"newsletters", 'String'>
    readonly created_at: FieldRef<"newsletters", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * newsletters findUnique
   */
  export type newslettersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * Filter, which newsletters to fetch.
     */
    where: newslettersWhereUniqueInput
  }

  /**
   * newsletters findUniqueOrThrow
   */
  export type newslettersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * Filter, which newsletters to fetch.
     */
    where: newslettersWhereUniqueInput
  }

  /**
   * newsletters findFirst
   */
  export type newslettersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * Filter, which newsletters to fetch.
     */
    where?: newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of newsletters to fetch.
     */
    orderBy?: newslettersOrderByWithRelationInput | newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for newsletters.
     */
    cursor?: newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of newsletters.
     */
    distinct?: NewslettersScalarFieldEnum | NewslettersScalarFieldEnum[]
  }

  /**
   * newsletters findFirstOrThrow
   */
  export type newslettersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * Filter, which newsletters to fetch.
     */
    where?: newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of newsletters to fetch.
     */
    orderBy?: newslettersOrderByWithRelationInput | newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for newsletters.
     */
    cursor?: newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of newsletters.
     */
    distinct?: NewslettersScalarFieldEnum | NewslettersScalarFieldEnum[]
  }

  /**
   * newsletters findMany
   */
  export type newslettersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * Filter, which newsletters to fetch.
     */
    where?: newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of newsletters to fetch.
     */
    orderBy?: newslettersOrderByWithRelationInput | newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing newsletters.
     */
    cursor?: newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` newsletters.
     */
    skip?: number
    distinct?: NewslettersScalarFieldEnum | NewslettersScalarFieldEnum[]
  }

  /**
   * newsletters create
   */
  export type newslettersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * The data needed to create a newsletters.
     */
    data: XOR<newslettersCreateInput, newslettersUncheckedCreateInput>
  }

  /**
   * newsletters createMany
   */
  export type newslettersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many newsletters.
     */
    data: newslettersCreateManyInput | newslettersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * newsletters createManyAndReturn
   */
  export type newslettersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * The data used to create many newsletters.
     */
    data: newslettersCreateManyInput | newslettersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * newsletters update
   */
  export type newslettersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * The data needed to update a newsletters.
     */
    data: XOR<newslettersUpdateInput, newslettersUncheckedUpdateInput>
    /**
     * Choose, which newsletters to update.
     */
    where: newslettersWhereUniqueInput
  }

  /**
   * newsletters updateMany
   */
  export type newslettersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update newsletters.
     */
    data: XOR<newslettersUpdateManyMutationInput, newslettersUncheckedUpdateManyInput>
    /**
     * Filter which newsletters to update
     */
    where?: newslettersWhereInput
    /**
     * Limit how many newsletters to update.
     */
    limit?: number
  }

  /**
   * newsletters updateManyAndReturn
   */
  export type newslettersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * The data used to update newsletters.
     */
    data: XOR<newslettersUpdateManyMutationInput, newslettersUncheckedUpdateManyInput>
    /**
     * Filter which newsletters to update
     */
    where?: newslettersWhereInput
    /**
     * Limit how many newsletters to update.
     */
    limit?: number
  }

  /**
   * newsletters upsert
   */
  export type newslettersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * The filter to search for the newsletters to update in case it exists.
     */
    where: newslettersWhereUniqueInput
    /**
     * In case the newsletters found by the `where` argument doesn't exist, create a new newsletters with this data.
     */
    create: XOR<newslettersCreateInput, newslettersUncheckedCreateInput>
    /**
     * In case the newsletters was found with the provided `where` argument, update it with this data.
     */
    update: XOR<newslettersUpdateInput, newslettersUncheckedUpdateInput>
  }

  /**
   * newsletters delete
   */
  export type newslettersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    /**
     * Filter which newsletters to delete.
     */
    where: newslettersWhereUniqueInput
  }

  /**
   * newsletters deleteMany
   */
  export type newslettersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which newsletters to delete
     */
    where?: newslettersWhereInput
    /**
     * Limit how many newsletters to delete.
     */
    limit?: number
  }

  /**
   * newsletters.user_newsletters
   */
  export type newsletters$user_newslettersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    where?: user_newslettersWhereInput
    orderBy?: user_newslettersOrderByWithRelationInput | user_newslettersOrderByWithRelationInput[]
    cursor?: user_newslettersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_newslettersScalarFieldEnum | User_newslettersScalarFieldEnum[]
  }

  /**
   * newsletters without action
   */
  export type newslettersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
  }


  /**
   * Model product_usage
   */

  export type AggregateProduct_usage = {
    _count: Product_usageCountAggregateOutputType | null
    _avg: Product_usageAvgAggregateOutputType | null
    _sum: Product_usageSumAggregateOutputType | null
    _min: Product_usageMinAggregateOutputType | null
    _max: Product_usageMaxAggregateOutputType | null
  }

  export type Product_usageAvgAggregateOutputType = {
    id: number | null
    account_id: number | null
    product_id: number | null
    pageviews: number | null
    active_users: number | null
  }

  export type Product_usageSumAggregateOutputType = {
    id: number | null
    account_id: number | null
    product_id: number | null
    pageviews: number | null
    active_users: number | null
  }

  export type Product_usageMinAggregateOutputType = {
    id: number | null
    account_id: number | null
    product_id: number | null
    date: Date | null
    pageviews: number | null
    active_users: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Product_usageMaxAggregateOutputType = {
    id: number | null
    account_id: number | null
    product_id: number | null
    date: Date | null
    pageviews: number | null
    active_users: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Product_usageCountAggregateOutputType = {
    id: number
    account_id: number
    product_id: number
    date: number
    pageviews: number
    active_users: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Product_usageAvgAggregateInputType = {
    id?: true
    account_id?: true
    product_id?: true
    pageviews?: true
    active_users?: true
  }

  export type Product_usageSumAggregateInputType = {
    id?: true
    account_id?: true
    product_id?: true
    pageviews?: true
    active_users?: true
  }

  export type Product_usageMinAggregateInputType = {
    id?: true
    account_id?: true
    product_id?: true
    date?: true
    pageviews?: true
    active_users?: true
    created_at?: true
    updated_at?: true
  }

  export type Product_usageMaxAggregateInputType = {
    id?: true
    account_id?: true
    product_id?: true
    date?: true
    pageviews?: true
    active_users?: true
    created_at?: true
    updated_at?: true
  }

  export type Product_usageCountAggregateInputType = {
    id?: true
    account_id?: true
    product_id?: true
    date?: true
    pageviews?: true
    active_users?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Product_usageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product_usage to aggregate.
     */
    where?: product_usageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_usages to fetch.
     */
    orderBy?: product_usageOrderByWithRelationInput | product_usageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: product_usageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_usages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_usages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned product_usages
    **/
    _count?: true | Product_usageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Product_usageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Product_usageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Product_usageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Product_usageMaxAggregateInputType
  }

  export type GetProduct_usageAggregateType<T extends Product_usageAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct_usage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct_usage[P]>
      : GetScalarType<T[P], AggregateProduct_usage[P]>
  }




  export type product_usageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: product_usageWhereInput
    orderBy?: product_usageOrderByWithAggregationInput | product_usageOrderByWithAggregationInput[]
    by: Product_usageScalarFieldEnum[] | Product_usageScalarFieldEnum
    having?: product_usageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Product_usageCountAggregateInputType | true
    _avg?: Product_usageAvgAggregateInputType
    _sum?: Product_usageSumAggregateInputType
    _min?: Product_usageMinAggregateInputType
    _max?: Product_usageMaxAggregateInputType
  }

  export type Product_usageGroupByOutputType = {
    id: number
    account_id: number | null
    product_id: number | null
    date: Date
    pageviews: number | null
    active_users: number | null
    created_at: Date | null
    updated_at: Date | null
    _count: Product_usageCountAggregateOutputType | null
    _avg: Product_usageAvgAggregateOutputType | null
    _sum: Product_usageSumAggregateOutputType | null
    _min: Product_usageMinAggregateOutputType | null
    _max: Product_usageMaxAggregateOutputType | null
  }

  type GetProduct_usageGroupByPayload<T extends product_usageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Product_usageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Product_usageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Product_usageGroupByOutputType[P]>
            : GetScalarType<T[P], Product_usageGroupByOutputType[P]>
        }
      >
    >


  export type product_usageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    product_id?: boolean
    date?: boolean
    pageviews?: boolean
    active_users?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | product_usage$accountsArgs<ExtArgs>
    products?: boolean | product_usage$productsArgs<ExtArgs>
  }, ExtArgs["result"]["product_usage"]>

  export type product_usageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    product_id?: boolean
    date?: boolean
    pageviews?: boolean
    active_users?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | product_usage$accountsArgs<ExtArgs>
    products?: boolean | product_usage$productsArgs<ExtArgs>
  }, ExtArgs["result"]["product_usage"]>

  export type product_usageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    product_id?: boolean
    date?: boolean
    pageviews?: boolean
    active_users?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | product_usage$accountsArgs<ExtArgs>
    products?: boolean | product_usage$productsArgs<ExtArgs>
  }, ExtArgs["result"]["product_usage"]>

  export type product_usageSelectScalar = {
    id?: boolean
    account_id?: boolean
    product_id?: boolean
    date?: boolean
    pageviews?: boolean
    active_users?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type product_usageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "account_id" | "product_id" | "date" | "pageviews" | "active_users" | "created_at" | "updated_at", ExtArgs["result"]["product_usage"]>
  export type product_usageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | product_usage$accountsArgs<ExtArgs>
    products?: boolean | product_usage$productsArgs<ExtArgs>
  }
  export type product_usageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | product_usage$accountsArgs<ExtArgs>
    products?: boolean | product_usage$productsArgs<ExtArgs>
  }
  export type product_usageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | product_usage$accountsArgs<ExtArgs>
    products?: boolean | product_usage$productsArgs<ExtArgs>
  }

  export type $product_usagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "product_usage"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs> | null
      products: Prisma.$productsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      account_id: number | null
      product_id: number | null
      date: Date
      pageviews: number | null
      active_users: number | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["product_usage"]>
    composites: {}
  }

  type product_usageGetPayload<S extends boolean | null | undefined | product_usageDefaultArgs> = $Result.GetResult<Prisma.$product_usagePayload, S>

  type product_usageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<product_usageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Product_usageCountAggregateInputType | true
    }

  export interface product_usageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['product_usage'], meta: { name: 'product_usage' } }
    /**
     * Find zero or one Product_usage that matches the filter.
     * @param {product_usageFindUniqueArgs} args - Arguments to find a Product_usage
     * @example
     * // Get one Product_usage
     * const product_usage = await prisma.product_usage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends product_usageFindUniqueArgs>(args: SelectSubset<T, product_usageFindUniqueArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product_usage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {product_usageFindUniqueOrThrowArgs} args - Arguments to find a Product_usage
     * @example
     * // Get one Product_usage
     * const product_usage = await prisma.product_usage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends product_usageFindUniqueOrThrowArgs>(args: SelectSubset<T, product_usageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product_usage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_usageFindFirstArgs} args - Arguments to find a Product_usage
     * @example
     * // Get one Product_usage
     * const product_usage = await prisma.product_usage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends product_usageFindFirstArgs>(args?: SelectSubset<T, product_usageFindFirstArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product_usage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_usageFindFirstOrThrowArgs} args - Arguments to find a Product_usage
     * @example
     * // Get one Product_usage
     * const product_usage = await prisma.product_usage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends product_usageFindFirstOrThrowArgs>(args?: SelectSubset<T, product_usageFindFirstOrThrowArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Product_usages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_usageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Product_usages
     * const product_usages = await prisma.product_usage.findMany()
     * 
     * // Get first 10 Product_usages
     * const product_usages = await prisma.product_usage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const product_usageWithIdOnly = await prisma.product_usage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends product_usageFindManyArgs>(args?: SelectSubset<T, product_usageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product_usage.
     * @param {product_usageCreateArgs} args - Arguments to create a Product_usage.
     * @example
     * // Create one Product_usage
     * const Product_usage = await prisma.product_usage.create({
     *   data: {
     *     // ... data to create a Product_usage
     *   }
     * })
     * 
     */
    create<T extends product_usageCreateArgs>(args: SelectSubset<T, product_usageCreateArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Product_usages.
     * @param {product_usageCreateManyArgs} args - Arguments to create many Product_usages.
     * @example
     * // Create many Product_usages
     * const product_usage = await prisma.product_usage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends product_usageCreateManyArgs>(args?: SelectSubset<T, product_usageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Product_usages and returns the data saved in the database.
     * @param {product_usageCreateManyAndReturnArgs} args - Arguments to create many Product_usages.
     * @example
     * // Create many Product_usages
     * const product_usage = await prisma.product_usage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Product_usages and only return the `id`
     * const product_usageWithIdOnly = await prisma.product_usage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends product_usageCreateManyAndReturnArgs>(args?: SelectSubset<T, product_usageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product_usage.
     * @param {product_usageDeleteArgs} args - Arguments to delete one Product_usage.
     * @example
     * // Delete one Product_usage
     * const Product_usage = await prisma.product_usage.delete({
     *   where: {
     *     // ... filter to delete one Product_usage
     *   }
     * })
     * 
     */
    delete<T extends product_usageDeleteArgs>(args: SelectSubset<T, product_usageDeleteArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product_usage.
     * @param {product_usageUpdateArgs} args - Arguments to update one Product_usage.
     * @example
     * // Update one Product_usage
     * const product_usage = await prisma.product_usage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends product_usageUpdateArgs>(args: SelectSubset<T, product_usageUpdateArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Product_usages.
     * @param {product_usageDeleteManyArgs} args - Arguments to filter Product_usages to delete.
     * @example
     * // Delete a few Product_usages
     * const { count } = await prisma.product_usage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends product_usageDeleteManyArgs>(args?: SelectSubset<T, product_usageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Product_usages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_usageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Product_usages
     * const product_usage = await prisma.product_usage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends product_usageUpdateManyArgs>(args: SelectSubset<T, product_usageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Product_usages and returns the data updated in the database.
     * @param {product_usageUpdateManyAndReturnArgs} args - Arguments to update many Product_usages.
     * @example
     * // Update many Product_usages
     * const product_usage = await prisma.product_usage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Product_usages and only return the `id`
     * const product_usageWithIdOnly = await prisma.product_usage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends product_usageUpdateManyAndReturnArgs>(args: SelectSubset<T, product_usageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product_usage.
     * @param {product_usageUpsertArgs} args - Arguments to update or create a Product_usage.
     * @example
     * // Update or create a Product_usage
     * const product_usage = await prisma.product_usage.upsert({
     *   create: {
     *     // ... data to create a Product_usage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product_usage we want to update
     *   }
     * })
     */
    upsert<T extends product_usageUpsertArgs>(args: SelectSubset<T, product_usageUpsertArgs<ExtArgs>>): Prisma__product_usageClient<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Product_usages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_usageCountArgs} args - Arguments to filter Product_usages to count.
     * @example
     * // Count the number of Product_usages
     * const count = await prisma.product_usage.count({
     *   where: {
     *     // ... the filter for the Product_usages we want to count
     *   }
     * })
    **/
    count<T extends product_usageCountArgs>(
      args?: Subset<T, product_usageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Product_usageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product_usage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Product_usageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Product_usageAggregateArgs>(args: Subset<T, Product_usageAggregateArgs>): Prisma.PrismaPromise<GetProduct_usageAggregateType<T>>

    /**
     * Group by Product_usage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_usageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends product_usageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: product_usageGroupByArgs['orderBy'] }
        : { orderBy?: product_usageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, product_usageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProduct_usageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the product_usage model
   */
  readonly fields: product_usageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for product_usage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__product_usageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends product_usage$accountsArgs<ExtArgs> = {}>(args?: Subset<T, product_usage$accountsArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    products<T extends product_usage$productsArgs<ExtArgs> = {}>(args?: Subset<T, product_usage$productsArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the product_usage model
   */
  interface product_usageFieldRefs {
    readonly id: FieldRef<"product_usage", 'Int'>
    readonly account_id: FieldRef<"product_usage", 'Int'>
    readonly product_id: FieldRef<"product_usage", 'Int'>
    readonly date: FieldRef<"product_usage", 'DateTime'>
    readonly pageviews: FieldRef<"product_usage", 'Int'>
    readonly active_users: FieldRef<"product_usage", 'Int'>
    readonly created_at: FieldRef<"product_usage", 'DateTime'>
    readonly updated_at: FieldRef<"product_usage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * product_usage findUnique
   */
  export type product_usageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * Filter, which product_usage to fetch.
     */
    where: product_usageWhereUniqueInput
  }

  /**
   * product_usage findUniqueOrThrow
   */
  export type product_usageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * Filter, which product_usage to fetch.
     */
    where: product_usageWhereUniqueInput
  }

  /**
   * product_usage findFirst
   */
  export type product_usageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * Filter, which product_usage to fetch.
     */
    where?: product_usageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_usages to fetch.
     */
    orderBy?: product_usageOrderByWithRelationInput | product_usageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for product_usages.
     */
    cursor?: product_usageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_usages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_usages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of product_usages.
     */
    distinct?: Product_usageScalarFieldEnum | Product_usageScalarFieldEnum[]
  }

  /**
   * product_usage findFirstOrThrow
   */
  export type product_usageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * Filter, which product_usage to fetch.
     */
    where?: product_usageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_usages to fetch.
     */
    orderBy?: product_usageOrderByWithRelationInput | product_usageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for product_usages.
     */
    cursor?: product_usageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_usages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_usages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of product_usages.
     */
    distinct?: Product_usageScalarFieldEnum | Product_usageScalarFieldEnum[]
  }

  /**
   * product_usage findMany
   */
  export type product_usageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * Filter, which product_usages to fetch.
     */
    where?: product_usageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_usages to fetch.
     */
    orderBy?: product_usageOrderByWithRelationInput | product_usageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing product_usages.
     */
    cursor?: product_usageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_usages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_usages.
     */
    skip?: number
    distinct?: Product_usageScalarFieldEnum | Product_usageScalarFieldEnum[]
  }

  /**
   * product_usage create
   */
  export type product_usageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * The data needed to create a product_usage.
     */
    data: XOR<product_usageCreateInput, product_usageUncheckedCreateInput>
  }

  /**
   * product_usage createMany
   */
  export type product_usageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many product_usages.
     */
    data: product_usageCreateManyInput | product_usageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * product_usage createManyAndReturn
   */
  export type product_usageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * The data used to create many product_usages.
     */
    data: product_usageCreateManyInput | product_usageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * product_usage update
   */
  export type product_usageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * The data needed to update a product_usage.
     */
    data: XOR<product_usageUpdateInput, product_usageUncheckedUpdateInput>
    /**
     * Choose, which product_usage to update.
     */
    where: product_usageWhereUniqueInput
  }

  /**
   * product_usage updateMany
   */
  export type product_usageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update product_usages.
     */
    data: XOR<product_usageUpdateManyMutationInput, product_usageUncheckedUpdateManyInput>
    /**
     * Filter which product_usages to update
     */
    where?: product_usageWhereInput
    /**
     * Limit how many product_usages to update.
     */
    limit?: number
  }

  /**
   * product_usage updateManyAndReturn
   */
  export type product_usageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * The data used to update product_usages.
     */
    data: XOR<product_usageUpdateManyMutationInput, product_usageUncheckedUpdateManyInput>
    /**
     * Filter which product_usages to update
     */
    where?: product_usageWhereInput
    /**
     * Limit how many product_usages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * product_usage upsert
   */
  export type product_usageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * The filter to search for the product_usage to update in case it exists.
     */
    where: product_usageWhereUniqueInput
    /**
     * In case the product_usage found by the `where` argument doesn't exist, create a new product_usage with this data.
     */
    create: XOR<product_usageCreateInput, product_usageUncheckedCreateInput>
    /**
     * In case the product_usage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<product_usageUpdateInput, product_usageUncheckedUpdateInput>
  }

  /**
   * product_usage delete
   */
  export type product_usageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    /**
     * Filter which product_usage to delete.
     */
    where: product_usageWhereUniqueInput
  }

  /**
   * product_usage deleteMany
   */
  export type product_usageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product_usages to delete
     */
    where?: product_usageWhereInput
    /**
     * Limit how many product_usages to delete.
     */
    limit?: number
  }

  /**
   * product_usage.accounts
   */
  export type product_usage$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    where?: accountsWhereInput
  }

  /**
   * product_usage.products
   */
  export type product_usage$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    where?: productsWhereInput
  }

  /**
   * product_usage without action
   */
  export type product_usageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
  }


  /**
   * Model products
   */

  export type AggregateProducts = {
    _count: ProductsCountAggregateOutputType | null
    _avg: ProductsAvgAggregateOutputType | null
    _sum: ProductsSumAggregateOutputType | null
    _min: ProductsMinAggregateOutputType | null
    _max: ProductsMaxAggregateOutputType | null
  }

  export type ProductsAvgAggregateOutputType = {
    id: number | null
  }

  export type ProductsSumAggregateOutputType = {
    id: number | null
  }

  export type ProductsMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    created_at: Date | null
  }

  export type ProductsMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    created_at: Date | null
  }

  export type ProductsCountAggregateOutputType = {
    id: number
    name: number
    description: number
    created_at: number
    _all: number
  }


  export type ProductsAvgAggregateInputType = {
    id?: true
  }

  export type ProductsSumAggregateInputType = {
    id?: true
  }

  export type ProductsMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
  }

  export type ProductsMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
  }

  export type ProductsCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
    _all?: true
  }

  export type ProductsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which products to aggregate.
     */
    where?: productsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productsOrderByWithRelationInput | productsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: productsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned products
    **/
    _count?: true | ProductsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductsMaxAggregateInputType
  }

  export type GetProductsAggregateType<T extends ProductsAggregateArgs> = {
        [P in keyof T & keyof AggregateProducts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProducts[P]>
      : GetScalarType<T[P], AggregateProducts[P]>
  }




  export type productsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: productsWhereInput
    orderBy?: productsOrderByWithAggregationInput | productsOrderByWithAggregationInput[]
    by: ProductsScalarFieldEnum[] | ProductsScalarFieldEnum
    having?: productsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductsCountAggregateInputType | true
    _avg?: ProductsAvgAggregateInputType
    _sum?: ProductsSumAggregateInputType
    _min?: ProductsMinAggregateInputType
    _max?: ProductsMaxAggregateInputType
  }

  export type ProductsGroupByOutputType = {
    id: number
    name: string
    description: string | null
    created_at: Date | null
    _count: ProductsCountAggregateOutputType | null
    _avg: ProductsAvgAggregateOutputType | null
    _sum: ProductsSumAggregateOutputType | null
    _min: ProductsMinAggregateOutputType | null
    _max: ProductsMaxAggregateOutputType | null
  }

  type GetProductsGroupByPayload<T extends productsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductsGroupByOutputType[P]>
            : GetScalarType<T[P], ProductsGroupByOutputType[P]>
        }
      >
    >


  export type productsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
    product_usage?: boolean | products$product_usageArgs<ExtArgs>
    _count?: boolean | ProductsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["products"]>

  export type productsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["products"]>

  export type productsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["products"]>

  export type productsSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }

  export type productsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "created_at", ExtArgs["result"]["products"]>
  export type productsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product_usage?: boolean | products$product_usageArgs<ExtArgs>
    _count?: boolean | ProductsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type productsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type productsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $productsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "products"
    objects: {
      product_usage: Prisma.$product_usagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string | null
      created_at: Date | null
    }, ExtArgs["result"]["products"]>
    composites: {}
  }

  type productsGetPayload<S extends boolean | null | undefined | productsDefaultArgs> = $Result.GetResult<Prisma.$productsPayload, S>

  type productsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<productsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductsCountAggregateInputType | true
    }

  export interface productsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['products'], meta: { name: 'products' } }
    /**
     * Find zero or one Products that matches the filter.
     * @param {productsFindUniqueArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends productsFindUniqueArgs>(args: SelectSubset<T, productsFindUniqueArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Products that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {productsFindUniqueOrThrowArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends productsFindUniqueOrThrowArgs>(args: SelectSubset<T, productsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsFindFirstArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends productsFindFirstArgs>(args?: SelectSubset<T, productsFindFirstArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Products that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsFindFirstOrThrowArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends productsFindFirstOrThrowArgs>(args?: SelectSubset<T, productsFindFirstOrThrowArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.products.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.products.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productsWithIdOnly = await prisma.products.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends productsFindManyArgs>(args?: SelectSubset<T, productsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Products.
     * @param {productsCreateArgs} args - Arguments to create a Products.
     * @example
     * // Create one Products
     * const Products = await prisma.products.create({
     *   data: {
     *     // ... data to create a Products
     *   }
     * })
     * 
     */
    create<T extends productsCreateArgs>(args: SelectSubset<T, productsCreateArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {productsCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const products = await prisma.products.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends productsCreateManyArgs>(args?: SelectSubset<T, productsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {productsCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const products = await prisma.products.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productsWithIdOnly = await prisma.products.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends productsCreateManyAndReturnArgs>(args?: SelectSubset<T, productsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Products.
     * @param {productsDeleteArgs} args - Arguments to delete one Products.
     * @example
     * // Delete one Products
     * const Products = await prisma.products.delete({
     *   where: {
     *     // ... filter to delete one Products
     *   }
     * })
     * 
     */
    delete<T extends productsDeleteArgs>(args: SelectSubset<T, productsDeleteArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Products.
     * @param {productsUpdateArgs} args - Arguments to update one Products.
     * @example
     * // Update one Products
     * const products = await prisma.products.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends productsUpdateArgs>(args: SelectSubset<T, productsUpdateArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {productsDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.products.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends productsDeleteManyArgs>(args?: SelectSubset<T, productsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const products = await prisma.products.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends productsUpdateManyArgs>(args: SelectSubset<T, productsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {productsUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const products = await prisma.products.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productsWithIdOnly = await prisma.products.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends productsUpdateManyAndReturnArgs>(args: SelectSubset<T, productsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Products.
     * @param {productsUpsertArgs} args - Arguments to update or create a Products.
     * @example
     * // Update or create a Products
     * const products = await prisma.products.upsert({
     *   create: {
     *     // ... data to create a Products
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Products we want to update
     *   }
     * })
     */
    upsert<T extends productsUpsertArgs>(args: SelectSubset<T, productsUpsertArgs<ExtArgs>>): Prisma__productsClient<$Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.products.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends productsCountArgs>(
      args?: Subset<T, productsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductsAggregateArgs>(args: Subset<T, ProductsAggregateArgs>): Prisma.PrismaPromise<GetProductsAggregateType<T>>

    /**
     * Group by Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends productsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: productsGroupByArgs['orderBy'] }
        : { orderBy?: productsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, productsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the products model
   */
  readonly fields: productsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for products.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__productsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product_usage<T extends products$product_usageArgs<ExtArgs> = {}>(args?: Subset<T, products$product_usageArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_usagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the products model
   */
  interface productsFieldRefs {
    readonly id: FieldRef<"products", 'Int'>
    readonly name: FieldRef<"products", 'String'>
    readonly description: FieldRef<"products", 'String'>
    readonly created_at: FieldRef<"products", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * products findUnique
   */
  export type productsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where: productsWhereUniqueInput
  }

  /**
   * products findUniqueOrThrow
   */
  export type productsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where: productsWhereUniqueInput
  }

  /**
   * products findFirst
   */
  export type productsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where?: productsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productsOrderByWithRelationInput | productsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductsScalarFieldEnum | ProductsScalarFieldEnum[]
  }

  /**
   * products findFirstOrThrow
   */
  export type productsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where?: productsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productsOrderByWithRelationInput | productsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductsScalarFieldEnum | ProductsScalarFieldEnum[]
  }

  /**
   * products findMany
   */
  export type productsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where?: productsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productsOrderByWithRelationInput | productsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing products.
     */
    cursor?: productsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    distinct?: ProductsScalarFieldEnum | ProductsScalarFieldEnum[]
  }

  /**
   * products create
   */
  export type productsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * The data needed to create a products.
     */
    data: XOR<productsCreateInput, productsUncheckedCreateInput>
  }

  /**
   * products createMany
   */
  export type productsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many products.
     */
    data: productsCreateManyInput | productsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * products createManyAndReturn
   */
  export type productsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * The data used to create many products.
     */
    data: productsCreateManyInput | productsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * products update
   */
  export type productsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * The data needed to update a products.
     */
    data: XOR<productsUpdateInput, productsUncheckedUpdateInput>
    /**
     * Choose, which products to update.
     */
    where: productsWhereUniqueInput
  }

  /**
   * products updateMany
   */
  export type productsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update products.
     */
    data: XOR<productsUpdateManyMutationInput, productsUncheckedUpdateManyInput>
    /**
     * Filter which products to update
     */
    where?: productsWhereInput
    /**
     * Limit how many products to update.
     */
    limit?: number
  }

  /**
   * products updateManyAndReturn
   */
  export type productsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * The data used to update products.
     */
    data: XOR<productsUpdateManyMutationInput, productsUncheckedUpdateManyInput>
    /**
     * Filter which products to update
     */
    where?: productsWhereInput
    /**
     * Limit how many products to update.
     */
    limit?: number
  }

  /**
   * products upsert
   */
  export type productsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * The filter to search for the products to update in case it exists.
     */
    where: productsWhereUniqueInput
    /**
     * In case the products found by the `where` argument doesn't exist, create a new products with this data.
     */
    create: XOR<productsCreateInput, productsUncheckedCreateInput>
    /**
     * In case the products was found with the provided `where` argument, update it with this data.
     */
    update: XOR<productsUpdateInput, productsUncheckedUpdateInput>
  }

  /**
   * products delete
   */
  export type productsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
    /**
     * Filter which products to delete.
     */
    where: productsWhereUniqueInput
  }

  /**
   * products deleteMany
   */
  export type productsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which products to delete
     */
    where?: productsWhereInput
    /**
     * Limit how many products to delete.
     */
    limit?: number
  }

  /**
   * products.product_usage
   */
  export type products$product_usageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_usage
     */
    select?: product_usageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_usage
     */
    omit?: product_usageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_usageInclude<ExtArgs> | null
    where?: product_usageWhereInput
    orderBy?: product_usageOrderByWithRelationInput | product_usageOrderByWithRelationInput[]
    cursor?: product_usageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Product_usageScalarFieldEnum | Product_usageScalarFieldEnum[]
  }

  /**
   * products without action
   */
  export type productsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: productsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the products
     */
    omit?: productsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productsInclude<ExtArgs> | null
  }


  /**
   * Model subscriptions
   */

  export type AggregateSubscriptions = {
    _count: SubscriptionsCountAggregateOutputType | null
    _avg: SubscriptionsAvgAggregateOutputType | null
    _sum: SubscriptionsSumAggregateOutputType | null
    _min: SubscriptionsMinAggregateOutputType | null
    _max: SubscriptionsMaxAggregateOutputType | null
  }

  export type SubscriptionsAvgAggregateOutputType = {
    id: number | null
    account_id: number | null
    amount: Decimal | null
  }

  export type SubscriptionsSumAggregateOutputType = {
    id: number | null
    account_id: number | null
    amount: Decimal | null
  }

  export type SubscriptionsMinAggregateOutputType = {
    id: number | null
    external_id: string | null
    account_id: number | null
    customer_name: string | null
    email: string | null
    plan: string | null
    plan_type: string | null
    status: string | null
    amount: Decimal | null
    billing_cycle: string | null
    start_date: Date | null
    next_billing: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubscriptionsMaxAggregateOutputType = {
    id: number | null
    external_id: string | null
    account_id: number | null
    customer_name: string | null
    email: string | null
    plan: string | null
    plan_type: string | null
    status: string | null
    amount: Decimal | null
    billing_cycle: string | null
    start_date: Date | null
    next_billing: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubscriptionsCountAggregateOutputType = {
    id: number
    external_id: number
    account_id: number
    customer_name: number
    email: number
    plan: number
    plan_type: number
    status: number
    amount: number
    billing_cycle: number
    start_date: number
    next_billing: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SubscriptionsAvgAggregateInputType = {
    id?: true
    account_id?: true
    amount?: true
  }

  export type SubscriptionsSumAggregateInputType = {
    id?: true
    account_id?: true
    amount?: true
  }

  export type SubscriptionsMinAggregateInputType = {
    id?: true
    external_id?: true
    account_id?: true
    customer_name?: true
    email?: true
    plan?: true
    plan_type?: true
    status?: true
    amount?: true
    billing_cycle?: true
    start_date?: true
    next_billing?: true
    created_at?: true
    updated_at?: true
  }

  export type SubscriptionsMaxAggregateInputType = {
    id?: true
    external_id?: true
    account_id?: true
    customer_name?: true
    email?: true
    plan?: true
    plan_type?: true
    status?: true
    amount?: true
    billing_cycle?: true
    start_date?: true
    next_billing?: true
    created_at?: true
    updated_at?: true
  }

  export type SubscriptionsCountAggregateInputType = {
    id?: true
    external_id?: true
    account_id?: true
    customer_name?: true
    email?: true
    plan?: true
    plan_type?: true
    status?: true
    amount?: true
    billing_cycle?: true
    start_date?: true
    next_billing?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SubscriptionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscriptions to aggregate.
     */
    where?: subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscriptions to fetch.
     */
    orderBy?: subscriptionsOrderByWithRelationInput | subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned subscriptions
    **/
    _count?: true | SubscriptionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionsMaxAggregateInputType
  }

  export type GetSubscriptionsAggregateType<T extends SubscriptionsAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptions[P]>
      : GetScalarType<T[P], AggregateSubscriptions[P]>
  }




  export type subscriptionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subscriptionsWhereInput
    orderBy?: subscriptionsOrderByWithAggregationInput | subscriptionsOrderByWithAggregationInput[]
    by: SubscriptionsScalarFieldEnum[] | SubscriptionsScalarFieldEnum
    having?: subscriptionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionsCountAggregateInputType | true
    _avg?: SubscriptionsAvgAggregateInputType
    _sum?: SubscriptionsSumAggregateInputType
    _min?: SubscriptionsMinAggregateInputType
    _max?: SubscriptionsMaxAggregateInputType
  }

  export type SubscriptionsGroupByOutputType = {
    id: number
    external_id: string
    account_id: number | null
    customer_name: string
    email: string | null
    plan: string
    plan_type: string
    status: string
    amount: Decimal | null
    billing_cycle: string | null
    start_date: Date | null
    next_billing: Date | null
    created_at: Date | null
    updated_at: Date | null
    _count: SubscriptionsCountAggregateOutputType | null
    _avg: SubscriptionsAvgAggregateOutputType | null
    _sum: SubscriptionsSumAggregateOutputType | null
    _min: SubscriptionsMinAggregateOutputType | null
    _max: SubscriptionsMaxAggregateOutputType | null
  }

  type GetSubscriptionsGroupByPayload<T extends subscriptionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionsGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionsGroupByOutputType[P]>
        }
      >
    >


  export type subscriptionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    account_id?: boolean
    customer_name?: boolean
    email?: boolean
    plan?: boolean
    plan_type?: boolean
    status?: boolean
    amount?: boolean
    billing_cycle?: boolean
    start_date?: boolean
    next_billing?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | subscriptions$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptions"]>

  export type subscriptionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    account_id?: boolean
    customer_name?: boolean
    email?: boolean
    plan?: boolean
    plan_type?: boolean
    status?: boolean
    amount?: boolean
    billing_cycle?: boolean
    start_date?: boolean
    next_billing?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | subscriptions$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptions"]>

  export type subscriptionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    account_id?: boolean
    customer_name?: boolean
    email?: boolean
    plan?: boolean
    plan_type?: boolean
    status?: boolean
    amount?: boolean
    billing_cycle?: boolean
    start_date?: boolean
    next_billing?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | subscriptions$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptions"]>

  export type subscriptionsSelectScalar = {
    id?: boolean
    external_id?: boolean
    account_id?: boolean
    customer_name?: boolean
    email?: boolean
    plan?: boolean
    plan_type?: boolean
    status?: boolean
    amount?: boolean
    billing_cycle?: boolean
    start_date?: boolean
    next_billing?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type subscriptionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "external_id" | "account_id" | "customer_name" | "email" | "plan" | "plan_type" | "status" | "amount" | "billing_cycle" | "start_date" | "next_billing" | "created_at" | "updated_at", ExtArgs["result"]["subscriptions"]>
  export type subscriptionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | subscriptions$accountsArgs<ExtArgs>
  }
  export type subscriptionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | subscriptions$accountsArgs<ExtArgs>
  }
  export type subscriptionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | subscriptions$accountsArgs<ExtArgs>
  }

  export type $subscriptionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "subscriptions"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      external_id: string
      account_id: number | null
      customer_name: string
      email: string | null
      plan: string
      plan_type: string
      status: string
      amount: Prisma.Decimal | null
      billing_cycle: string | null
      start_date: Date | null
      next_billing: Date | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["subscriptions"]>
    composites: {}
  }

  type subscriptionsGetPayload<S extends boolean | null | undefined | subscriptionsDefaultArgs> = $Result.GetResult<Prisma.$subscriptionsPayload, S>

  type subscriptionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<subscriptionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionsCountAggregateInputType | true
    }

  export interface subscriptionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['subscriptions'], meta: { name: 'subscriptions' } }
    /**
     * Find zero or one Subscriptions that matches the filter.
     * @param {subscriptionsFindUniqueArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends subscriptionsFindUniqueArgs>(args: SelectSubset<T, subscriptionsFindUniqueArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscriptions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {subscriptionsFindUniqueOrThrowArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends subscriptionsFindUniqueOrThrowArgs>(args: SelectSubset<T, subscriptionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscriptionsFindFirstArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends subscriptionsFindFirstArgs>(args?: SelectSubset<T, subscriptionsFindFirstArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscriptions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscriptionsFindFirstOrThrowArgs} args - Arguments to find a Subscriptions
     * @example
     * // Get one Subscriptions
     * const subscriptions = await prisma.subscriptions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends subscriptionsFindFirstOrThrowArgs>(args?: SelectSubset<T, subscriptionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscriptionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscriptions.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscriptions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionsWithIdOnly = await prisma.subscriptions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends subscriptionsFindManyArgs>(args?: SelectSubset<T, subscriptionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscriptions.
     * @param {subscriptionsCreateArgs} args - Arguments to create a Subscriptions.
     * @example
     * // Create one Subscriptions
     * const Subscriptions = await prisma.subscriptions.create({
     *   data: {
     *     // ... data to create a Subscriptions
     *   }
     * })
     * 
     */
    create<T extends subscriptionsCreateArgs>(args: SelectSubset<T, subscriptionsCreateArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {subscriptionsCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscriptions = await prisma.subscriptions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends subscriptionsCreateManyArgs>(args?: SelectSubset<T, subscriptionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {subscriptionsCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscriptions = await prisma.subscriptions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionsWithIdOnly = await prisma.subscriptions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends subscriptionsCreateManyAndReturnArgs>(args?: SelectSubset<T, subscriptionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscriptions.
     * @param {subscriptionsDeleteArgs} args - Arguments to delete one Subscriptions.
     * @example
     * // Delete one Subscriptions
     * const Subscriptions = await prisma.subscriptions.delete({
     *   where: {
     *     // ... filter to delete one Subscriptions
     *   }
     * })
     * 
     */
    delete<T extends subscriptionsDeleteArgs>(args: SelectSubset<T, subscriptionsDeleteArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscriptions.
     * @param {subscriptionsUpdateArgs} args - Arguments to update one Subscriptions.
     * @example
     * // Update one Subscriptions
     * const subscriptions = await prisma.subscriptions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends subscriptionsUpdateArgs>(args: SelectSubset<T, subscriptionsUpdateArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {subscriptionsDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscriptions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends subscriptionsDeleteManyArgs>(args?: SelectSubset<T, subscriptionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscriptionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscriptions = await prisma.subscriptions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends subscriptionsUpdateManyArgs>(args: SelectSubset<T, subscriptionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {subscriptionsUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscriptions = await prisma.subscriptions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionsWithIdOnly = await prisma.subscriptions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends subscriptionsUpdateManyAndReturnArgs>(args: SelectSubset<T, subscriptionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscriptions.
     * @param {subscriptionsUpsertArgs} args - Arguments to update or create a Subscriptions.
     * @example
     * // Update or create a Subscriptions
     * const subscriptions = await prisma.subscriptions.upsert({
     *   create: {
     *     // ... data to create a Subscriptions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscriptions we want to update
     *   }
     * })
     */
    upsert<T extends subscriptionsUpsertArgs>(args: SelectSubset<T, subscriptionsUpsertArgs<ExtArgs>>): Prisma__subscriptionsClient<$Result.GetResult<Prisma.$subscriptionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscriptionsCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscriptions.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends subscriptionsCountArgs>(
      args?: Subset<T, subscriptionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionsAggregateArgs>(args: Subset<T, SubscriptionsAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionsAggregateType<T>>

    /**
     * Group by Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscriptionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends subscriptionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: subscriptionsGroupByArgs['orderBy'] }
        : { orderBy?: subscriptionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, subscriptionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the subscriptions model
   */
  readonly fields: subscriptionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for subscriptions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__subscriptionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends subscriptions$accountsArgs<ExtArgs> = {}>(args?: Subset<T, subscriptions$accountsArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the subscriptions model
   */
  interface subscriptionsFieldRefs {
    readonly id: FieldRef<"subscriptions", 'Int'>
    readonly external_id: FieldRef<"subscriptions", 'String'>
    readonly account_id: FieldRef<"subscriptions", 'Int'>
    readonly customer_name: FieldRef<"subscriptions", 'String'>
    readonly email: FieldRef<"subscriptions", 'String'>
    readonly plan: FieldRef<"subscriptions", 'String'>
    readonly plan_type: FieldRef<"subscriptions", 'String'>
    readonly status: FieldRef<"subscriptions", 'String'>
    readonly amount: FieldRef<"subscriptions", 'Decimal'>
    readonly billing_cycle: FieldRef<"subscriptions", 'String'>
    readonly start_date: FieldRef<"subscriptions", 'DateTime'>
    readonly next_billing: FieldRef<"subscriptions", 'DateTime'>
    readonly created_at: FieldRef<"subscriptions", 'DateTime'>
    readonly updated_at: FieldRef<"subscriptions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * subscriptions findUnique
   */
  export type subscriptionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which subscriptions to fetch.
     */
    where: subscriptionsWhereUniqueInput
  }

  /**
   * subscriptions findUniqueOrThrow
   */
  export type subscriptionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which subscriptions to fetch.
     */
    where: subscriptionsWhereUniqueInput
  }

  /**
   * subscriptions findFirst
   */
  export type subscriptionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which subscriptions to fetch.
     */
    where?: subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscriptions to fetch.
     */
    orderBy?: subscriptionsOrderByWithRelationInput | subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscriptions.
     */
    cursor?: subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscriptions.
     */
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * subscriptions findFirstOrThrow
   */
  export type subscriptionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which subscriptions to fetch.
     */
    where?: subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscriptions to fetch.
     */
    orderBy?: subscriptionsOrderByWithRelationInput | subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscriptions.
     */
    cursor?: subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscriptions.
     */
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * subscriptions findMany
   */
  export type subscriptionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which subscriptions to fetch.
     */
    where?: subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscriptions to fetch.
     */
    orderBy?: subscriptionsOrderByWithRelationInput | subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing subscriptions.
     */
    cursor?: subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscriptions.
     */
    skip?: number
    distinct?: SubscriptionsScalarFieldEnum | SubscriptionsScalarFieldEnum[]
  }

  /**
   * subscriptions create
   */
  export type subscriptionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to create a subscriptions.
     */
    data: XOR<subscriptionsCreateInput, subscriptionsUncheckedCreateInput>
  }

  /**
   * subscriptions createMany
   */
  export type subscriptionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many subscriptions.
     */
    data: subscriptionsCreateManyInput | subscriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * subscriptions createManyAndReturn
   */
  export type subscriptionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * The data used to create many subscriptions.
     */
    data: subscriptionsCreateManyInput | subscriptionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * subscriptions update
   */
  export type subscriptionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to update a subscriptions.
     */
    data: XOR<subscriptionsUpdateInput, subscriptionsUncheckedUpdateInput>
    /**
     * Choose, which subscriptions to update.
     */
    where: subscriptionsWhereUniqueInput
  }

  /**
   * subscriptions updateMany
   */
  export type subscriptionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update subscriptions.
     */
    data: XOR<subscriptionsUpdateManyMutationInput, subscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which subscriptions to update
     */
    where?: subscriptionsWhereInput
    /**
     * Limit how many subscriptions to update.
     */
    limit?: number
  }

  /**
   * subscriptions updateManyAndReturn
   */
  export type subscriptionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * The data used to update subscriptions.
     */
    data: XOR<subscriptionsUpdateManyMutationInput, subscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which subscriptions to update
     */
    where?: subscriptionsWhereInput
    /**
     * Limit how many subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * subscriptions upsert
   */
  export type subscriptionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * The filter to search for the subscriptions to update in case it exists.
     */
    where: subscriptionsWhereUniqueInput
    /**
     * In case the subscriptions found by the `where` argument doesn't exist, create a new subscriptions with this data.
     */
    create: XOR<subscriptionsCreateInput, subscriptionsUncheckedCreateInput>
    /**
     * In case the subscriptions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<subscriptionsUpdateInput, subscriptionsUncheckedUpdateInput>
  }

  /**
   * subscriptions delete
   */
  export type subscriptionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
    /**
     * Filter which subscriptions to delete.
     */
    where: subscriptionsWhereUniqueInput
  }

  /**
   * subscriptions deleteMany
   */
  export type subscriptionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscriptions to delete
     */
    where?: subscriptionsWhereInput
    /**
     * Limit how many subscriptions to delete.
     */
    limit?: number
  }

  /**
   * subscriptions.accounts
   */
  export type subscriptions$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    where?: accountsWhereInput
  }

  /**
   * subscriptions without action
   */
  export type subscriptionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscriptions
     */
    select?: subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscriptions
     */
    omit?: subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscriptionsInclude<ExtArgs> | null
  }


  /**
   * Model top_pages
   */

  export type AggregateTop_pages = {
    _count: Top_pagesCountAggregateOutputType | null
    _avg: Top_pagesAvgAggregateOutputType | null
    _sum: Top_pagesSumAggregateOutputType | null
    _min: Top_pagesMinAggregateOutputType | null
    _max: Top_pagesMaxAggregateOutputType | null
  }

  export type Top_pagesAvgAggregateOutputType = {
    id: number | null
    account_id: number | null
    pageviews: number | null
    avg_time_on_page: number | null
    bounce_rate: Decimal | null
  }

  export type Top_pagesSumAggregateOutputType = {
    id: number | null
    account_id: number | null
    pageviews: number | null
    avg_time_on_page: number | null
    bounce_rate: Decimal | null
  }

  export type Top_pagesMinAggregateOutputType = {
    id: number | null
    account_id: number | null
    url: string | null
    title: string | null
    pageviews: number | null
    avg_time_on_page: number | null
    bounce_rate: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Top_pagesMaxAggregateOutputType = {
    id: number | null
    account_id: number | null
    url: string | null
    title: string | null
    pageviews: number | null
    avg_time_on_page: number | null
    bounce_rate: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Top_pagesCountAggregateOutputType = {
    id: number
    account_id: number
    url: number
    title: number
    pageviews: number
    avg_time_on_page: number
    bounce_rate: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Top_pagesAvgAggregateInputType = {
    id?: true
    account_id?: true
    pageviews?: true
    avg_time_on_page?: true
    bounce_rate?: true
  }

  export type Top_pagesSumAggregateInputType = {
    id?: true
    account_id?: true
    pageviews?: true
    avg_time_on_page?: true
    bounce_rate?: true
  }

  export type Top_pagesMinAggregateInputType = {
    id?: true
    account_id?: true
    url?: true
    title?: true
    pageviews?: true
    avg_time_on_page?: true
    bounce_rate?: true
    created_at?: true
    updated_at?: true
  }

  export type Top_pagesMaxAggregateInputType = {
    id?: true
    account_id?: true
    url?: true
    title?: true
    pageviews?: true
    avg_time_on_page?: true
    bounce_rate?: true
    created_at?: true
    updated_at?: true
  }

  export type Top_pagesCountAggregateInputType = {
    id?: true
    account_id?: true
    url?: true
    title?: true
    pageviews?: true
    avg_time_on_page?: true
    bounce_rate?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Top_pagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which top_pages to aggregate.
     */
    where?: top_pagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of top_pages to fetch.
     */
    orderBy?: top_pagesOrderByWithRelationInput | top_pagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: top_pagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` top_pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` top_pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned top_pages
    **/
    _count?: true | Top_pagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Top_pagesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Top_pagesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Top_pagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Top_pagesMaxAggregateInputType
  }

  export type GetTop_pagesAggregateType<T extends Top_pagesAggregateArgs> = {
        [P in keyof T & keyof AggregateTop_pages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTop_pages[P]>
      : GetScalarType<T[P], AggregateTop_pages[P]>
  }




  export type top_pagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: top_pagesWhereInput
    orderBy?: top_pagesOrderByWithAggregationInput | top_pagesOrderByWithAggregationInput[]
    by: Top_pagesScalarFieldEnum[] | Top_pagesScalarFieldEnum
    having?: top_pagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Top_pagesCountAggregateInputType | true
    _avg?: Top_pagesAvgAggregateInputType
    _sum?: Top_pagesSumAggregateInputType
    _min?: Top_pagesMinAggregateInputType
    _max?: Top_pagesMaxAggregateInputType
  }

  export type Top_pagesGroupByOutputType = {
    id: number
    account_id: number | null
    url: string
    title: string | null
    pageviews: number | null
    avg_time_on_page: number | null
    bounce_rate: Decimal | null
    created_at: Date | null
    updated_at: Date | null
    _count: Top_pagesCountAggregateOutputType | null
    _avg: Top_pagesAvgAggregateOutputType | null
    _sum: Top_pagesSumAggregateOutputType | null
    _min: Top_pagesMinAggregateOutputType | null
    _max: Top_pagesMaxAggregateOutputType | null
  }

  type GetTop_pagesGroupByPayload<T extends top_pagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Top_pagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Top_pagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Top_pagesGroupByOutputType[P]>
            : GetScalarType<T[P], Top_pagesGroupByOutputType[P]>
        }
      >
    >


  export type top_pagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    url?: boolean
    title?: boolean
    pageviews?: boolean
    avg_time_on_page?: boolean
    bounce_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | top_pages$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["top_pages"]>

  export type top_pagesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    url?: boolean
    title?: boolean
    pageviews?: boolean
    avg_time_on_page?: boolean
    bounce_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | top_pages$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["top_pages"]>

  export type top_pagesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    url?: boolean
    title?: boolean
    pageviews?: boolean
    avg_time_on_page?: boolean
    bounce_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | top_pages$accountsArgs<ExtArgs>
  }, ExtArgs["result"]["top_pages"]>

  export type top_pagesSelectScalar = {
    id?: boolean
    account_id?: boolean
    url?: boolean
    title?: boolean
    pageviews?: boolean
    avg_time_on_page?: boolean
    bounce_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type top_pagesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "account_id" | "url" | "title" | "pageviews" | "avg_time_on_page" | "bounce_rate" | "created_at" | "updated_at", ExtArgs["result"]["top_pages"]>
  export type top_pagesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | top_pages$accountsArgs<ExtArgs>
  }
  export type top_pagesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | top_pages$accountsArgs<ExtArgs>
  }
  export type top_pagesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | top_pages$accountsArgs<ExtArgs>
  }

  export type $top_pagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "top_pages"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      account_id: number | null
      url: string
      title: string | null
      pageviews: number | null
      avg_time_on_page: number | null
      bounce_rate: Prisma.Decimal | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["top_pages"]>
    composites: {}
  }

  type top_pagesGetPayload<S extends boolean | null | undefined | top_pagesDefaultArgs> = $Result.GetResult<Prisma.$top_pagesPayload, S>

  type top_pagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<top_pagesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Top_pagesCountAggregateInputType | true
    }

  export interface top_pagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['top_pages'], meta: { name: 'top_pages' } }
    /**
     * Find zero or one Top_pages that matches the filter.
     * @param {top_pagesFindUniqueArgs} args - Arguments to find a Top_pages
     * @example
     * // Get one Top_pages
     * const top_pages = await prisma.top_pages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends top_pagesFindUniqueArgs>(args: SelectSubset<T, top_pagesFindUniqueArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Top_pages that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {top_pagesFindUniqueOrThrowArgs} args - Arguments to find a Top_pages
     * @example
     * // Get one Top_pages
     * const top_pages = await prisma.top_pages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends top_pagesFindUniqueOrThrowArgs>(args: SelectSubset<T, top_pagesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Top_pages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {top_pagesFindFirstArgs} args - Arguments to find a Top_pages
     * @example
     * // Get one Top_pages
     * const top_pages = await prisma.top_pages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends top_pagesFindFirstArgs>(args?: SelectSubset<T, top_pagesFindFirstArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Top_pages that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {top_pagesFindFirstOrThrowArgs} args - Arguments to find a Top_pages
     * @example
     * // Get one Top_pages
     * const top_pages = await prisma.top_pages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends top_pagesFindFirstOrThrowArgs>(args?: SelectSubset<T, top_pagesFindFirstOrThrowArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Top_pages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {top_pagesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Top_pages
     * const top_pages = await prisma.top_pages.findMany()
     * 
     * // Get first 10 Top_pages
     * const top_pages = await prisma.top_pages.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const top_pagesWithIdOnly = await prisma.top_pages.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends top_pagesFindManyArgs>(args?: SelectSubset<T, top_pagesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Top_pages.
     * @param {top_pagesCreateArgs} args - Arguments to create a Top_pages.
     * @example
     * // Create one Top_pages
     * const Top_pages = await prisma.top_pages.create({
     *   data: {
     *     // ... data to create a Top_pages
     *   }
     * })
     * 
     */
    create<T extends top_pagesCreateArgs>(args: SelectSubset<T, top_pagesCreateArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Top_pages.
     * @param {top_pagesCreateManyArgs} args - Arguments to create many Top_pages.
     * @example
     * // Create many Top_pages
     * const top_pages = await prisma.top_pages.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends top_pagesCreateManyArgs>(args?: SelectSubset<T, top_pagesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Top_pages and returns the data saved in the database.
     * @param {top_pagesCreateManyAndReturnArgs} args - Arguments to create many Top_pages.
     * @example
     * // Create many Top_pages
     * const top_pages = await prisma.top_pages.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Top_pages and only return the `id`
     * const top_pagesWithIdOnly = await prisma.top_pages.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends top_pagesCreateManyAndReturnArgs>(args?: SelectSubset<T, top_pagesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Top_pages.
     * @param {top_pagesDeleteArgs} args - Arguments to delete one Top_pages.
     * @example
     * // Delete one Top_pages
     * const Top_pages = await prisma.top_pages.delete({
     *   where: {
     *     // ... filter to delete one Top_pages
     *   }
     * })
     * 
     */
    delete<T extends top_pagesDeleteArgs>(args: SelectSubset<T, top_pagesDeleteArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Top_pages.
     * @param {top_pagesUpdateArgs} args - Arguments to update one Top_pages.
     * @example
     * // Update one Top_pages
     * const top_pages = await prisma.top_pages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends top_pagesUpdateArgs>(args: SelectSubset<T, top_pagesUpdateArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Top_pages.
     * @param {top_pagesDeleteManyArgs} args - Arguments to filter Top_pages to delete.
     * @example
     * // Delete a few Top_pages
     * const { count } = await prisma.top_pages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends top_pagesDeleteManyArgs>(args?: SelectSubset<T, top_pagesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Top_pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {top_pagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Top_pages
     * const top_pages = await prisma.top_pages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends top_pagesUpdateManyArgs>(args: SelectSubset<T, top_pagesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Top_pages and returns the data updated in the database.
     * @param {top_pagesUpdateManyAndReturnArgs} args - Arguments to update many Top_pages.
     * @example
     * // Update many Top_pages
     * const top_pages = await prisma.top_pages.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Top_pages and only return the `id`
     * const top_pagesWithIdOnly = await prisma.top_pages.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends top_pagesUpdateManyAndReturnArgs>(args: SelectSubset<T, top_pagesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Top_pages.
     * @param {top_pagesUpsertArgs} args - Arguments to update or create a Top_pages.
     * @example
     * // Update or create a Top_pages
     * const top_pages = await prisma.top_pages.upsert({
     *   create: {
     *     // ... data to create a Top_pages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Top_pages we want to update
     *   }
     * })
     */
    upsert<T extends top_pagesUpsertArgs>(args: SelectSubset<T, top_pagesUpsertArgs<ExtArgs>>): Prisma__top_pagesClient<$Result.GetResult<Prisma.$top_pagesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Top_pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {top_pagesCountArgs} args - Arguments to filter Top_pages to count.
     * @example
     * // Count the number of Top_pages
     * const count = await prisma.top_pages.count({
     *   where: {
     *     // ... the filter for the Top_pages we want to count
     *   }
     * })
    **/
    count<T extends top_pagesCountArgs>(
      args?: Subset<T, top_pagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Top_pagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Top_pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top_pagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Top_pagesAggregateArgs>(args: Subset<T, Top_pagesAggregateArgs>): Prisma.PrismaPromise<GetTop_pagesAggregateType<T>>

    /**
     * Group by Top_pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {top_pagesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends top_pagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: top_pagesGroupByArgs['orderBy'] }
        : { orderBy?: top_pagesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, top_pagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTop_pagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the top_pages model
   */
  readonly fields: top_pagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for top_pages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__top_pagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends top_pages$accountsArgs<ExtArgs> = {}>(args?: Subset<T, top_pages$accountsArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the top_pages model
   */
  interface top_pagesFieldRefs {
    readonly id: FieldRef<"top_pages", 'Int'>
    readonly account_id: FieldRef<"top_pages", 'Int'>
    readonly url: FieldRef<"top_pages", 'String'>
    readonly title: FieldRef<"top_pages", 'String'>
    readonly pageviews: FieldRef<"top_pages", 'Int'>
    readonly avg_time_on_page: FieldRef<"top_pages", 'Int'>
    readonly bounce_rate: FieldRef<"top_pages", 'Decimal'>
    readonly created_at: FieldRef<"top_pages", 'DateTime'>
    readonly updated_at: FieldRef<"top_pages", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * top_pages findUnique
   */
  export type top_pagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * Filter, which top_pages to fetch.
     */
    where: top_pagesWhereUniqueInput
  }

  /**
   * top_pages findUniqueOrThrow
   */
  export type top_pagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * Filter, which top_pages to fetch.
     */
    where: top_pagesWhereUniqueInput
  }

  /**
   * top_pages findFirst
   */
  export type top_pagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * Filter, which top_pages to fetch.
     */
    where?: top_pagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of top_pages to fetch.
     */
    orderBy?: top_pagesOrderByWithRelationInput | top_pagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for top_pages.
     */
    cursor?: top_pagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` top_pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` top_pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of top_pages.
     */
    distinct?: Top_pagesScalarFieldEnum | Top_pagesScalarFieldEnum[]
  }

  /**
   * top_pages findFirstOrThrow
   */
  export type top_pagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * Filter, which top_pages to fetch.
     */
    where?: top_pagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of top_pages to fetch.
     */
    orderBy?: top_pagesOrderByWithRelationInput | top_pagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for top_pages.
     */
    cursor?: top_pagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` top_pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` top_pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of top_pages.
     */
    distinct?: Top_pagesScalarFieldEnum | Top_pagesScalarFieldEnum[]
  }

  /**
   * top_pages findMany
   */
  export type top_pagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * Filter, which top_pages to fetch.
     */
    where?: top_pagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of top_pages to fetch.
     */
    orderBy?: top_pagesOrderByWithRelationInput | top_pagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing top_pages.
     */
    cursor?: top_pagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` top_pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` top_pages.
     */
    skip?: number
    distinct?: Top_pagesScalarFieldEnum | Top_pagesScalarFieldEnum[]
  }

  /**
   * top_pages create
   */
  export type top_pagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * The data needed to create a top_pages.
     */
    data: XOR<top_pagesCreateInput, top_pagesUncheckedCreateInput>
  }

  /**
   * top_pages createMany
   */
  export type top_pagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many top_pages.
     */
    data: top_pagesCreateManyInput | top_pagesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * top_pages createManyAndReturn
   */
  export type top_pagesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * The data used to create many top_pages.
     */
    data: top_pagesCreateManyInput | top_pagesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * top_pages update
   */
  export type top_pagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * The data needed to update a top_pages.
     */
    data: XOR<top_pagesUpdateInput, top_pagesUncheckedUpdateInput>
    /**
     * Choose, which top_pages to update.
     */
    where: top_pagesWhereUniqueInput
  }

  /**
   * top_pages updateMany
   */
  export type top_pagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update top_pages.
     */
    data: XOR<top_pagesUpdateManyMutationInput, top_pagesUncheckedUpdateManyInput>
    /**
     * Filter which top_pages to update
     */
    where?: top_pagesWhereInput
    /**
     * Limit how many top_pages to update.
     */
    limit?: number
  }

  /**
   * top_pages updateManyAndReturn
   */
  export type top_pagesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * The data used to update top_pages.
     */
    data: XOR<top_pagesUpdateManyMutationInput, top_pagesUncheckedUpdateManyInput>
    /**
     * Filter which top_pages to update
     */
    where?: top_pagesWhereInput
    /**
     * Limit how many top_pages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * top_pages upsert
   */
  export type top_pagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * The filter to search for the top_pages to update in case it exists.
     */
    where: top_pagesWhereUniqueInput
    /**
     * In case the top_pages found by the `where` argument doesn't exist, create a new top_pages with this data.
     */
    create: XOR<top_pagesCreateInput, top_pagesUncheckedCreateInput>
    /**
     * In case the top_pages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<top_pagesUpdateInput, top_pagesUncheckedUpdateInput>
  }

  /**
   * top_pages delete
   */
  export type top_pagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
    /**
     * Filter which top_pages to delete.
     */
    where: top_pagesWhereUniqueInput
  }

  /**
   * top_pages deleteMany
   */
  export type top_pagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which top_pages to delete
     */
    where?: top_pagesWhereInput
    /**
     * Limit how many top_pages to delete.
     */
    limit?: number
  }

  /**
   * top_pages.accounts
   */
  export type top_pages$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    where?: accountsWhereInput
  }

  /**
   * top_pages without action
   */
  export type top_pagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the top_pages
     */
    select?: top_pagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the top_pages
     */
    omit?: top_pagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: top_pagesInclude<ExtArgs> | null
  }


  /**
   * Model user_accounts
   */

  export type AggregateUser_accounts = {
    _count: User_accountsCountAggregateOutputType | null
    _avg: User_accountsAvgAggregateOutputType | null
    _sum: User_accountsSumAggregateOutputType | null
    _min: User_accountsMinAggregateOutputType | null
    _max: User_accountsMaxAggregateOutputType | null
  }

  export type User_accountsAvgAggregateOutputType = {
    user_id: number | null
  }

  export type User_accountsSumAggregateOutputType = {
    user_id: number | null
  }

  export type User_accountsMinAggregateOutputType = {
    user_id: number | null
    account_id: string | null
  }

  export type User_accountsMaxAggregateOutputType = {
    user_id: number | null
    account_id: string | null
  }

  export type User_accountsCountAggregateOutputType = {
    user_id: number
    account_id: number
    _all: number
  }


  export type User_accountsAvgAggregateInputType = {
    user_id?: true
  }

  export type User_accountsSumAggregateInputType = {
    user_id?: true
  }

  export type User_accountsMinAggregateInputType = {
    user_id?: true
    account_id?: true
  }

  export type User_accountsMaxAggregateInputType = {
    user_id?: true
    account_id?: true
  }

  export type User_accountsCountAggregateInputType = {
    user_id?: true
    account_id?: true
    _all?: true
  }

  export type User_accountsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_accounts to aggregate.
     */
    where?: user_accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_accounts to fetch.
     */
    orderBy?: user_accountsOrderByWithRelationInput | user_accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_accounts
    **/
    _count?: true | User_accountsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_accountsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_accountsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_accountsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_accountsMaxAggregateInputType
  }

  export type GetUser_accountsAggregateType<T extends User_accountsAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_accounts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_accounts[P]>
      : GetScalarType<T[P], AggregateUser_accounts[P]>
  }




  export type user_accountsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_accountsWhereInput
    orderBy?: user_accountsOrderByWithAggregationInput | user_accountsOrderByWithAggregationInput[]
    by: User_accountsScalarFieldEnum[] | User_accountsScalarFieldEnum
    having?: user_accountsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_accountsCountAggregateInputType | true
    _avg?: User_accountsAvgAggregateInputType
    _sum?: User_accountsSumAggregateInputType
    _min?: User_accountsMinAggregateInputType
    _max?: User_accountsMaxAggregateInputType
  }

  export type User_accountsGroupByOutputType = {
    user_id: number
    account_id: string
    _count: User_accountsCountAggregateOutputType | null
    _avg: User_accountsAvgAggregateOutputType | null
    _sum: User_accountsSumAggregateOutputType | null
    _min: User_accountsMinAggregateOutputType | null
    _max: User_accountsMaxAggregateOutputType | null
  }

  type GetUser_accountsGroupByPayload<T extends user_accountsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_accountsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_accountsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_accountsGroupByOutputType[P]>
            : GetScalarType<T[P], User_accountsGroupByOutputType[P]>
        }
      >
    >


  export type user_accountsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    account_id?: boolean
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_accounts"]>

  export type user_accountsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    account_id?: boolean
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_accounts"]>

  export type user_accountsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    account_id?: boolean
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_accounts"]>

  export type user_accountsSelectScalar = {
    user_id?: boolean
    account_id?: boolean
  }

  export type user_accountsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "account_id", ExtArgs["result"]["user_accounts"]>
  export type user_accountsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type user_accountsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type user_accountsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $user_accountsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_accounts"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs>
      users: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: number
      account_id: string
    }, ExtArgs["result"]["user_accounts"]>
    composites: {}
  }

  type user_accountsGetPayload<S extends boolean | null | undefined | user_accountsDefaultArgs> = $Result.GetResult<Prisma.$user_accountsPayload, S>

  type user_accountsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_accountsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: User_accountsCountAggregateInputType | true
    }

  export interface user_accountsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_accounts'], meta: { name: 'user_accounts' } }
    /**
     * Find zero or one User_accounts that matches the filter.
     * @param {user_accountsFindUniqueArgs} args - Arguments to find a User_accounts
     * @example
     * // Get one User_accounts
     * const user_accounts = await prisma.user_accounts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_accountsFindUniqueArgs>(args: SelectSubset<T, user_accountsFindUniqueArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_accounts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_accountsFindUniqueOrThrowArgs} args - Arguments to find a User_accounts
     * @example
     * // Get one User_accounts
     * const user_accounts = await prisma.user_accounts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_accountsFindUniqueOrThrowArgs>(args: SelectSubset<T, user_accountsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_accountsFindFirstArgs} args - Arguments to find a User_accounts
     * @example
     * // Get one User_accounts
     * const user_accounts = await prisma.user_accounts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_accountsFindFirstArgs>(args?: SelectSubset<T, user_accountsFindFirstArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_accounts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_accountsFindFirstOrThrowArgs} args - Arguments to find a User_accounts
     * @example
     * // Get one User_accounts
     * const user_accounts = await prisma.user_accounts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_accountsFindFirstOrThrowArgs>(args?: SelectSubset<T, user_accountsFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_accountsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_accounts
     * const user_accounts = await prisma.user_accounts.findMany()
     * 
     * // Get first 10 User_accounts
     * const user_accounts = await prisma.user_accounts.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const user_accountsWithUser_idOnly = await prisma.user_accounts.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends user_accountsFindManyArgs>(args?: SelectSubset<T, user_accountsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_accounts.
     * @param {user_accountsCreateArgs} args - Arguments to create a User_accounts.
     * @example
     * // Create one User_accounts
     * const User_accounts = await prisma.user_accounts.create({
     *   data: {
     *     // ... data to create a User_accounts
     *   }
     * })
     * 
     */
    create<T extends user_accountsCreateArgs>(args: SelectSubset<T, user_accountsCreateArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_accounts.
     * @param {user_accountsCreateManyArgs} args - Arguments to create many User_accounts.
     * @example
     * // Create many User_accounts
     * const user_accounts = await prisma.user_accounts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_accountsCreateManyArgs>(args?: SelectSubset<T, user_accountsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_accounts and returns the data saved in the database.
     * @param {user_accountsCreateManyAndReturnArgs} args - Arguments to create many User_accounts.
     * @example
     * // Create many User_accounts
     * const user_accounts = await prisma.user_accounts.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_accounts and only return the `user_id`
     * const user_accountsWithUser_idOnly = await prisma.user_accounts.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_accountsCreateManyAndReturnArgs>(args?: SelectSubset<T, user_accountsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User_accounts.
     * @param {user_accountsDeleteArgs} args - Arguments to delete one User_accounts.
     * @example
     * // Delete one User_accounts
     * const User_accounts = await prisma.user_accounts.delete({
     *   where: {
     *     // ... filter to delete one User_accounts
     *   }
     * })
     * 
     */
    delete<T extends user_accountsDeleteArgs>(args: SelectSubset<T, user_accountsDeleteArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_accounts.
     * @param {user_accountsUpdateArgs} args - Arguments to update one User_accounts.
     * @example
     * // Update one User_accounts
     * const user_accounts = await prisma.user_accounts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_accountsUpdateArgs>(args: SelectSubset<T, user_accountsUpdateArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_accounts.
     * @param {user_accountsDeleteManyArgs} args - Arguments to filter User_accounts to delete.
     * @example
     * // Delete a few User_accounts
     * const { count } = await prisma.user_accounts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_accountsDeleteManyArgs>(args?: SelectSubset<T, user_accountsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_accountsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_accounts
     * const user_accounts = await prisma.user_accounts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_accountsUpdateManyArgs>(args: SelectSubset<T, user_accountsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_accounts and returns the data updated in the database.
     * @param {user_accountsUpdateManyAndReturnArgs} args - Arguments to update many User_accounts.
     * @example
     * // Update many User_accounts
     * const user_accounts = await prisma.user_accounts.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more User_accounts and only return the `user_id`
     * const user_accountsWithUser_idOnly = await prisma.user_accounts.updateManyAndReturn({
     *   select: { user_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends user_accountsUpdateManyAndReturnArgs>(args: SelectSubset<T, user_accountsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User_accounts.
     * @param {user_accountsUpsertArgs} args - Arguments to update or create a User_accounts.
     * @example
     * // Update or create a User_accounts
     * const user_accounts = await prisma.user_accounts.upsert({
     *   create: {
     *     // ... data to create a User_accounts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_accounts we want to update
     *   }
     * })
     */
    upsert<T extends user_accountsUpsertArgs>(args: SelectSubset<T, user_accountsUpsertArgs<ExtArgs>>): Prisma__user_accountsClient<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_accountsCountArgs} args - Arguments to filter User_accounts to count.
     * @example
     * // Count the number of User_accounts
     * const count = await prisma.user_accounts.count({
     *   where: {
     *     // ... the filter for the User_accounts we want to count
     *   }
     * })
    **/
    count<T extends user_accountsCountArgs>(
      args?: Subset<T, user_accountsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_accountsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_accountsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_accountsAggregateArgs>(args: Subset<T, User_accountsAggregateArgs>): Prisma.PrismaPromise<GetUser_accountsAggregateType<T>>

    /**
     * Group by User_accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_accountsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_accountsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_accountsGroupByArgs['orderBy'] }
        : { orderBy?: user_accountsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_accountsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_accountsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_accounts model
   */
  readonly fields: user_accountsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_accounts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_accountsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends accountsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, accountsDefaultArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_accounts model
   */
  interface user_accountsFieldRefs {
    readonly user_id: FieldRef<"user_accounts", 'Int'>
    readonly account_id: FieldRef<"user_accounts", 'String'>
  }
    

  // Custom InputTypes
  /**
   * user_accounts findUnique
   */
  export type user_accountsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * Filter, which user_accounts to fetch.
     */
    where: user_accountsWhereUniqueInput
  }

  /**
   * user_accounts findUniqueOrThrow
   */
  export type user_accountsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * Filter, which user_accounts to fetch.
     */
    where: user_accountsWhereUniqueInput
  }

  /**
   * user_accounts findFirst
   */
  export type user_accountsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * Filter, which user_accounts to fetch.
     */
    where?: user_accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_accounts to fetch.
     */
    orderBy?: user_accountsOrderByWithRelationInput | user_accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_accounts.
     */
    cursor?: user_accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_accounts.
     */
    distinct?: User_accountsScalarFieldEnum | User_accountsScalarFieldEnum[]
  }

  /**
   * user_accounts findFirstOrThrow
   */
  export type user_accountsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * Filter, which user_accounts to fetch.
     */
    where?: user_accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_accounts to fetch.
     */
    orderBy?: user_accountsOrderByWithRelationInput | user_accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_accounts.
     */
    cursor?: user_accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_accounts.
     */
    distinct?: User_accountsScalarFieldEnum | User_accountsScalarFieldEnum[]
  }

  /**
   * user_accounts findMany
   */
  export type user_accountsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * Filter, which user_accounts to fetch.
     */
    where?: user_accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_accounts to fetch.
     */
    orderBy?: user_accountsOrderByWithRelationInput | user_accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_accounts.
     */
    cursor?: user_accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_accounts.
     */
    skip?: number
    distinct?: User_accountsScalarFieldEnum | User_accountsScalarFieldEnum[]
  }

  /**
   * user_accounts create
   */
  export type user_accountsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * The data needed to create a user_accounts.
     */
    data: XOR<user_accountsCreateInput, user_accountsUncheckedCreateInput>
  }

  /**
   * user_accounts createMany
   */
  export type user_accountsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_accounts.
     */
    data: user_accountsCreateManyInput | user_accountsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_accounts createManyAndReturn
   */
  export type user_accountsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * The data used to create many user_accounts.
     */
    data: user_accountsCreateManyInput | user_accountsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_accounts update
   */
  export type user_accountsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * The data needed to update a user_accounts.
     */
    data: XOR<user_accountsUpdateInput, user_accountsUncheckedUpdateInput>
    /**
     * Choose, which user_accounts to update.
     */
    where: user_accountsWhereUniqueInput
  }

  /**
   * user_accounts updateMany
   */
  export type user_accountsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_accounts.
     */
    data: XOR<user_accountsUpdateManyMutationInput, user_accountsUncheckedUpdateManyInput>
    /**
     * Filter which user_accounts to update
     */
    where?: user_accountsWhereInput
    /**
     * Limit how many user_accounts to update.
     */
    limit?: number
  }

  /**
   * user_accounts updateManyAndReturn
   */
  export type user_accountsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * The data used to update user_accounts.
     */
    data: XOR<user_accountsUpdateManyMutationInput, user_accountsUncheckedUpdateManyInput>
    /**
     * Filter which user_accounts to update
     */
    where?: user_accountsWhereInput
    /**
     * Limit how many user_accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_accounts upsert
   */
  export type user_accountsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * The filter to search for the user_accounts to update in case it exists.
     */
    where: user_accountsWhereUniqueInput
    /**
     * In case the user_accounts found by the `where` argument doesn't exist, create a new user_accounts with this data.
     */
    create: XOR<user_accountsCreateInput, user_accountsUncheckedCreateInput>
    /**
     * In case the user_accounts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_accountsUpdateInput, user_accountsUncheckedUpdateInput>
  }

  /**
   * user_accounts delete
   */
  export type user_accountsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    /**
     * Filter which user_accounts to delete.
     */
    where: user_accountsWhereUniqueInput
  }

  /**
   * user_accounts deleteMany
   */
  export type user_accountsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_accounts to delete
     */
    where?: user_accountsWhereInput
    /**
     * Limit how many user_accounts to delete.
     */
    limit?: number
  }

  /**
   * user_accounts without action
   */
  export type user_accountsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
  }


  /**
   * Model user_activity
   */

  export type AggregateUser_activity = {
    _count: User_activityCountAggregateOutputType | null
    _avg: User_activityAvgAggregateOutputType | null
    _sum: User_activitySumAggregateOutputType | null
    _min: User_activityMinAggregateOutputType | null
    _max: User_activityMaxAggregateOutputType | null
  }

  export type User_activityAvgAggregateOutputType = {
    id: number | null
    user_id: number | null
    logins: number | null
    pageviews: number | null
  }

  export type User_activitySumAggregateOutputType = {
    id: number | null
    user_id: number | null
    logins: number | null
    pageviews: number | null
  }

  export type User_activityMinAggregateOutputType = {
    id: number | null
    user_id: number | null
    date: Date | null
    logins: number | null
    pageviews: number | null
    created_at: Date | null
  }

  export type User_activityMaxAggregateOutputType = {
    id: number | null
    user_id: number | null
    date: Date | null
    logins: number | null
    pageviews: number | null
    created_at: Date | null
  }

  export type User_activityCountAggregateOutputType = {
    id: number
    user_id: number
    date: number
    logins: number
    pageviews: number
    created_at: number
    _all: number
  }


  export type User_activityAvgAggregateInputType = {
    id?: true
    user_id?: true
    logins?: true
    pageviews?: true
  }

  export type User_activitySumAggregateInputType = {
    id?: true
    user_id?: true
    logins?: true
    pageviews?: true
  }

  export type User_activityMinAggregateInputType = {
    id?: true
    user_id?: true
    date?: true
    logins?: true
    pageviews?: true
    created_at?: true
  }

  export type User_activityMaxAggregateInputType = {
    id?: true
    user_id?: true
    date?: true
    logins?: true
    pageviews?: true
    created_at?: true
  }

  export type User_activityCountAggregateInputType = {
    id?: true
    user_id?: true
    date?: true
    logins?: true
    pageviews?: true
    created_at?: true
    _all?: true
  }

  export type User_activityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_activity to aggregate.
     */
    where?: user_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_activities to fetch.
     */
    orderBy?: user_activityOrderByWithRelationInput | user_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_activities
    **/
    _count?: true | User_activityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_activityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_activitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_activityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_activityMaxAggregateInputType
  }

  export type GetUser_activityAggregateType<T extends User_activityAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_activity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_activity[P]>
      : GetScalarType<T[P], AggregateUser_activity[P]>
  }




  export type user_activityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_activityWhereInput
    orderBy?: user_activityOrderByWithAggregationInput | user_activityOrderByWithAggregationInput[]
    by: User_activityScalarFieldEnum[] | User_activityScalarFieldEnum
    having?: user_activityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_activityCountAggregateInputType | true
    _avg?: User_activityAvgAggregateInputType
    _sum?: User_activitySumAggregateInputType
    _min?: User_activityMinAggregateInputType
    _max?: User_activityMaxAggregateInputType
  }

  export type User_activityGroupByOutputType = {
    id: number
    user_id: number | null
    date: Date
    logins: number | null
    pageviews: number | null
    created_at: Date | null
    _count: User_activityCountAggregateOutputType | null
    _avg: User_activityAvgAggregateOutputType | null
    _sum: User_activitySumAggregateOutputType | null
    _min: User_activityMinAggregateOutputType | null
    _max: User_activityMaxAggregateOutputType | null
  }

  type GetUser_activityGroupByPayload<T extends user_activityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_activityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_activityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_activityGroupByOutputType[P]>
            : GetScalarType<T[P], User_activityGroupByOutputType[P]>
        }
      >
    >


  export type user_activitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    date?: boolean
    logins?: boolean
    pageviews?: boolean
    created_at?: boolean
    users?: boolean | user_activity$usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_activity"]>

  export type user_activitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    date?: boolean
    logins?: boolean
    pageviews?: boolean
    created_at?: boolean
    users?: boolean | user_activity$usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_activity"]>

  export type user_activitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    date?: boolean
    logins?: boolean
    pageviews?: boolean
    created_at?: boolean
    users?: boolean | user_activity$usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_activity"]>

  export type user_activitySelectScalar = {
    id?: boolean
    user_id?: boolean
    date?: boolean
    logins?: boolean
    pageviews?: boolean
    created_at?: boolean
  }

  export type user_activityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "date" | "logins" | "pageviews" | "created_at", ExtArgs["result"]["user_activity"]>
  export type user_activityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | user_activity$usersArgs<ExtArgs>
  }
  export type user_activityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | user_activity$usersArgs<ExtArgs>
  }
  export type user_activityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | user_activity$usersArgs<ExtArgs>
  }

  export type $user_activityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_activity"
    objects: {
      users: Prisma.$usersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_id: number | null
      date: Date
      logins: number | null
      pageviews: number | null
      created_at: Date | null
    }, ExtArgs["result"]["user_activity"]>
    composites: {}
  }

  type user_activityGetPayload<S extends boolean | null | undefined | user_activityDefaultArgs> = $Result.GetResult<Prisma.$user_activityPayload, S>

  type user_activityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_activityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: User_activityCountAggregateInputType | true
    }

  export interface user_activityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_activity'], meta: { name: 'user_activity' } }
    /**
     * Find zero or one User_activity that matches the filter.
     * @param {user_activityFindUniqueArgs} args - Arguments to find a User_activity
     * @example
     * // Get one User_activity
     * const user_activity = await prisma.user_activity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_activityFindUniqueArgs>(args: SelectSubset<T, user_activityFindUniqueArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_activity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_activityFindUniqueOrThrowArgs} args - Arguments to find a User_activity
     * @example
     * // Get one User_activity
     * const user_activity = await prisma.user_activity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_activityFindUniqueOrThrowArgs>(args: SelectSubset<T, user_activityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_activity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_activityFindFirstArgs} args - Arguments to find a User_activity
     * @example
     * // Get one User_activity
     * const user_activity = await prisma.user_activity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_activityFindFirstArgs>(args?: SelectSubset<T, user_activityFindFirstArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_activity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_activityFindFirstOrThrowArgs} args - Arguments to find a User_activity
     * @example
     * // Get one User_activity
     * const user_activity = await prisma.user_activity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_activityFindFirstOrThrowArgs>(args?: SelectSubset<T, user_activityFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_activities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_activityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_activities
     * const user_activities = await prisma.user_activity.findMany()
     * 
     * // Get first 10 User_activities
     * const user_activities = await prisma.user_activity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const user_activityWithIdOnly = await prisma.user_activity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends user_activityFindManyArgs>(args?: SelectSubset<T, user_activityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_activity.
     * @param {user_activityCreateArgs} args - Arguments to create a User_activity.
     * @example
     * // Create one User_activity
     * const User_activity = await prisma.user_activity.create({
     *   data: {
     *     // ... data to create a User_activity
     *   }
     * })
     * 
     */
    create<T extends user_activityCreateArgs>(args: SelectSubset<T, user_activityCreateArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_activities.
     * @param {user_activityCreateManyArgs} args - Arguments to create many User_activities.
     * @example
     * // Create many User_activities
     * const user_activity = await prisma.user_activity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_activityCreateManyArgs>(args?: SelectSubset<T, user_activityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_activities and returns the data saved in the database.
     * @param {user_activityCreateManyAndReturnArgs} args - Arguments to create many User_activities.
     * @example
     * // Create many User_activities
     * const user_activity = await prisma.user_activity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_activities and only return the `id`
     * const user_activityWithIdOnly = await prisma.user_activity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_activityCreateManyAndReturnArgs>(args?: SelectSubset<T, user_activityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User_activity.
     * @param {user_activityDeleteArgs} args - Arguments to delete one User_activity.
     * @example
     * // Delete one User_activity
     * const User_activity = await prisma.user_activity.delete({
     *   where: {
     *     // ... filter to delete one User_activity
     *   }
     * })
     * 
     */
    delete<T extends user_activityDeleteArgs>(args: SelectSubset<T, user_activityDeleteArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_activity.
     * @param {user_activityUpdateArgs} args - Arguments to update one User_activity.
     * @example
     * // Update one User_activity
     * const user_activity = await prisma.user_activity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_activityUpdateArgs>(args: SelectSubset<T, user_activityUpdateArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_activities.
     * @param {user_activityDeleteManyArgs} args - Arguments to filter User_activities to delete.
     * @example
     * // Delete a few User_activities
     * const { count } = await prisma.user_activity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_activityDeleteManyArgs>(args?: SelectSubset<T, user_activityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_activityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_activities
     * const user_activity = await prisma.user_activity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_activityUpdateManyArgs>(args: SelectSubset<T, user_activityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_activities and returns the data updated in the database.
     * @param {user_activityUpdateManyAndReturnArgs} args - Arguments to update many User_activities.
     * @example
     * // Update many User_activities
     * const user_activity = await prisma.user_activity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more User_activities and only return the `id`
     * const user_activityWithIdOnly = await prisma.user_activity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends user_activityUpdateManyAndReturnArgs>(args: SelectSubset<T, user_activityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User_activity.
     * @param {user_activityUpsertArgs} args - Arguments to update or create a User_activity.
     * @example
     * // Update or create a User_activity
     * const user_activity = await prisma.user_activity.upsert({
     *   create: {
     *     // ... data to create a User_activity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_activity we want to update
     *   }
     * })
     */
    upsert<T extends user_activityUpsertArgs>(args: SelectSubset<T, user_activityUpsertArgs<ExtArgs>>): Prisma__user_activityClient<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_activityCountArgs} args - Arguments to filter User_activities to count.
     * @example
     * // Count the number of User_activities
     * const count = await prisma.user_activity.count({
     *   where: {
     *     // ... the filter for the User_activities we want to count
     *   }
     * })
    **/
    count<T extends user_activityCountArgs>(
      args?: Subset<T, user_activityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_activityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_activityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_activityAggregateArgs>(args: Subset<T, User_activityAggregateArgs>): Prisma.PrismaPromise<GetUser_activityAggregateType<T>>

    /**
     * Group by User_activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_activityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_activityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_activityGroupByArgs['orderBy'] }
        : { orderBy?: user_activityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_activityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_activityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_activity model
   */
  readonly fields: user_activityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_activity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_activityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends user_activity$usersArgs<ExtArgs> = {}>(args?: Subset<T, user_activity$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_activity model
   */
  interface user_activityFieldRefs {
    readonly id: FieldRef<"user_activity", 'Int'>
    readonly user_id: FieldRef<"user_activity", 'Int'>
    readonly date: FieldRef<"user_activity", 'DateTime'>
    readonly logins: FieldRef<"user_activity", 'Int'>
    readonly pageviews: FieldRef<"user_activity", 'Int'>
    readonly created_at: FieldRef<"user_activity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_activity findUnique
   */
  export type user_activityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * Filter, which user_activity to fetch.
     */
    where: user_activityWhereUniqueInput
  }

  /**
   * user_activity findUniqueOrThrow
   */
  export type user_activityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * Filter, which user_activity to fetch.
     */
    where: user_activityWhereUniqueInput
  }

  /**
   * user_activity findFirst
   */
  export type user_activityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * Filter, which user_activity to fetch.
     */
    where?: user_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_activities to fetch.
     */
    orderBy?: user_activityOrderByWithRelationInput | user_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_activities.
     */
    cursor?: user_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_activities.
     */
    distinct?: User_activityScalarFieldEnum | User_activityScalarFieldEnum[]
  }

  /**
   * user_activity findFirstOrThrow
   */
  export type user_activityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * Filter, which user_activity to fetch.
     */
    where?: user_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_activities to fetch.
     */
    orderBy?: user_activityOrderByWithRelationInput | user_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_activities.
     */
    cursor?: user_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_activities.
     */
    distinct?: User_activityScalarFieldEnum | User_activityScalarFieldEnum[]
  }

  /**
   * user_activity findMany
   */
  export type user_activityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * Filter, which user_activities to fetch.
     */
    where?: user_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_activities to fetch.
     */
    orderBy?: user_activityOrderByWithRelationInput | user_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_activities.
     */
    cursor?: user_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_activities.
     */
    skip?: number
    distinct?: User_activityScalarFieldEnum | User_activityScalarFieldEnum[]
  }

  /**
   * user_activity create
   */
  export type user_activityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * The data needed to create a user_activity.
     */
    data: XOR<user_activityCreateInput, user_activityUncheckedCreateInput>
  }

  /**
   * user_activity createMany
   */
  export type user_activityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_activities.
     */
    data: user_activityCreateManyInput | user_activityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_activity createManyAndReturn
   */
  export type user_activityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * The data used to create many user_activities.
     */
    data: user_activityCreateManyInput | user_activityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_activity update
   */
  export type user_activityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * The data needed to update a user_activity.
     */
    data: XOR<user_activityUpdateInput, user_activityUncheckedUpdateInput>
    /**
     * Choose, which user_activity to update.
     */
    where: user_activityWhereUniqueInput
  }

  /**
   * user_activity updateMany
   */
  export type user_activityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_activities.
     */
    data: XOR<user_activityUpdateManyMutationInput, user_activityUncheckedUpdateManyInput>
    /**
     * Filter which user_activities to update
     */
    where?: user_activityWhereInput
    /**
     * Limit how many user_activities to update.
     */
    limit?: number
  }

  /**
   * user_activity updateManyAndReturn
   */
  export type user_activityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * The data used to update user_activities.
     */
    data: XOR<user_activityUpdateManyMutationInput, user_activityUncheckedUpdateManyInput>
    /**
     * Filter which user_activities to update
     */
    where?: user_activityWhereInput
    /**
     * Limit how many user_activities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_activity upsert
   */
  export type user_activityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * The filter to search for the user_activity to update in case it exists.
     */
    where: user_activityWhereUniqueInput
    /**
     * In case the user_activity found by the `where` argument doesn't exist, create a new user_activity with this data.
     */
    create: XOR<user_activityCreateInput, user_activityUncheckedCreateInput>
    /**
     * In case the user_activity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_activityUpdateInput, user_activityUncheckedUpdateInput>
  }

  /**
   * user_activity delete
   */
  export type user_activityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    /**
     * Filter which user_activity to delete.
     */
    where: user_activityWhereUniqueInput
  }

  /**
   * user_activity deleteMany
   */
  export type user_activityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_activities to delete
     */
    where?: user_activityWhereInput
    /**
     * Limit how many user_activities to delete.
     */
    limit?: number
  }

  /**
   * user_activity.users
   */
  export type user_activity$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * user_activity without action
   */
  export type user_activityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
  }


  /**
   * Model user_newsletters
   */

  export type AggregateUser_newsletters = {
    _count: User_newslettersCountAggregateOutputType | null
    _avg: User_newslettersAvgAggregateOutputType | null
    _sum: User_newslettersSumAggregateOutputType | null
    _min: User_newslettersMinAggregateOutputType | null
    _max: User_newslettersMaxAggregateOutputType | null
  }

  export type User_newslettersAvgAggregateOutputType = {
    id: number | null
    user_id: number | null
    newsletter_id: number | null
    open_rate: Decimal | null
    click_rate: Decimal | null
  }

  export type User_newslettersSumAggregateOutputType = {
    id: number | null
    user_id: number | null
    newsletter_id: number | null
    open_rate: Decimal | null
    click_rate: Decimal | null
  }

  export type User_newslettersMinAggregateOutputType = {
    id: number | null
    user_id: number | null
    newsletter_id: number | null
    subscribed: boolean | null
    open_rate: Decimal | null
    click_rate: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type User_newslettersMaxAggregateOutputType = {
    id: number | null
    user_id: number | null
    newsletter_id: number | null
    subscribed: boolean | null
    open_rate: Decimal | null
    click_rate: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type User_newslettersCountAggregateOutputType = {
    id: number
    user_id: number
    newsletter_id: number
    subscribed: number
    open_rate: number
    click_rate: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type User_newslettersAvgAggregateInputType = {
    id?: true
    user_id?: true
    newsletter_id?: true
    open_rate?: true
    click_rate?: true
  }

  export type User_newslettersSumAggregateInputType = {
    id?: true
    user_id?: true
    newsletter_id?: true
    open_rate?: true
    click_rate?: true
  }

  export type User_newslettersMinAggregateInputType = {
    id?: true
    user_id?: true
    newsletter_id?: true
    subscribed?: true
    open_rate?: true
    click_rate?: true
    created_at?: true
    updated_at?: true
  }

  export type User_newslettersMaxAggregateInputType = {
    id?: true
    user_id?: true
    newsletter_id?: true
    subscribed?: true
    open_rate?: true
    click_rate?: true
    created_at?: true
    updated_at?: true
  }

  export type User_newslettersCountAggregateInputType = {
    id?: true
    user_id?: true
    newsletter_id?: true
    subscribed?: true
    open_rate?: true
    click_rate?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type User_newslettersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_newsletters to aggregate.
     */
    where?: user_newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_newsletters to fetch.
     */
    orderBy?: user_newslettersOrderByWithRelationInput | user_newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_newsletters
    **/
    _count?: true | User_newslettersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_newslettersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_newslettersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_newslettersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_newslettersMaxAggregateInputType
  }

  export type GetUser_newslettersAggregateType<T extends User_newslettersAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_newsletters]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_newsletters[P]>
      : GetScalarType<T[P], AggregateUser_newsletters[P]>
  }




  export type user_newslettersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_newslettersWhereInput
    orderBy?: user_newslettersOrderByWithAggregationInput | user_newslettersOrderByWithAggregationInput[]
    by: User_newslettersScalarFieldEnum[] | User_newslettersScalarFieldEnum
    having?: user_newslettersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_newslettersCountAggregateInputType | true
    _avg?: User_newslettersAvgAggregateInputType
    _sum?: User_newslettersSumAggregateInputType
    _min?: User_newslettersMinAggregateInputType
    _max?: User_newslettersMaxAggregateInputType
  }

  export type User_newslettersGroupByOutputType = {
    id: number
    user_id: number | null
    newsletter_id: number | null
    subscribed: boolean | null
    open_rate: Decimal | null
    click_rate: Decimal | null
    created_at: Date | null
    updated_at: Date | null
    _count: User_newslettersCountAggregateOutputType | null
    _avg: User_newslettersAvgAggregateOutputType | null
    _sum: User_newslettersSumAggregateOutputType | null
    _min: User_newslettersMinAggregateOutputType | null
    _max: User_newslettersMaxAggregateOutputType | null
  }

  type GetUser_newslettersGroupByPayload<T extends user_newslettersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_newslettersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_newslettersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_newslettersGroupByOutputType[P]>
            : GetScalarType<T[P], User_newslettersGroupByOutputType[P]>
        }
      >
    >


  export type user_newslettersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    newsletter_id?: boolean
    subscribed?: boolean
    open_rate?: boolean
    click_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
    newsletters?: boolean | user_newsletters$newslettersArgs<ExtArgs>
    users?: boolean | user_newsletters$usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_newsletters"]>

  export type user_newslettersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    newsletter_id?: boolean
    subscribed?: boolean
    open_rate?: boolean
    click_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
    newsletters?: boolean | user_newsletters$newslettersArgs<ExtArgs>
    users?: boolean | user_newsletters$usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_newsletters"]>

  export type user_newslettersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    newsletter_id?: boolean
    subscribed?: boolean
    open_rate?: boolean
    click_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
    newsletters?: boolean | user_newsletters$newslettersArgs<ExtArgs>
    users?: boolean | user_newsletters$usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_newsletters"]>

  export type user_newslettersSelectScalar = {
    id?: boolean
    user_id?: boolean
    newsletter_id?: boolean
    subscribed?: boolean
    open_rate?: boolean
    click_rate?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type user_newslettersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "newsletter_id" | "subscribed" | "open_rate" | "click_rate" | "created_at" | "updated_at", ExtArgs["result"]["user_newsletters"]>
  export type user_newslettersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsletters?: boolean | user_newsletters$newslettersArgs<ExtArgs>
    users?: boolean | user_newsletters$usersArgs<ExtArgs>
  }
  export type user_newslettersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsletters?: boolean | user_newsletters$newslettersArgs<ExtArgs>
    users?: boolean | user_newsletters$usersArgs<ExtArgs>
  }
  export type user_newslettersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsletters?: boolean | user_newsletters$newslettersArgs<ExtArgs>
    users?: boolean | user_newsletters$usersArgs<ExtArgs>
  }

  export type $user_newslettersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_newsletters"
    objects: {
      newsletters: Prisma.$newslettersPayload<ExtArgs> | null
      users: Prisma.$usersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_id: number | null
      newsletter_id: number | null
      subscribed: boolean | null
      open_rate: Prisma.Decimal | null
      click_rate: Prisma.Decimal | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["user_newsletters"]>
    composites: {}
  }

  type user_newslettersGetPayload<S extends boolean | null | undefined | user_newslettersDefaultArgs> = $Result.GetResult<Prisma.$user_newslettersPayload, S>

  type user_newslettersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_newslettersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: User_newslettersCountAggregateInputType | true
    }

  export interface user_newslettersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_newsletters'], meta: { name: 'user_newsletters' } }
    /**
     * Find zero or one User_newsletters that matches the filter.
     * @param {user_newslettersFindUniqueArgs} args - Arguments to find a User_newsletters
     * @example
     * // Get one User_newsletters
     * const user_newsletters = await prisma.user_newsletters.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_newslettersFindUniqueArgs>(args: SelectSubset<T, user_newslettersFindUniqueArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_newsletters that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_newslettersFindUniqueOrThrowArgs} args - Arguments to find a User_newsletters
     * @example
     * // Get one User_newsletters
     * const user_newsletters = await prisma.user_newsletters.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_newslettersFindUniqueOrThrowArgs>(args: SelectSubset<T, user_newslettersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_newsletters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_newslettersFindFirstArgs} args - Arguments to find a User_newsletters
     * @example
     * // Get one User_newsletters
     * const user_newsletters = await prisma.user_newsletters.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_newslettersFindFirstArgs>(args?: SelectSubset<T, user_newslettersFindFirstArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_newsletters that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_newslettersFindFirstOrThrowArgs} args - Arguments to find a User_newsletters
     * @example
     * // Get one User_newsletters
     * const user_newsletters = await prisma.user_newsletters.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_newslettersFindFirstOrThrowArgs>(args?: SelectSubset<T, user_newslettersFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_newsletters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_newslettersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_newsletters
     * const user_newsletters = await prisma.user_newsletters.findMany()
     * 
     * // Get first 10 User_newsletters
     * const user_newsletters = await prisma.user_newsletters.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const user_newslettersWithIdOnly = await prisma.user_newsletters.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends user_newslettersFindManyArgs>(args?: SelectSubset<T, user_newslettersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_newsletters.
     * @param {user_newslettersCreateArgs} args - Arguments to create a User_newsletters.
     * @example
     * // Create one User_newsletters
     * const User_newsletters = await prisma.user_newsletters.create({
     *   data: {
     *     // ... data to create a User_newsletters
     *   }
     * })
     * 
     */
    create<T extends user_newslettersCreateArgs>(args: SelectSubset<T, user_newslettersCreateArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_newsletters.
     * @param {user_newslettersCreateManyArgs} args - Arguments to create many User_newsletters.
     * @example
     * // Create many User_newsletters
     * const user_newsletters = await prisma.user_newsletters.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_newslettersCreateManyArgs>(args?: SelectSubset<T, user_newslettersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_newsletters and returns the data saved in the database.
     * @param {user_newslettersCreateManyAndReturnArgs} args - Arguments to create many User_newsletters.
     * @example
     * // Create many User_newsletters
     * const user_newsletters = await prisma.user_newsletters.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_newsletters and only return the `id`
     * const user_newslettersWithIdOnly = await prisma.user_newsletters.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_newslettersCreateManyAndReturnArgs>(args?: SelectSubset<T, user_newslettersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User_newsletters.
     * @param {user_newslettersDeleteArgs} args - Arguments to delete one User_newsletters.
     * @example
     * // Delete one User_newsletters
     * const User_newsletters = await prisma.user_newsletters.delete({
     *   where: {
     *     // ... filter to delete one User_newsletters
     *   }
     * })
     * 
     */
    delete<T extends user_newslettersDeleteArgs>(args: SelectSubset<T, user_newslettersDeleteArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_newsletters.
     * @param {user_newslettersUpdateArgs} args - Arguments to update one User_newsletters.
     * @example
     * // Update one User_newsletters
     * const user_newsletters = await prisma.user_newsletters.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_newslettersUpdateArgs>(args: SelectSubset<T, user_newslettersUpdateArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_newsletters.
     * @param {user_newslettersDeleteManyArgs} args - Arguments to filter User_newsletters to delete.
     * @example
     * // Delete a few User_newsletters
     * const { count } = await prisma.user_newsletters.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_newslettersDeleteManyArgs>(args?: SelectSubset<T, user_newslettersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_newslettersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_newsletters
     * const user_newsletters = await prisma.user_newsletters.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_newslettersUpdateManyArgs>(args: SelectSubset<T, user_newslettersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_newsletters and returns the data updated in the database.
     * @param {user_newslettersUpdateManyAndReturnArgs} args - Arguments to update many User_newsletters.
     * @example
     * // Update many User_newsletters
     * const user_newsletters = await prisma.user_newsletters.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more User_newsletters and only return the `id`
     * const user_newslettersWithIdOnly = await prisma.user_newsletters.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends user_newslettersUpdateManyAndReturnArgs>(args: SelectSubset<T, user_newslettersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User_newsletters.
     * @param {user_newslettersUpsertArgs} args - Arguments to update or create a User_newsletters.
     * @example
     * // Update or create a User_newsletters
     * const user_newsletters = await prisma.user_newsletters.upsert({
     *   create: {
     *     // ... data to create a User_newsletters
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_newsletters we want to update
     *   }
     * })
     */
    upsert<T extends user_newslettersUpsertArgs>(args: SelectSubset<T, user_newslettersUpsertArgs<ExtArgs>>): Prisma__user_newslettersClient<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_newslettersCountArgs} args - Arguments to filter User_newsletters to count.
     * @example
     * // Count the number of User_newsletters
     * const count = await prisma.user_newsletters.count({
     *   where: {
     *     // ... the filter for the User_newsletters we want to count
     *   }
     * })
    **/
    count<T extends user_newslettersCountArgs>(
      args?: Subset<T, user_newslettersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_newslettersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_newslettersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_newslettersAggregateArgs>(args: Subset<T, User_newslettersAggregateArgs>): Prisma.PrismaPromise<GetUser_newslettersAggregateType<T>>

    /**
     * Group by User_newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_newslettersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_newslettersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_newslettersGroupByArgs['orderBy'] }
        : { orderBy?: user_newslettersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_newslettersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_newslettersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_newsletters model
   */
  readonly fields: user_newslettersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_newsletters.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_newslettersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    newsletters<T extends user_newsletters$newslettersArgs<ExtArgs> = {}>(args?: Subset<T, user_newsletters$newslettersArgs<ExtArgs>>): Prisma__newslettersClient<$Result.GetResult<Prisma.$newslettersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    users<T extends user_newsletters$usersArgs<ExtArgs> = {}>(args?: Subset<T, user_newsletters$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_newsletters model
   */
  interface user_newslettersFieldRefs {
    readonly id: FieldRef<"user_newsletters", 'Int'>
    readonly user_id: FieldRef<"user_newsletters", 'Int'>
    readonly newsletter_id: FieldRef<"user_newsletters", 'Int'>
    readonly subscribed: FieldRef<"user_newsletters", 'Boolean'>
    readonly open_rate: FieldRef<"user_newsletters", 'Decimal'>
    readonly click_rate: FieldRef<"user_newsletters", 'Decimal'>
    readonly created_at: FieldRef<"user_newsletters", 'DateTime'>
    readonly updated_at: FieldRef<"user_newsletters", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_newsletters findUnique
   */
  export type user_newslettersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * Filter, which user_newsletters to fetch.
     */
    where: user_newslettersWhereUniqueInput
  }

  /**
   * user_newsletters findUniqueOrThrow
   */
  export type user_newslettersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * Filter, which user_newsletters to fetch.
     */
    where: user_newslettersWhereUniqueInput
  }

  /**
   * user_newsletters findFirst
   */
  export type user_newslettersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * Filter, which user_newsletters to fetch.
     */
    where?: user_newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_newsletters to fetch.
     */
    orderBy?: user_newslettersOrderByWithRelationInput | user_newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_newsletters.
     */
    cursor?: user_newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_newsletters.
     */
    distinct?: User_newslettersScalarFieldEnum | User_newslettersScalarFieldEnum[]
  }

  /**
   * user_newsletters findFirstOrThrow
   */
  export type user_newslettersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * Filter, which user_newsletters to fetch.
     */
    where?: user_newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_newsletters to fetch.
     */
    orderBy?: user_newslettersOrderByWithRelationInput | user_newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_newsletters.
     */
    cursor?: user_newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_newsletters.
     */
    distinct?: User_newslettersScalarFieldEnum | User_newslettersScalarFieldEnum[]
  }

  /**
   * user_newsletters findMany
   */
  export type user_newslettersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * Filter, which user_newsletters to fetch.
     */
    where?: user_newslettersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_newsletters to fetch.
     */
    orderBy?: user_newslettersOrderByWithRelationInput | user_newslettersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_newsletters.
     */
    cursor?: user_newslettersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_newsletters.
     */
    skip?: number
    distinct?: User_newslettersScalarFieldEnum | User_newslettersScalarFieldEnum[]
  }

  /**
   * user_newsletters create
   */
  export type user_newslettersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * The data needed to create a user_newsletters.
     */
    data?: XOR<user_newslettersCreateInput, user_newslettersUncheckedCreateInput>
  }

  /**
   * user_newsletters createMany
   */
  export type user_newslettersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_newsletters.
     */
    data: user_newslettersCreateManyInput | user_newslettersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_newsletters createManyAndReturn
   */
  export type user_newslettersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * The data used to create many user_newsletters.
     */
    data: user_newslettersCreateManyInput | user_newslettersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_newsletters update
   */
  export type user_newslettersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * The data needed to update a user_newsletters.
     */
    data: XOR<user_newslettersUpdateInput, user_newslettersUncheckedUpdateInput>
    /**
     * Choose, which user_newsletters to update.
     */
    where: user_newslettersWhereUniqueInput
  }

  /**
   * user_newsletters updateMany
   */
  export type user_newslettersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_newsletters.
     */
    data: XOR<user_newslettersUpdateManyMutationInput, user_newslettersUncheckedUpdateManyInput>
    /**
     * Filter which user_newsletters to update
     */
    where?: user_newslettersWhereInput
    /**
     * Limit how many user_newsletters to update.
     */
    limit?: number
  }

  /**
   * user_newsletters updateManyAndReturn
   */
  export type user_newslettersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * The data used to update user_newsletters.
     */
    data: XOR<user_newslettersUpdateManyMutationInput, user_newslettersUncheckedUpdateManyInput>
    /**
     * Filter which user_newsletters to update
     */
    where?: user_newslettersWhereInput
    /**
     * Limit how many user_newsletters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_newsletters upsert
   */
  export type user_newslettersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * The filter to search for the user_newsletters to update in case it exists.
     */
    where: user_newslettersWhereUniqueInput
    /**
     * In case the user_newsletters found by the `where` argument doesn't exist, create a new user_newsletters with this data.
     */
    create: XOR<user_newslettersCreateInput, user_newslettersUncheckedCreateInput>
    /**
     * In case the user_newsletters was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_newslettersUpdateInput, user_newslettersUncheckedUpdateInput>
  }

  /**
   * user_newsletters delete
   */
  export type user_newslettersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    /**
     * Filter which user_newsletters to delete.
     */
    where: user_newslettersWhereUniqueInput
  }

  /**
   * user_newsletters deleteMany
   */
  export type user_newslettersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_newsletters to delete
     */
    where?: user_newslettersWhereInput
    /**
     * Limit how many user_newsletters to delete.
     */
    limit?: number
  }

  /**
   * user_newsletters.newsletters
   */
  export type user_newsletters$newslettersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the newsletters
     */
    select?: newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the newsletters
     */
    omit?: newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: newslettersInclude<ExtArgs> | null
    where?: newslettersWhereInput
  }

  /**
   * user_newsletters.users
   */
  export type user_newsletters$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * user_newsletters without action
   */
  export type user_newslettersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    id: number | null
    login_count: number | null
  }

  export type UsersSumAggregateOutputType = {
    id: number | null
    login_count: number | null
  }

  export type UsersMinAggregateOutputType = {
    id: number | null
    external_id: string | null
    email: string | null
    role: string | null
    status: string | null
    department: string | null
    title: string | null
    phone: string | null
    join_date: Date | null
    last_login: Date | null
    login_count: number | null
    created_at: Date | null
    updated_at: Date | null
    firstname: string | null
    lastname: string | null
    group_id: string | null
    last_synced_at: Date | null
    last_source: string | null
  }

  export type UsersMaxAggregateOutputType = {
    id: number | null
    external_id: string | null
    email: string | null
    role: string | null
    status: string | null
    department: string | null
    title: string | null
    phone: string | null
    join_date: Date | null
    last_login: Date | null
    login_count: number | null
    created_at: Date | null
    updated_at: Date | null
    firstname: string | null
    lastname: string | null
    group_id: string | null
    last_synced_at: Date | null
    last_source: string | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    external_id: number
    email: number
    role: number
    status: number
    department: number
    title: number
    phone: number
    join_date: number
    last_login: number
    login_count: number
    created_at: number
    updated_at: number
    attributes: number
    firstname: number
    lastname: number
    group_id: number
    last_synced_at: number
    last_source: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    id?: true
    login_count?: true
  }

  export type UsersSumAggregateInputType = {
    id?: true
    login_count?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    external_id?: true
    email?: true
    role?: true
    status?: true
    department?: true
    title?: true
    phone?: true
    join_date?: true
    last_login?: true
    login_count?: true
    created_at?: true
    updated_at?: true
    firstname?: true
    lastname?: true
    group_id?: true
    last_synced_at?: true
    last_source?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    external_id?: true
    email?: true
    role?: true
    status?: true
    department?: true
    title?: true
    phone?: true
    join_date?: true
    last_login?: true
    login_count?: true
    created_at?: true
    updated_at?: true
    firstname?: true
    lastname?: true
    group_id?: true
    last_synced_at?: true
    last_source?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    external_id?: true
    email?: true
    role?: true
    status?: true
    department?: true
    title?: true
    phone?: true
    join_date?: true
    last_login?: true
    login_count?: true
    created_at?: true
    updated_at?: true
    attributes?: true
    firstname?: true
    lastname?: true
    group_id?: true
    last_synced_at?: true
    last_source?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: number
    external_id: string
    email: string
    role: string | null
    status: string | null
    department: string | null
    title: string | null
    phone: string | null
    join_date: Date | null
    last_login: Date | null
    login_count: number | null
    created_at: Date | null
    updated_at: Date | null
    attributes: JsonValue | null
    firstname: string | null
    lastname: string | null
    group_id: string | null
    last_synced_at: Date | null
    last_source: string | null
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    department?: boolean
    title?: boolean
    phone?: boolean
    join_date?: boolean
    last_login?: boolean
    login_count?: boolean
    created_at?: boolean
    updated_at?: boolean
    attributes?: boolean
    firstname?: boolean
    lastname?: boolean
    group_id?: boolean
    last_synced_at?: boolean
    last_source?: boolean
    user_accounts?: boolean | users$user_accountsArgs<ExtArgs>
    user_activity?: boolean | users$user_activityArgs<ExtArgs>
    user_newsletters?: boolean | users$user_newslettersArgs<ExtArgs>
    groups?: boolean | users$groupsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    department?: boolean
    title?: boolean
    phone?: boolean
    join_date?: boolean
    last_login?: boolean
    login_count?: boolean
    created_at?: boolean
    updated_at?: boolean
    attributes?: boolean
    firstname?: boolean
    lastname?: boolean
    group_id?: boolean
    last_synced_at?: boolean
    last_source?: boolean
    groups?: boolean | users$groupsArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    external_id?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    department?: boolean
    title?: boolean
    phone?: boolean
    join_date?: boolean
    last_login?: boolean
    login_count?: boolean
    created_at?: boolean
    updated_at?: boolean
    attributes?: boolean
    firstname?: boolean
    lastname?: boolean
    group_id?: boolean
    last_synced_at?: boolean
    last_source?: boolean
    groups?: boolean | users$groupsArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    external_id?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    department?: boolean
    title?: boolean
    phone?: boolean
    join_date?: boolean
    last_login?: boolean
    login_count?: boolean
    created_at?: boolean
    updated_at?: boolean
    attributes?: boolean
    firstname?: boolean
    lastname?: boolean
    group_id?: boolean
    last_synced_at?: boolean
    last_source?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "external_id" | "email" | "role" | "status" | "department" | "title" | "phone" | "join_date" | "last_login" | "login_count" | "created_at" | "updated_at" | "attributes" | "firstname" | "lastname" | "group_id" | "last_synced_at" | "last_source", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user_accounts?: boolean | users$user_accountsArgs<ExtArgs>
    user_activity?: boolean | users$user_activityArgs<ExtArgs>
    user_newsletters?: boolean | users$user_newslettersArgs<ExtArgs>
    groups?: boolean | users$groupsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type usersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    groups?: boolean | users$groupsArgs<ExtArgs>
  }
  export type usersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    groups?: boolean | users$groupsArgs<ExtArgs>
  }

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      user_accounts: Prisma.$user_accountsPayload<ExtArgs>[]
      user_activity: Prisma.$user_activityPayload<ExtArgs>[]
      user_newsletters: Prisma.$user_newslettersPayload<ExtArgs>[]
      groups: Prisma.$groupsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      external_id: string
      email: string
      role: string | null
      status: string | null
      department: string | null
      title: string | null
      phone: string | null
      join_date: Date | null
      last_login: Date | null
      login_count: number | null
      created_at: Date | null
      updated_at: Date | null
      attributes: Prisma.JsonValue | null
      firstname: string | null
      lastname: string | null
      group_id: string | null
      last_synced_at: Date | null
      last_source: string | null
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user_accounts<T extends users$user_accountsArgs<ExtArgs> = {}>(args?: Subset<T, users$user_accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_accountsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_activity<T extends users$user_activityArgs<ExtArgs> = {}>(args?: Subset<T, users$user_activityArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_activityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_newsletters<T extends users$user_newslettersArgs<ExtArgs> = {}>(args?: Subset<T, users$user_newslettersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_newslettersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    groups<T extends users$groupsArgs<ExtArgs> = {}>(args?: Subset<T, users$groupsArgs<ExtArgs>>): Prisma__groupsClient<$Result.GetResult<Prisma.$groupsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'Int'>
    readonly external_id: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly role: FieldRef<"users", 'String'>
    readonly status: FieldRef<"users", 'String'>
    readonly department: FieldRef<"users", 'String'>
    readonly title: FieldRef<"users", 'String'>
    readonly phone: FieldRef<"users", 'String'>
    readonly join_date: FieldRef<"users", 'DateTime'>
    readonly last_login: FieldRef<"users", 'DateTime'>
    readonly login_count: FieldRef<"users", 'Int'>
    readonly created_at: FieldRef<"users", 'DateTime'>
    readonly updated_at: FieldRef<"users", 'DateTime'>
    readonly attributes: FieldRef<"users", 'Json'>
    readonly firstname: FieldRef<"users", 'String'>
    readonly lastname: FieldRef<"users", 'String'>
    readonly group_id: FieldRef<"users", 'String'>
    readonly last_synced_at: FieldRef<"users", 'DateTime'>
    readonly last_source: FieldRef<"users", 'String'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.user_accounts
   */
  export type users$user_accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_accounts
     */
    select?: user_accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_accounts
     */
    omit?: user_accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_accountsInclude<ExtArgs> | null
    where?: user_accountsWhereInput
    orderBy?: user_accountsOrderByWithRelationInput | user_accountsOrderByWithRelationInput[]
    cursor?: user_accountsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_accountsScalarFieldEnum | User_accountsScalarFieldEnum[]
  }

  /**
   * users.user_activity
   */
  export type users$user_activityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_activity
     */
    select?: user_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_activity
     */
    omit?: user_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_activityInclude<ExtArgs> | null
    where?: user_activityWhereInput
    orderBy?: user_activityOrderByWithRelationInput | user_activityOrderByWithRelationInput[]
    cursor?: user_activityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_activityScalarFieldEnum | User_activityScalarFieldEnum[]
  }

  /**
   * users.user_newsletters
   */
  export type users$user_newslettersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_newsletters
     */
    select?: user_newslettersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_newsletters
     */
    omit?: user_newslettersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_newslettersInclude<ExtArgs> | null
    where?: user_newslettersWhereInput
    orderBy?: user_newslettersOrderByWithRelationInput | user_newslettersOrderByWithRelationInput[]
    cursor?: user_newslettersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_newslettersScalarFieldEnum | User_newslettersScalarFieldEnum[]
  }

  /**
   * users.groups
   */
  export type users$groupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the groups
     */
    select?: groupsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the groups
     */
    omit?: groupsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: groupsInclude<ExtArgs> | null
    where?: groupsWhereInput
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Account_activityScalarFieldEnum: {
    id: 'id',
    account_id: 'account_id',
    date: 'date',
    active_users: 'active_users',
    pageviews: 'pageviews',
    created_at: 'created_at'
  };

  export type Account_activityScalarFieldEnum = (typeof Account_activityScalarFieldEnum)[keyof typeof Account_activityScalarFieldEnum]


  export const AccountsScalarFieldEnum: {
    id: 'id',
    external_id: 'external_id',
    name: 'name',
    type: 'type',
    status: 'status',
    industry: 'industry',
    website: 'website',
    contact_name: 'contact_name',
    contact_email: 'contact_email',
    contact_phone: 'contact_phone',
    address: 'address',
    total_users: 'total_users',
    active_users: 'active_users',
    mrr: 'mrr',
    subscription_start: 'subscription_start',
    next_billing: 'next_billing',
    health_score: 'health_score',
    rep_id: 'rep_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type AccountsScalarFieldEnum = (typeof AccountsScalarFieldEnum)[keyof typeof AccountsScalarFieldEnum]


  export const Attribute_definitionsScalarFieldEnum: {
    slug: 'slug',
    label: 'label',
    input_type: 'input_type',
    required: 'required',
    select_options: 'select_options'
  };

  export type Attribute_definitionsScalarFieldEnum = (typeof Attribute_definitionsScalarFieldEnum)[keyof typeof Attribute_definitionsScalarFieldEnum]


  export const GroupsScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    color: 'color',
    icon: 'icon',
    default_template: 'default_template',
    product_grant_ids: 'product_grant_ids',
    demographics: 'demographics',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_count: 'user_count',
    account_id: 'account_id',
    account_id_new: 'account_id_new'
  };

  export type GroupsScalarFieldEnum = (typeof GroupsScalarFieldEnum)[keyof typeof GroupsScalarFieldEnum]


  export const NewslettersScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    created_at: 'created_at'
  };

  export type NewslettersScalarFieldEnum = (typeof NewslettersScalarFieldEnum)[keyof typeof NewslettersScalarFieldEnum]


  export const Product_usageScalarFieldEnum: {
    id: 'id',
    account_id: 'account_id',
    product_id: 'product_id',
    date: 'date',
    pageviews: 'pageviews',
    active_users: 'active_users',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Product_usageScalarFieldEnum = (typeof Product_usageScalarFieldEnum)[keyof typeof Product_usageScalarFieldEnum]


  export const ProductsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    created_at: 'created_at'
  };

  export type ProductsScalarFieldEnum = (typeof ProductsScalarFieldEnum)[keyof typeof ProductsScalarFieldEnum]


  export const SubscriptionsScalarFieldEnum: {
    id: 'id',
    external_id: 'external_id',
    account_id: 'account_id',
    customer_name: 'customer_name',
    email: 'email',
    plan: 'plan',
    plan_type: 'plan_type',
    status: 'status',
    amount: 'amount',
    billing_cycle: 'billing_cycle',
    start_date: 'start_date',
    next_billing: 'next_billing',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SubscriptionsScalarFieldEnum = (typeof SubscriptionsScalarFieldEnum)[keyof typeof SubscriptionsScalarFieldEnum]


  export const Top_pagesScalarFieldEnum: {
    id: 'id',
    account_id: 'account_id',
    url: 'url',
    title: 'title',
    pageviews: 'pageviews',
    avg_time_on_page: 'avg_time_on_page',
    bounce_rate: 'bounce_rate',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Top_pagesScalarFieldEnum = (typeof Top_pagesScalarFieldEnum)[keyof typeof Top_pagesScalarFieldEnum]


  export const User_accountsScalarFieldEnum: {
    user_id: 'user_id',
    account_id: 'account_id'
  };

  export type User_accountsScalarFieldEnum = (typeof User_accountsScalarFieldEnum)[keyof typeof User_accountsScalarFieldEnum]


  export const User_activityScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    date: 'date',
    logins: 'logins',
    pageviews: 'pageviews',
    created_at: 'created_at'
  };

  export type User_activityScalarFieldEnum = (typeof User_activityScalarFieldEnum)[keyof typeof User_activityScalarFieldEnum]


  export const User_newslettersScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    newsletter_id: 'newsletter_id',
    subscribed: 'subscribed',
    open_rate: 'open_rate',
    click_rate: 'click_rate',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type User_newslettersScalarFieldEnum = (typeof User_newslettersScalarFieldEnum)[keyof typeof User_newslettersScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    external_id: 'external_id',
    email: 'email',
    role: 'role',
    status: 'status',
    department: 'department',
    title: 'title',
    phone: 'phone',
    join_date: 'join_date',
    last_login: 'last_login',
    login_count: 'login_count',
    created_at: 'created_at',
    updated_at: 'updated_at',
    attributes: 'attributes',
    firstname: 'firstname',
    lastname: 'lastname',
    group_id: 'group_id',
    last_synced_at: 'last_synced_at',
    last_source: 'last_source'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type account_activityWhereInput = {
    AND?: account_activityWhereInput | account_activityWhereInput[]
    OR?: account_activityWhereInput[]
    NOT?: account_activityWhereInput | account_activityWhereInput[]
    id?: IntFilter<"account_activity"> | number
    account_id?: IntNullableFilter<"account_activity"> | number | null
    date?: DateTimeFilter<"account_activity"> | Date | string
    active_users?: IntNullableFilter<"account_activity"> | number | null
    pageviews?: IntNullableFilter<"account_activity"> | number | null
    created_at?: DateTimeNullableFilter<"account_activity"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
  }

  export type account_activityOrderByWithRelationInput = {
    id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    date?: SortOrder
    active_users?: SortOrderInput | SortOrder
    pageviews?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    accounts?: accountsOrderByWithRelationInput
  }

  export type account_activityWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    account_id_date?: account_activityAccount_idDateCompoundUniqueInput
    AND?: account_activityWhereInput | account_activityWhereInput[]
    OR?: account_activityWhereInput[]
    NOT?: account_activityWhereInput | account_activityWhereInput[]
    account_id?: IntNullableFilter<"account_activity"> | number | null
    date?: DateTimeFilter<"account_activity"> | Date | string
    active_users?: IntNullableFilter<"account_activity"> | number | null
    pageviews?: IntNullableFilter<"account_activity"> | number | null
    created_at?: DateTimeNullableFilter<"account_activity"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
  }, "id" | "account_id_date">

  export type account_activityOrderByWithAggregationInput = {
    id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    date?: SortOrder
    active_users?: SortOrderInput | SortOrder
    pageviews?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: account_activityCountOrderByAggregateInput
    _avg?: account_activityAvgOrderByAggregateInput
    _max?: account_activityMaxOrderByAggregateInput
    _min?: account_activityMinOrderByAggregateInput
    _sum?: account_activitySumOrderByAggregateInput
  }

  export type account_activityScalarWhereWithAggregatesInput = {
    AND?: account_activityScalarWhereWithAggregatesInput | account_activityScalarWhereWithAggregatesInput[]
    OR?: account_activityScalarWhereWithAggregatesInput[]
    NOT?: account_activityScalarWhereWithAggregatesInput | account_activityScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"account_activity"> | number
    account_id?: IntNullableWithAggregatesFilter<"account_activity"> | number | null
    date?: DateTimeWithAggregatesFilter<"account_activity"> | Date | string
    active_users?: IntNullableWithAggregatesFilter<"account_activity"> | number | null
    pageviews?: IntNullableWithAggregatesFilter<"account_activity"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"account_activity"> | Date | string | null
  }

  export type accountsWhereInput = {
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    id?: IntFilter<"accounts"> | number
    external_id?: StringFilter<"accounts"> | string
    name?: StringFilter<"accounts"> | string
    type?: StringNullableFilter<"accounts"> | string | null
    status?: StringFilter<"accounts"> | string
    industry?: StringNullableFilter<"accounts"> | string | null
    website?: StringNullableFilter<"accounts"> | string | null
    contact_name?: StringNullableFilter<"accounts"> | string | null
    contact_email?: StringNullableFilter<"accounts"> | string | null
    contact_phone?: StringNullableFilter<"accounts"> | string | null
    address?: StringNullableFilter<"accounts"> | string | null
    total_users?: IntNullableFilter<"accounts"> | number | null
    active_users?: IntNullableFilter<"accounts"> | number | null
    mrr?: DecimalNullableFilter<"accounts"> | Decimal | DecimalJsLike | number | string | null
    subscription_start?: DateTimeNullableFilter<"accounts"> | Date | string | null
    next_billing?: DateTimeNullableFilter<"accounts"> | Date | string | null
    health_score?: IntNullableFilter<"accounts"> | number | null
    rep_id?: StringNullableFilter<"accounts"> | string | null
    created_at?: DateTimeNullableFilter<"accounts"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"accounts"> | Date | string | null
    account_activity?: Account_activityListRelationFilter
    groups?: GroupsListRelationFilter
    product_usage?: Product_usageListRelationFilter
    subscriptions?: SubscriptionsListRelationFilter
    top_pages?: Top_pagesListRelationFilter
    user_accounts?: User_accountsListRelationFilter
  }

  export type accountsOrderByWithRelationInput = {
    id?: SortOrder
    external_id?: SortOrder
    name?: SortOrder
    type?: SortOrderInput | SortOrder
    status?: SortOrder
    industry?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    contact_name?: SortOrderInput | SortOrder
    contact_email?: SortOrderInput | SortOrder
    contact_phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    total_users?: SortOrderInput | SortOrder
    active_users?: SortOrderInput | SortOrder
    mrr?: SortOrderInput | SortOrder
    subscription_start?: SortOrderInput | SortOrder
    next_billing?: SortOrderInput | SortOrder
    health_score?: SortOrderInput | SortOrder
    rep_id?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    account_activity?: account_activityOrderByRelationAggregateInput
    groups?: groupsOrderByRelationAggregateInput
    product_usage?: product_usageOrderByRelationAggregateInput
    subscriptions?: subscriptionsOrderByRelationAggregateInput
    top_pages?: top_pagesOrderByRelationAggregateInput
    user_accounts?: user_accountsOrderByRelationAggregateInput
  }

  export type accountsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    external_id?: string
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    name?: StringFilter<"accounts"> | string
    type?: StringNullableFilter<"accounts"> | string | null
    status?: StringFilter<"accounts"> | string
    industry?: StringNullableFilter<"accounts"> | string | null
    website?: StringNullableFilter<"accounts"> | string | null
    contact_name?: StringNullableFilter<"accounts"> | string | null
    contact_email?: StringNullableFilter<"accounts"> | string | null
    contact_phone?: StringNullableFilter<"accounts"> | string | null
    address?: StringNullableFilter<"accounts"> | string | null
    total_users?: IntNullableFilter<"accounts"> | number | null
    active_users?: IntNullableFilter<"accounts"> | number | null
    mrr?: DecimalNullableFilter<"accounts"> | Decimal | DecimalJsLike | number | string | null
    subscription_start?: DateTimeNullableFilter<"accounts"> | Date | string | null
    next_billing?: DateTimeNullableFilter<"accounts"> | Date | string | null
    health_score?: IntNullableFilter<"accounts"> | number | null
    rep_id?: StringNullableFilter<"accounts"> | string | null
    created_at?: DateTimeNullableFilter<"accounts"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"accounts"> | Date | string | null
    account_activity?: Account_activityListRelationFilter
    groups?: GroupsListRelationFilter
    product_usage?: Product_usageListRelationFilter
    subscriptions?: SubscriptionsListRelationFilter
    top_pages?: Top_pagesListRelationFilter
    user_accounts?: User_accountsListRelationFilter
  }, "id" | "external_id">

  export type accountsOrderByWithAggregationInput = {
    id?: SortOrder
    external_id?: SortOrder
    name?: SortOrder
    type?: SortOrderInput | SortOrder
    status?: SortOrder
    industry?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    contact_name?: SortOrderInput | SortOrder
    contact_email?: SortOrderInput | SortOrder
    contact_phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    total_users?: SortOrderInput | SortOrder
    active_users?: SortOrderInput | SortOrder
    mrr?: SortOrderInput | SortOrder
    subscription_start?: SortOrderInput | SortOrder
    next_billing?: SortOrderInput | SortOrder
    health_score?: SortOrderInput | SortOrder
    rep_id?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: accountsCountOrderByAggregateInput
    _avg?: accountsAvgOrderByAggregateInput
    _max?: accountsMaxOrderByAggregateInput
    _min?: accountsMinOrderByAggregateInput
    _sum?: accountsSumOrderByAggregateInput
  }

  export type accountsScalarWhereWithAggregatesInput = {
    AND?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    OR?: accountsScalarWhereWithAggregatesInput[]
    NOT?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"accounts"> | number
    external_id?: StringWithAggregatesFilter<"accounts"> | string
    name?: StringWithAggregatesFilter<"accounts"> | string
    type?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    status?: StringWithAggregatesFilter<"accounts"> | string
    industry?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    website?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    contact_name?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    contact_email?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    contact_phone?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    address?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    total_users?: IntNullableWithAggregatesFilter<"accounts"> | number | null
    active_users?: IntNullableWithAggregatesFilter<"accounts"> | number | null
    mrr?: DecimalNullableWithAggregatesFilter<"accounts"> | Decimal | DecimalJsLike | number | string | null
    subscription_start?: DateTimeNullableWithAggregatesFilter<"accounts"> | Date | string | null
    next_billing?: DateTimeNullableWithAggregatesFilter<"accounts"> | Date | string | null
    health_score?: IntNullableWithAggregatesFilter<"accounts"> | number | null
    rep_id?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"accounts"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"accounts"> | Date | string | null
  }

  export type attribute_definitionsWhereInput = {
    AND?: attribute_definitionsWhereInput | attribute_definitionsWhereInput[]
    OR?: attribute_definitionsWhereInput[]
    NOT?: attribute_definitionsWhereInput | attribute_definitionsWhereInput[]
    slug?: StringFilter<"attribute_definitions"> | string
    label?: StringNullableFilter<"attribute_definitions"> | string | null
    input_type?: StringNullableFilter<"attribute_definitions"> | string | null
    required?: BoolNullableFilter<"attribute_definitions"> | boolean | null
    select_options?: JsonNullableFilter<"attribute_definitions">
  }

  export type attribute_definitionsOrderByWithRelationInput = {
    slug?: SortOrder
    label?: SortOrderInput | SortOrder
    input_type?: SortOrderInput | SortOrder
    required?: SortOrderInput | SortOrder
    select_options?: SortOrderInput | SortOrder
  }

  export type attribute_definitionsWhereUniqueInput = Prisma.AtLeast<{
    slug?: string
    AND?: attribute_definitionsWhereInput | attribute_definitionsWhereInput[]
    OR?: attribute_definitionsWhereInput[]
    NOT?: attribute_definitionsWhereInput | attribute_definitionsWhereInput[]
    label?: StringNullableFilter<"attribute_definitions"> | string | null
    input_type?: StringNullableFilter<"attribute_definitions"> | string | null
    required?: BoolNullableFilter<"attribute_definitions"> | boolean | null
    select_options?: JsonNullableFilter<"attribute_definitions">
  }, "slug">

  export type attribute_definitionsOrderByWithAggregationInput = {
    slug?: SortOrder
    label?: SortOrderInput | SortOrder
    input_type?: SortOrderInput | SortOrder
    required?: SortOrderInput | SortOrder
    select_options?: SortOrderInput | SortOrder
    _count?: attribute_definitionsCountOrderByAggregateInput
    _max?: attribute_definitionsMaxOrderByAggregateInput
    _min?: attribute_definitionsMinOrderByAggregateInput
  }

  export type attribute_definitionsScalarWhereWithAggregatesInput = {
    AND?: attribute_definitionsScalarWhereWithAggregatesInput | attribute_definitionsScalarWhereWithAggregatesInput[]
    OR?: attribute_definitionsScalarWhereWithAggregatesInput[]
    NOT?: attribute_definitionsScalarWhereWithAggregatesInput | attribute_definitionsScalarWhereWithAggregatesInput[]
    slug?: StringWithAggregatesFilter<"attribute_definitions"> | string
    label?: StringNullableWithAggregatesFilter<"attribute_definitions"> | string | null
    input_type?: StringNullableWithAggregatesFilter<"attribute_definitions"> | string | null
    required?: BoolNullableWithAggregatesFilter<"attribute_definitions"> | boolean | null
    select_options?: JsonNullableWithAggregatesFilter<"attribute_definitions">
  }

  export type groupsWhereInput = {
    AND?: groupsWhereInput | groupsWhereInput[]
    OR?: groupsWhereInput[]
    NOT?: groupsWhereInput | groupsWhereInput[]
    id?: UuidFilter<"groups"> | string
    slug?: StringFilter<"groups"> | string
    name?: StringFilter<"groups"> | string
    color?: StringNullableFilter<"groups"> | string | null
    icon?: StringNullableFilter<"groups"> | string | null
    default_template?: StringNullableFilter<"groups"> | string | null
    product_grant_ids?: StringNullableListFilter<"groups">
    demographics?: JsonFilter<"groups">
    created_at?: DateTimeFilter<"groups"> | Date | string
    updated_at?: DateTimeFilter<"groups"> | Date | string
    user_count?: IntFilter<"groups"> | number
    account_id?: IntFilter<"groups"> | number
    account_id_new?: StringNullableFilter<"groups"> | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
    users?: UsersListRelationFilter
  }

  export type groupsOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    default_template?: SortOrderInput | SortOrder
    product_grant_ids?: SortOrder
    demographics?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_count?: SortOrder
    account_id?: SortOrder
    account_id_new?: SortOrderInput | SortOrder
    accounts?: accountsOrderByWithRelationInput
    users?: usersOrderByRelationAggregateInput
  }

  export type groupsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    account_id_slug?: groupsAccount_idSlugCompoundUniqueInput
    account_id_new_slug?: groupsAccount_id_newSlugCompoundUniqueInput
    AND?: groupsWhereInput | groupsWhereInput[]
    OR?: groupsWhereInput[]
    NOT?: groupsWhereInput | groupsWhereInput[]
    slug?: StringFilter<"groups"> | string
    name?: StringFilter<"groups"> | string
    color?: StringNullableFilter<"groups"> | string | null
    icon?: StringNullableFilter<"groups"> | string | null
    default_template?: StringNullableFilter<"groups"> | string | null
    product_grant_ids?: StringNullableListFilter<"groups">
    demographics?: JsonFilter<"groups">
    created_at?: DateTimeFilter<"groups"> | Date | string
    updated_at?: DateTimeFilter<"groups"> | Date | string
    user_count?: IntFilter<"groups"> | number
    account_id?: IntFilter<"groups"> | number
    account_id_new?: StringNullableFilter<"groups"> | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
    users?: UsersListRelationFilter
  }, "id" | "account_id_slug" | "account_id_new_slug">

  export type groupsOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    default_template?: SortOrderInput | SortOrder
    product_grant_ids?: SortOrder
    demographics?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_count?: SortOrder
    account_id?: SortOrder
    account_id_new?: SortOrderInput | SortOrder
    _count?: groupsCountOrderByAggregateInput
    _avg?: groupsAvgOrderByAggregateInput
    _max?: groupsMaxOrderByAggregateInput
    _min?: groupsMinOrderByAggregateInput
    _sum?: groupsSumOrderByAggregateInput
  }

  export type groupsScalarWhereWithAggregatesInput = {
    AND?: groupsScalarWhereWithAggregatesInput | groupsScalarWhereWithAggregatesInput[]
    OR?: groupsScalarWhereWithAggregatesInput[]
    NOT?: groupsScalarWhereWithAggregatesInput | groupsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"groups"> | string
    slug?: StringWithAggregatesFilter<"groups"> | string
    name?: StringWithAggregatesFilter<"groups"> | string
    color?: StringNullableWithAggregatesFilter<"groups"> | string | null
    icon?: StringNullableWithAggregatesFilter<"groups"> | string | null
    default_template?: StringNullableWithAggregatesFilter<"groups"> | string | null
    product_grant_ids?: StringNullableListFilter<"groups">
    demographics?: JsonWithAggregatesFilter<"groups">
    created_at?: DateTimeWithAggregatesFilter<"groups"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"groups"> | Date | string
    user_count?: IntWithAggregatesFilter<"groups"> | number
    account_id?: IntWithAggregatesFilter<"groups"> | number
    account_id_new?: StringNullableWithAggregatesFilter<"groups"> | string | null
  }

  export type newslettersWhereInput = {
    AND?: newslettersWhereInput | newslettersWhereInput[]
    OR?: newslettersWhereInput[]
    NOT?: newslettersWhereInput | newslettersWhereInput[]
    id?: IntFilter<"newsletters"> | number
    name?: StringFilter<"newsletters"> | string
    description?: StringNullableFilter<"newsletters"> | string | null
    created_at?: DateTimeNullableFilter<"newsletters"> | Date | string | null
    user_newsletters?: User_newslettersListRelationFilter
  }

  export type newslettersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    user_newsletters?: user_newslettersOrderByRelationAggregateInput
  }

  export type newslettersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: newslettersWhereInput | newslettersWhereInput[]
    OR?: newslettersWhereInput[]
    NOT?: newslettersWhereInput | newslettersWhereInput[]
    name?: StringFilter<"newsletters"> | string
    description?: StringNullableFilter<"newsletters"> | string | null
    created_at?: DateTimeNullableFilter<"newsletters"> | Date | string | null
    user_newsletters?: User_newslettersListRelationFilter
  }, "id">

  export type newslettersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: newslettersCountOrderByAggregateInput
    _avg?: newslettersAvgOrderByAggregateInput
    _max?: newslettersMaxOrderByAggregateInput
    _min?: newslettersMinOrderByAggregateInput
    _sum?: newslettersSumOrderByAggregateInput
  }

  export type newslettersScalarWhereWithAggregatesInput = {
    AND?: newslettersScalarWhereWithAggregatesInput | newslettersScalarWhereWithAggregatesInput[]
    OR?: newslettersScalarWhereWithAggregatesInput[]
    NOT?: newslettersScalarWhereWithAggregatesInput | newslettersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"newsletters"> | number
    name?: StringWithAggregatesFilter<"newsletters"> | string
    description?: StringNullableWithAggregatesFilter<"newsletters"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"newsletters"> | Date | string | null
  }

  export type product_usageWhereInput = {
    AND?: product_usageWhereInput | product_usageWhereInput[]
    OR?: product_usageWhereInput[]
    NOT?: product_usageWhereInput | product_usageWhereInput[]
    id?: IntFilter<"product_usage"> | number
    account_id?: IntNullableFilter<"product_usage"> | number | null
    product_id?: IntNullableFilter<"product_usage"> | number | null
    date?: DateTimeFilter<"product_usage"> | Date | string
    pageviews?: IntNullableFilter<"product_usage"> | number | null
    active_users?: IntNullableFilter<"product_usage"> | number | null
    created_at?: DateTimeNullableFilter<"product_usage"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"product_usage"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
    products?: XOR<ProductsNullableScalarRelationFilter, productsWhereInput> | null
  }

  export type product_usageOrderByWithRelationInput = {
    id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    product_id?: SortOrderInput | SortOrder
    date?: SortOrder
    pageviews?: SortOrderInput | SortOrder
    active_users?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    accounts?: accountsOrderByWithRelationInput
    products?: productsOrderByWithRelationInput
  }

  export type product_usageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    account_id_product_id_date?: product_usageAccount_idProduct_idDateCompoundUniqueInput
    AND?: product_usageWhereInput | product_usageWhereInput[]
    OR?: product_usageWhereInput[]
    NOT?: product_usageWhereInput | product_usageWhereInput[]
    account_id?: IntNullableFilter<"product_usage"> | number | null
    product_id?: IntNullableFilter<"product_usage"> | number | null
    date?: DateTimeFilter<"product_usage"> | Date | string
    pageviews?: IntNullableFilter<"product_usage"> | number | null
    active_users?: IntNullableFilter<"product_usage"> | number | null
    created_at?: DateTimeNullableFilter<"product_usage"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"product_usage"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
    products?: XOR<ProductsNullableScalarRelationFilter, productsWhereInput> | null
  }, "id" | "account_id_product_id_date">

  export type product_usageOrderByWithAggregationInput = {
    id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    product_id?: SortOrderInput | SortOrder
    date?: SortOrder
    pageviews?: SortOrderInput | SortOrder
    active_users?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: product_usageCountOrderByAggregateInput
    _avg?: product_usageAvgOrderByAggregateInput
    _max?: product_usageMaxOrderByAggregateInput
    _min?: product_usageMinOrderByAggregateInput
    _sum?: product_usageSumOrderByAggregateInput
  }

  export type product_usageScalarWhereWithAggregatesInput = {
    AND?: product_usageScalarWhereWithAggregatesInput | product_usageScalarWhereWithAggregatesInput[]
    OR?: product_usageScalarWhereWithAggregatesInput[]
    NOT?: product_usageScalarWhereWithAggregatesInput | product_usageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"product_usage"> | number
    account_id?: IntNullableWithAggregatesFilter<"product_usage"> | number | null
    product_id?: IntNullableWithAggregatesFilter<"product_usage"> | number | null
    date?: DateTimeWithAggregatesFilter<"product_usage"> | Date | string
    pageviews?: IntNullableWithAggregatesFilter<"product_usage"> | number | null
    active_users?: IntNullableWithAggregatesFilter<"product_usage"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"product_usage"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"product_usage"> | Date | string | null
  }

  export type productsWhereInput = {
    AND?: productsWhereInput | productsWhereInput[]
    OR?: productsWhereInput[]
    NOT?: productsWhereInput | productsWhereInput[]
    id?: IntFilter<"products"> | number
    name?: StringFilter<"products"> | string
    description?: StringNullableFilter<"products"> | string | null
    created_at?: DateTimeNullableFilter<"products"> | Date | string | null
    product_usage?: Product_usageListRelationFilter
  }

  export type productsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    product_usage?: product_usageOrderByRelationAggregateInput
  }

  export type productsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: productsWhereInput | productsWhereInput[]
    OR?: productsWhereInput[]
    NOT?: productsWhereInput | productsWhereInput[]
    description?: StringNullableFilter<"products"> | string | null
    created_at?: DateTimeNullableFilter<"products"> | Date | string | null
    product_usage?: Product_usageListRelationFilter
  }, "id" | "name">

  export type productsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: productsCountOrderByAggregateInput
    _avg?: productsAvgOrderByAggregateInput
    _max?: productsMaxOrderByAggregateInput
    _min?: productsMinOrderByAggregateInput
    _sum?: productsSumOrderByAggregateInput
  }

  export type productsScalarWhereWithAggregatesInput = {
    AND?: productsScalarWhereWithAggregatesInput | productsScalarWhereWithAggregatesInput[]
    OR?: productsScalarWhereWithAggregatesInput[]
    NOT?: productsScalarWhereWithAggregatesInput | productsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"products"> | number
    name?: StringWithAggregatesFilter<"products"> | string
    description?: StringNullableWithAggregatesFilter<"products"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"products"> | Date | string | null
  }

  export type subscriptionsWhereInput = {
    AND?: subscriptionsWhereInput | subscriptionsWhereInput[]
    OR?: subscriptionsWhereInput[]
    NOT?: subscriptionsWhereInput | subscriptionsWhereInput[]
    id?: IntFilter<"subscriptions"> | number
    external_id?: StringFilter<"subscriptions"> | string
    account_id?: IntNullableFilter<"subscriptions"> | number | null
    customer_name?: StringFilter<"subscriptions"> | string
    email?: StringNullableFilter<"subscriptions"> | string | null
    plan?: StringFilter<"subscriptions"> | string
    plan_type?: StringFilter<"subscriptions"> | string
    status?: StringFilter<"subscriptions"> | string
    amount?: DecimalNullableFilter<"subscriptions"> | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: StringNullableFilter<"subscriptions"> | string | null
    start_date?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    next_billing?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    created_at?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
  }

  export type subscriptionsOrderByWithRelationInput = {
    id?: SortOrder
    external_id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    customer_name?: SortOrder
    email?: SortOrderInput | SortOrder
    plan?: SortOrder
    plan_type?: SortOrder
    status?: SortOrder
    amount?: SortOrderInput | SortOrder
    billing_cycle?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    next_billing?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    accounts?: accountsOrderByWithRelationInput
  }

  export type subscriptionsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    external_id?: string
    AND?: subscriptionsWhereInput | subscriptionsWhereInput[]
    OR?: subscriptionsWhereInput[]
    NOT?: subscriptionsWhereInput | subscriptionsWhereInput[]
    account_id?: IntNullableFilter<"subscriptions"> | number | null
    customer_name?: StringFilter<"subscriptions"> | string
    email?: StringNullableFilter<"subscriptions"> | string | null
    plan?: StringFilter<"subscriptions"> | string
    plan_type?: StringFilter<"subscriptions"> | string
    status?: StringFilter<"subscriptions"> | string
    amount?: DecimalNullableFilter<"subscriptions"> | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: StringNullableFilter<"subscriptions"> | string | null
    start_date?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    next_billing?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    created_at?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
  }, "id" | "external_id">

  export type subscriptionsOrderByWithAggregationInput = {
    id?: SortOrder
    external_id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    customer_name?: SortOrder
    email?: SortOrderInput | SortOrder
    plan?: SortOrder
    plan_type?: SortOrder
    status?: SortOrder
    amount?: SortOrderInput | SortOrder
    billing_cycle?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    next_billing?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: subscriptionsCountOrderByAggregateInput
    _avg?: subscriptionsAvgOrderByAggregateInput
    _max?: subscriptionsMaxOrderByAggregateInput
    _min?: subscriptionsMinOrderByAggregateInput
    _sum?: subscriptionsSumOrderByAggregateInput
  }

  export type subscriptionsScalarWhereWithAggregatesInput = {
    AND?: subscriptionsScalarWhereWithAggregatesInput | subscriptionsScalarWhereWithAggregatesInput[]
    OR?: subscriptionsScalarWhereWithAggregatesInput[]
    NOT?: subscriptionsScalarWhereWithAggregatesInput | subscriptionsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"subscriptions"> | number
    external_id?: StringWithAggregatesFilter<"subscriptions"> | string
    account_id?: IntNullableWithAggregatesFilter<"subscriptions"> | number | null
    customer_name?: StringWithAggregatesFilter<"subscriptions"> | string
    email?: StringNullableWithAggregatesFilter<"subscriptions"> | string | null
    plan?: StringWithAggregatesFilter<"subscriptions"> | string
    plan_type?: StringWithAggregatesFilter<"subscriptions"> | string
    status?: StringWithAggregatesFilter<"subscriptions"> | string
    amount?: DecimalNullableWithAggregatesFilter<"subscriptions"> | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: StringNullableWithAggregatesFilter<"subscriptions"> | string | null
    start_date?: DateTimeNullableWithAggregatesFilter<"subscriptions"> | Date | string | null
    next_billing?: DateTimeNullableWithAggregatesFilter<"subscriptions"> | Date | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"subscriptions"> | Date | string | null
  }

  export type top_pagesWhereInput = {
    AND?: top_pagesWhereInput | top_pagesWhereInput[]
    OR?: top_pagesWhereInput[]
    NOT?: top_pagesWhereInput | top_pagesWhereInput[]
    id?: IntFilter<"top_pages"> | number
    account_id?: IntNullableFilter<"top_pages"> | number | null
    url?: StringFilter<"top_pages"> | string
    title?: StringNullableFilter<"top_pages"> | string | null
    pageviews?: IntNullableFilter<"top_pages"> | number | null
    avg_time_on_page?: IntNullableFilter<"top_pages"> | number | null
    bounce_rate?: DecimalNullableFilter<"top_pages"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"top_pages"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"top_pages"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
  }

  export type top_pagesOrderByWithRelationInput = {
    id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    pageviews?: SortOrderInput | SortOrder
    avg_time_on_page?: SortOrderInput | SortOrder
    bounce_rate?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    accounts?: accountsOrderByWithRelationInput
  }

  export type top_pagesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: top_pagesWhereInput | top_pagesWhereInput[]
    OR?: top_pagesWhereInput[]
    NOT?: top_pagesWhereInput | top_pagesWhereInput[]
    account_id?: IntNullableFilter<"top_pages"> | number | null
    url?: StringFilter<"top_pages"> | string
    title?: StringNullableFilter<"top_pages"> | string | null
    pageviews?: IntNullableFilter<"top_pages"> | number | null
    avg_time_on_page?: IntNullableFilter<"top_pages"> | number | null
    bounce_rate?: DecimalNullableFilter<"top_pages"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"top_pages"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"top_pages"> | Date | string | null
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
  }, "id">

  export type top_pagesOrderByWithAggregationInput = {
    id?: SortOrder
    account_id?: SortOrderInput | SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    pageviews?: SortOrderInput | SortOrder
    avg_time_on_page?: SortOrderInput | SortOrder
    bounce_rate?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: top_pagesCountOrderByAggregateInput
    _avg?: top_pagesAvgOrderByAggregateInput
    _max?: top_pagesMaxOrderByAggregateInput
    _min?: top_pagesMinOrderByAggregateInput
    _sum?: top_pagesSumOrderByAggregateInput
  }

  export type top_pagesScalarWhereWithAggregatesInput = {
    AND?: top_pagesScalarWhereWithAggregatesInput | top_pagesScalarWhereWithAggregatesInput[]
    OR?: top_pagesScalarWhereWithAggregatesInput[]
    NOT?: top_pagesScalarWhereWithAggregatesInput | top_pagesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"top_pages"> | number
    account_id?: IntNullableWithAggregatesFilter<"top_pages"> | number | null
    url?: StringWithAggregatesFilter<"top_pages"> | string
    title?: StringNullableWithAggregatesFilter<"top_pages"> | string | null
    pageviews?: IntNullableWithAggregatesFilter<"top_pages"> | number | null
    avg_time_on_page?: IntNullableWithAggregatesFilter<"top_pages"> | number | null
    bounce_rate?: DecimalNullableWithAggregatesFilter<"top_pages"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"top_pages"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"top_pages"> | Date | string | null
  }

  export type user_accountsWhereInput = {
    AND?: user_accountsWhereInput | user_accountsWhereInput[]
    OR?: user_accountsWhereInput[]
    NOT?: user_accountsWhereInput | user_accountsWhereInput[]
    user_id?: IntFilter<"user_accounts"> | number
    account_id?: StringFilter<"user_accounts"> | string
    accounts?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type user_accountsOrderByWithRelationInput = {
    user_id?: SortOrder
    account_id?: SortOrder
    accounts?: accountsOrderByWithRelationInput
    users?: usersOrderByWithRelationInput
  }

  export type user_accountsWhereUniqueInput = Prisma.AtLeast<{
    user_id_account_id?: user_accountsUser_idAccount_idCompoundUniqueInput
    AND?: user_accountsWhereInput | user_accountsWhereInput[]
    OR?: user_accountsWhereInput[]
    NOT?: user_accountsWhereInput | user_accountsWhereInput[]
    user_id?: IntFilter<"user_accounts"> | number
    account_id?: StringFilter<"user_accounts"> | string
    accounts?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "user_id_account_id">

  export type user_accountsOrderByWithAggregationInput = {
    user_id?: SortOrder
    account_id?: SortOrder
    _count?: user_accountsCountOrderByAggregateInput
    _avg?: user_accountsAvgOrderByAggregateInput
    _max?: user_accountsMaxOrderByAggregateInput
    _min?: user_accountsMinOrderByAggregateInput
    _sum?: user_accountsSumOrderByAggregateInput
  }

  export type user_accountsScalarWhereWithAggregatesInput = {
    AND?: user_accountsScalarWhereWithAggregatesInput | user_accountsScalarWhereWithAggregatesInput[]
    OR?: user_accountsScalarWhereWithAggregatesInput[]
    NOT?: user_accountsScalarWhereWithAggregatesInput | user_accountsScalarWhereWithAggregatesInput[]
    user_id?: IntWithAggregatesFilter<"user_accounts"> | number
    account_id?: StringWithAggregatesFilter<"user_accounts"> | string
  }

  export type user_activityWhereInput = {
    AND?: user_activityWhereInput | user_activityWhereInput[]
    OR?: user_activityWhereInput[]
    NOT?: user_activityWhereInput | user_activityWhereInput[]
    id?: IntFilter<"user_activity"> | number
    user_id?: IntNullableFilter<"user_activity"> | number | null
    date?: DateTimeFilter<"user_activity"> | Date | string
    logins?: IntNullableFilter<"user_activity"> | number | null
    pageviews?: IntNullableFilter<"user_activity"> | number | null
    created_at?: DateTimeNullableFilter<"user_activity"> | Date | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }

  export type user_activityOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    date?: SortOrder
    logins?: SortOrderInput | SortOrder
    pageviews?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_activityWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    user_id_date?: user_activityUser_idDateCompoundUniqueInput
    AND?: user_activityWhereInput | user_activityWhereInput[]
    OR?: user_activityWhereInput[]
    NOT?: user_activityWhereInput | user_activityWhereInput[]
    user_id?: IntNullableFilter<"user_activity"> | number | null
    date?: DateTimeFilter<"user_activity"> | Date | string
    logins?: IntNullableFilter<"user_activity"> | number | null
    pageviews?: IntNullableFilter<"user_activity"> | number | null
    created_at?: DateTimeNullableFilter<"user_activity"> | Date | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }, "id" | "user_id_date">

  export type user_activityOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    date?: SortOrder
    logins?: SortOrderInput | SortOrder
    pageviews?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: user_activityCountOrderByAggregateInput
    _avg?: user_activityAvgOrderByAggregateInput
    _max?: user_activityMaxOrderByAggregateInput
    _min?: user_activityMinOrderByAggregateInput
    _sum?: user_activitySumOrderByAggregateInput
  }

  export type user_activityScalarWhereWithAggregatesInput = {
    AND?: user_activityScalarWhereWithAggregatesInput | user_activityScalarWhereWithAggregatesInput[]
    OR?: user_activityScalarWhereWithAggregatesInput[]
    NOT?: user_activityScalarWhereWithAggregatesInput | user_activityScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"user_activity"> | number
    user_id?: IntNullableWithAggregatesFilter<"user_activity"> | number | null
    date?: DateTimeWithAggregatesFilter<"user_activity"> | Date | string
    logins?: IntNullableWithAggregatesFilter<"user_activity"> | number | null
    pageviews?: IntNullableWithAggregatesFilter<"user_activity"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"user_activity"> | Date | string | null
  }

  export type user_newslettersWhereInput = {
    AND?: user_newslettersWhereInput | user_newslettersWhereInput[]
    OR?: user_newslettersWhereInput[]
    NOT?: user_newslettersWhereInput | user_newslettersWhereInput[]
    id?: IntFilter<"user_newsletters"> | number
    user_id?: IntNullableFilter<"user_newsletters"> | number | null
    newsletter_id?: IntNullableFilter<"user_newsletters"> | number | null
    subscribed?: BoolNullableFilter<"user_newsletters"> | boolean | null
    open_rate?: DecimalNullableFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    click_rate?: DecimalNullableFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"user_newsletters"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"user_newsletters"> | Date | string | null
    newsletters?: XOR<NewslettersNullableScalarRelationFilter, newslettersWhereInput> | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }

  export type user_newslettersOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    newsletter_id?: SortOrderInput | SortOrder
    subscribed?: SortOrderInput | SortOrder
    open_rate?: SortOrderInput | SortOrder
    click_rate?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    newsletters?: newslettersOrderByWithRelationInput
    users?: usersOrderByWithRelationInput
  }

  export type user_newslettersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    user_id_newsletter_id?: user_newslettersUser_idNewsletter_idCompoundUniqueInput
    AND?: user_newslettersWhereInput | user_newslettersWhereInput[]
    OR?: user_newslettersWhereInput[]
    NOT?: user_newslettersWhereInput | user_newslettersWhereInput[]
    user_id?: IntNullableFilter<"user_newsletters"> | number | null
    newsletter_id?: IntNullableFilter<"user_newsletters"> | number | null
    subscribed?: BoolNullableFilter<"user_newsletters"> | boolean | null
    open_rate?: DecimalNullableFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    click_rate?: DecimalNullableFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"user_newsletters"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"user_newsletters"> | Date | string | null
    newsletters?: XOR<NewslettersNullableScalarRelationFilter, newslettersWhereInput> | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }, "id" | "user_id_newsletter_id">

  export type user_newslettersOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    newsletter_id?: SortOrderInput | SortOrder
    subscribed?: SortOrderInput | SortOrder
    open_rate?: SortOrderInput | SortOrder
    click_rate?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: user_newslettersCountOrderByAggregateInput
    _avg?: user_newslettersAvgOrderByAggregateInput
    _max?: user_newslettersMaxOrderByAggregateInput
    _min?: user_newslettersMinOrderByAggregateInput
    _sum?: user_newslettersSumOrderByAggregateInput
  }

  export type user_newslettersScalarWhereWithAggregatesInput = {
    AND?: user_newslettersScalarWhereWithAggregatesInput | user_newslettersScalarWhereWithAggregatesInput[]
    OR?: user_newslettersScalarWhereWithAggregatesInput[]
    NOT?: user_newslettersScalarWhereWithAggregatesInput | user_newslettersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"user_newsletters"> | number
    user_id?: IntNullableWithAggregatesFilter<"user_newsletters"> | number | null
    newsletter_id?: IntNullableWithAggregatesFilter<"user_newsletters"> | number | null
    subscribed?: BoolNullableWithAggregatesFilter<"user_newsletters"> | boolean | null
    open_rate?: DecimalNullableWithAggregatesFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    click_rate?: DecimalNullableWithAggregatesFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"user_newsletters"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"user_newsletters"> | Date | string | null
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: IntFilter<"users"> | number
    external_id?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    role?: StringNullableFilter<"users"> | string | null
    status?: StringNullableFilter<"users"> | string | null
    department?: StringNullableFilter<"users"> | string | null
    title?: StringNullableFilter<"users"> | string | null
    phone?: StringNullableFilter<"users"> | string | null
    join_date?: DateTimeNullableFilter<"users"> | Date | string | null
    last_login?: DateTimeNullableFilter<"users"> | Date | string | null
    login_count?: IntNullableFilter<"users"> | number | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"users"> | Date | string | null
    attributes?: JsonNullableFilter<"users">
    firstname?: StringNullableFilter<"users"> | string | null
    lastname?: StringNullableFilter<"users"> | string | null
    group_id?: UuidNullableFilter<"users"> | string | null
    last_synced_at?: DateTimeNullableFilter<"users"> | Date | string | null
    last_source?: StringNullableFilter<"users"> | string | null
    user_accounts?: User_accountsListRelationFilter
    user_activity?: User_activityListRelationFilter
    user_newsletters?: User_newslettersListRelationFilter
    groups?: XOR<GroupsNullableScalarRelationFilter, groupsWhereInput> | null
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    external_id?: SortOrder
    email?: SortOrder
    role?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    join_date?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    login_count?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    attributes?: SortOrderInput | SortOrder
    firstname?: SortOrderInput | SortOrder
    lastname?: SortOrderInput | SortOrder
    group_id?: SortOrderInput | SortOrder
    last_synced_at?: SortOrderInput | SortOrder
    last_source?: SortOrderInput | SortOrder
    user_accounts?: user_accountsOrderByRelationAggregateInput
    user_activity?: user_activityOrderByRelationAggregateInput
    user_newsletters?: user_newslettersOrderByRelationAggregateInput
    groups?: groupsOrderByWithRelationInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    external_id?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    email?: StringFilter<"users"> | string
    role?: StringNullableFilter<"users"> | string | null
    status?: StringNullableFilter<"users"> | string | null
    department?: StringNullableFilter<"users"> | string | null
    title?: StringNullableFilter<"users"> | string | null
    phone?: StringNullableFilter<"users"> | string | null
    join_date?: DateTimeNullableFilter<"users"> | Date | string | null
    last_login?: DateTimeNullableFilter<"users"> | Date | string | null
    login_count?: IntNullableFilter<"users"> | number | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"users"> | Date | string | null
    attributes?: JsonNullableFilter<"users">
    firstname?: StringNullableFilter<"users"> | string | null
    lastname?: StringNullableFilter<"users"> | string | null
    group_id?: UuidNullableFilter<"users"> | string | null
    last_synced_at?: DateTimeNullableFilter<"users"> | Date | string | null
    last_source?: StringNullableFilter<"users"> | string | null
    user_accounts?: User_accountsListRelationFilter
    user_activity?: User_activityListRelationFilter
    user_newsletters?: User_newslettersListRelationFilter
    groups?: XOR<GroupsNullableScalarRelationFilter, groupsWhereInput> | null
  }, "id" | "external_id">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    external_id?: SortOrder
    email?: SortOrder
    role?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    join_date?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    login_count?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    attributes?: SortOrderInput | SortOrder
    firstname?: SortOrderInput | SortOrder
    lastname?: SortOrderInput | SortOrder
    group_id?: SortOrderInput | SortOrder
    last_synced_at?: SortOrderInput | SortOrder
    last_source?: SortOrderInput | SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"users"> | number
    external_id?: StringWithAggregatesFilter<"users"> | string
    email?: StringWithAggregatesFilter<"users"> | string
    role?: StringNullableWithAggregatesFilter<"users"> | string | null
    status?: StringNullableWithAggregatesFilter<"users"> | string | null
    department?: StringNullableWithAggregatesFilter<"users"> | string | null
    title?: StringNullableWithAggregatesFilter<"users"> | string | null
    phone?: StringNullableWithAggregatesFilter<"users"> | string | null
    join_date?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    last_login?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    login_count?: IntNullableWithAggregatesFilter<"users"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    attributes?: JsonNullableWithAggregatesFilter<"users">
    firstname?: StringNullableWithAggregatesFilter<"users"> | string | null
    lastname?: StringNullableWithAggregatesFilter<"users"> | string | null
    group_id?: UuidNullableWithAggregatesFilter<"users"> | string | null
    last_synced_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    last_source?: StringNullableWithAggregatesFilter<"users"> | string | null
  }

  export type account_activityCreateInput = {
    date: Date | string
    active_users?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
    accounts?: accountsCreateNestedOneWithoutAccount_activityInput
  }

  export type account_activityUncheckedCreateInput = {
    id?: number
    account_id?: number | null
    date: Date | string
    active_users?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type account_activityUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accounts?: accountsUpdateOneWithoutAccount_activityNestedInput
  }

  export type account_activityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type account_activityCreateManyInput = {
    id?: number
    account_id?: number | null
    date: Date | string
    active_users?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type account_activityUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type account_activityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type accountsCreateInput = {
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityCreateNestedManyWithoutAccountsInput
    groups?: groupsCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityUncheckedCreateNestedManyWithoutAccountsInput
    groups?: groupsUncheckedCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageUncheckedCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsUncheckedCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesUncheckedCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsUpdateInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUpdateManyWithoutAccountsNestedInput
    groups?: groupsUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUncheckedUpdateManyWithoutAccountsNestedInput
    groups?: groupsUncheckedUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUncheckedUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUncheckedUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUncheckedUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type accountsCreateManyInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type accountsUpdateManyMutationInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type accountsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type attribute_definitionsCreateInput = {
    slug: string
    label?: string | null
    input_type?: string | null
    required?: boolean | null
    select_options?: NullableJsonNullValueInput | InputJsonValue
  }

  export type attribute_definitionsUncheckedCreateInput = {
    slug: string
    label?: string | null
    input_type?: string | null
    required?: boolean | null
    select_options?: NullableJsonNullValueInput | InputJsonValue
  }

  export type attribute_definitionsUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    input_type?: NullableStringFieldUpdateOperationsInput | string | null
    required?: NullableBoolFieldUpdateOperationsInput | boolean | null
    select_options?: NullableJsonNullValueInput | InputJsonValue
  }

  export type attribute_definitionsUncheckedUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    input_type?: NullableStringFieldUpdateOperationsInput | string | null
    required?: NullableBoolFieldUpdateOperationsInput | boolean | null
    select_options?: NullableJsonNullValueInput | InputJsonValue
  }

  export type attribute_definitionsCreateManyInput = {
    slug: string
    label?: string | null
    input_type?: string | null
    required?: boolean | null
    select_options?: NullableJsonNullValueInput | InputJsonValue
  }

  export type attribute_definitionsUpdateManyMutationInput = {
    slug?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    input_type?: NullableStringFieldUpdateOperationsInput | string | null
    required?: NullableBoolFieldUpdateOperationsInput | boolean | null
    select_options?: NullableJsonNullValueInput | InputJsonValue
  }

  export type attribute_definitionsUncheckedUpdateManyInput = {
    slug?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    input_type?: NullableStringFieldUpdateOperationsInput | string | null
    required?: NullableBoolFieldUpdateOperationsInput | boolean | null
    select_options?: NullableJsonNullValueInput | InputJsonValue
  }

  export type groupsCreateInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
    accounts?: accountsCreateNestedOneWithoutGroupsInput
    users?: usersCreateNestedManyWithoutGroupsInput
  }

  export type groupsUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
    account_id_new?: string | null
    users?: usersUncheckedCreateNestedManyWithoutGroupsInput
  }

  export type groupsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
    accounts?: accountsUpdateOneWithoutGroupsNestedInput
    users?: usersUpdateManyWithoutGroupsNestedInput
  }

  export type groupsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
    account_id_new?: NullableStringFieldUpdateOperationsInput | string | null
    users?: usersUncheckedUpdateManyWithoutGroupsNestedInput
  }

  export type groupsCreateManyInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
    account_id_new?: string | null
  }

  export type groupsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
  }

  export type groupsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
    account_id_new?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type newslettersCreateInput = {
    name: string
    description?: string | null
    created_at?: Date | string | null
    user_newsletters?: user_newslettersCreateNestedManyWithoutNewslettersInput
  }

  export type newslettersUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    created_at?: Date | string | null
    user_newsletters?: user_newslettersUncheckedCreateNestedManyWithoutNewslettersInput
  }

  export type newslettersUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_newsletters?: user_newslettersUpdateManyWithoutNewslettersNestedInput
  }

  export type newslettersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_newsletters?: user_newslettersUncheckedUpdateManyWithoutNewslettersNestedInput
  }

  export type newslettersCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    created_at?: Date | string | null
  }

  export type newslettersUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type newslettersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_usageCreateInput = {
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    accounts?: accountsCreateNestedOneWithoutProduct_usageInput
    products?: productsCreateNestedOneWithoutProduct_usageInput
  }

  export type product_usageUncheckedCreateInput = {
    id?: number
    account_id?: number | null
    product_id?: number | null
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type product_usageUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accounts?: accountsUpdateOneWithoutProduct_usageNestedInput
    products?: productsUpdateOneWithoutProduct_usageNestedInput
  }

  export type product_usageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    product_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_usageCreateManyInput = {
    id?: number
    account_id?: number | null
    product_id?: number | null
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type product_usageUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_usageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    product_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type productsCreateInput = {
    name: string
    description?: string | null
    created_at?: Date | string | null
    product_usage?: product_usageCreateNestedManyWithoutProductsInput
  }

  export type productsUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    created_at?: Date | string | null
    product_usage?: product_usageUncheckedCreateNestedManyWithoutProductsInput
  }

  export type productsUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product_usage?: product_usageUpdateManyWithoutProductsNestedInput
  }

  export type productsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product_usage?: product_usageUncheckedUpdateManyWithoutProductsNestedInput
  }

  export type productsCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    created_at?: Date | string | null
  }

  export type productsUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type productsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscriptionsCreateInput = {
    external_id: string
    customer_name: string
    email?: string | null
    plan: string
    plan_type: string
    status: string
    amount?: Decimal | DecimalJsLike | number | string | null
    billing_cycle?: string | null
    start_date?: Date | string | null
    next_billing?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    accounts?: accountsCreateNestedOneWithoutSubscriptionsInput
  }

  export type subscriptionsUncheckedCreateInput = {
    id?: number
    external_id: string
    account_id?: number | null
    customer_name: string
    email?: string | null
    plan: string
    plan_type: string
    status: string
    amount?: Decimal | DecimalJsLike | number | string | null
    billing_cycle?: string | null
    start_date?: Date | string | null
    next_billing?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscriptionsUpdateInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    customer_name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    plan_type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accounts?: accountsUpdateOneWithoutSubscriptionsNestedInput
  }

  export type subscriptionsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    customer_name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    plan_type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscriptionsCreateManyInput = {
    id?: number
    external_id: string
    account_id?: number | null
    customer_name: string
    email?: string | null
    plan: string
    plan_type: string
    status: string
    amount?: Decimal | DecimalJsLike | number | string | null
    billing_cycle?: string | null
    start_date?: Date | string | null
    next_billing?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscriptionsUpdateManyMutationInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    customer_name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    plan_type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscriptionsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    customer_name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    plan_type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type top_pagesCreateInput = {
    url: string
    title?: string | null
    pageviews?: number | null
    avg_time_on_page?: number | null
    bounce_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    accounts?: accountsCreateNestedOneWithoutTop_pagesInput
  }

  export type top_pagesUncheckedCreateInput = {
    id?: number
    account_id?: number | null
    url: string
    title?: string | null
    pageviews?: number | null
    avg_time_on_page?: number | null
    bounce_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type top_pagesUpdateInput = {
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    avg_time_on_page?: NullableIntFieldUpdateOperationsInput | number | null
    bounce_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accounts?: accountsUpdateOneWithoutTop_pagesNestedInput
  }

  export type top_pagesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    avg_time_on_page?: NullableIntFieldUpdateOperationsInput | number | null
    bounce_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type top_pagesCreateManyInput = {
    id?: number
    account_id?: number | null
    url: string
    title?: string | null
    pageviews?: number | null
    avg_time_on_page?: number | null
    bounce_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type top_pagesUpdateManyMutationInput = {
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    avg_time_on_page?: NullableIntFieldUpdateOperationsInput | number | null
    bounce_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type top_pagesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    avg_time_on_page?: NullableIntFieldUpdateOperationsInput | number | null
    bounce_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_accountsCreateInput = {
    accounts: accountsCreateNestedOneWithoutUser_accountsInput
    users: usersCreateNestedOneWithoutUser_accountsInput
  }

  export type user_accountsUncheckedCreateInput = {
    user_id: number
    account_id: string
  }

  export type user_accountsUpdateInput = {
    accounts?: accountsUpdateOneRequiredWithoutUser_accountsNestedInput
    users?: usersUpdateOneRequiredWithoutUser_accountsNestedInput
  }

  export type user_accountsUncheckedUpdateInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    account_id?: StringFieldUpdateOperationsInput | string
  }

  export type user_accountsCreateManyInput = {
    user_id: number
    account_id: string
  }

  export type user_accountsUpdateManyMutationInput = {

  }

  export type user_accountsUncheckedUpdateManyInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    account_id?: StringFieldUpdateOperationsInput | string
  }

  export type user_activityCreateInput = {
    date: Date | string
    logins?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
    users?: usersCreateNestedOneWithoutUser_activityInput
  }

  export type user_activityUncheckedCreateInput = {
    id?: number
    user_id?: number | null
    date: Date | string
    logins?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type user_activityUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutUser_activityNestedInput
  }

  export type user_activityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_activityCreateManyInput = {
    id?: number
    user_id?: number | null
    date: Date | string
    logins?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type user_activityUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_activityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_newslettersCreateInput = {
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    newsletters?: newslettersCreateNestedOneWithoutUser_newslettersInput
    users?: usersCreateNestedOneWithoutUser_newslettersInput
  }

  export type user_newslettersUncheckedCreateInput = {
    id?: number
    user_id?: number | null
    newsletter_id?: number | null
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type user_newslettersUpdateInput = {
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    newsletters?: newslettersUpdateOneWithoutUser_newslettersNestedInput
    users?: usersUpdateOneWithoutUser_newslettersNestedInput
  }

  export type user_newslettersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    newsletter_id?: NullableIntFieldUpdateOperationsInput | number | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_newslettersCreateManyInput = {
    id?: number
    user_id?: number | null
    newsletter_id?: number | null
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type user_newslettersUpdateManyMutationInput = {
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_newslettersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    newsletter_id?: NullableIntFieldUpdateOperationsInput | number | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersCreateInput = {
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsCreateNestedManyWithoutUsersInput
    user_activity?: user_activityCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersCreateNestedManyWithoutUsersInput
    groups?: groupsCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateInput = {
    id?: number
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    group_id?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutUsersInput
    user_activity?: user_activityUncheckedCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUpdateManyWithoutUsersNestedInput
    user_activity?: user_activityUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUpdateManyWithoutUsersNestedInput
    groups?: groupsUpdateOneWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    group_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUncheckedUpdateManyWithoutUsersNestedInput
    user_activity?: user_activityUncheckedUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateManyInput = {
    id?: number
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    group_id?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
  }

  export type usersUpdateManyMutationInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type usersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    group_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AccountsNullableScalarRelationFilter = {
    is?: accountsWhereInput | null
    isNot?: accountsWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type account_activityAccount_idDateCompoundUniqueInput = {
    account_id: number
    date: Date | string
  }

  export type account_activityCountOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    date?: SortOrder
    active_users?: SortOrder
    pageviews?: SortOrder
    created_at?: SortOrder
  }

  export type account_activityAvgOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    active_users?: SortOrder
    pageviews?: SortOrder
  }

  export type account_activityMaxOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    date?: SortOrder
    active_users?: SortOrder
    pageviews?: SortOrder
    created_at?: SortOrder
  }

  export type account_activityMinOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    date?: SortOrder
    active_users?: SortOrder
    pageviews?: SortOrder
    created_at?: SortOrder
  }

  export type account_activitySumOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    active_users?: SortOrder
    pageviews?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type Account_activityListRelationFilter = {
    every?: account_activityWhereInput
    some?: account_activityWhereInput
    none?: account_activityWhereInput
  }

  export type GroupsListRelationFilter = {
    every?: groupsWhereInput
    some?: groupsWhereInput
    none?: groupsWhereInput
  }

  export type Product_usageListRelationFilter = {
    every?: product_usageWhereInput
    some?: product_usageWhereInput
    none?: product_usageWhereInput
  }

  export type SubscriptionsListRelationFilter = {
    every?: subscriptionsWhereInput
    some?: subscriptionsWhereInput
    none?: subscriptionsWhereInput
  }

  export type Top_pagesListRelationFilter = {
    every?: top_pagesWhereInput
    some?: top_pagesWhereInput
    none?: top_pagesWhereInput
  }

  export type User_accountsListRelationFilter = {
    every?: user_accountsWhereInput
    some?: user_accountsWhereInput
    none?: user_accountsWhereInput
  }

  export type account_activityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type groupsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type product_usageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type subscriptionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type top_pagesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type user_accountsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type accountsCountOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    industry?: SortOrder
    website?: SortOrder
    contact_name?: SortOrder
    contact_email?: SortOrder
    contact_phone?: SortOrder
    address?: SortOrder
    total_users?: SortOrder
    active_users?: SortOrder
    mrr?: SortOrder
    subscription_start?: SortOrder
    next_billing?: SortOrder
    health_score?: SortOrder
    rep_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type accountsAvgOrderByAggregateInput = {
    id?: SortOrder
    total_users?: SortOrder
    active_users?: SortOrder
    mrr?: SortOrder
    health_score?: SortOrder
  }

  export type accountsMaxOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    industry?: SortOrder
    website?: SortOrder
    contact_name?: SortOrder
    contact_email?: SortOrder
    contact_phone?: SortOrder
    address?: SortOrder
    total_users?: SortOrder
    active_users?: SortOrder
    mrr?: SortOrder
    subscription_start?: SortOrder
    next_billing?: SortOrder
    health_score?: SortOrder
    rep_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type accountsMinOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    industry?: SortOrder
    website?: SortOrder
    contact_name?: SortOrder
    contact_email?: SortOrder
    contact_phone?: SortOrder
    address?: SortOrder
    total_users?: SortOrder
    active_users?: SortOrder
    mrr?: SortOrder
    subscription_start?: SortOrder
    next_billing?: SortOrder
    health_score?: SortOrder
    rep_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type accountsSumOrderByAggregateInput = {
    id?: SortOrder
    total_users?: SortOrder
    active_users?: SortOrder
    mrr?: SortOrder
    health_score?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type attribute_definitionsCountOrderByAggregateInput = {
    slug?: SortOrder
    label?: SortOrder
    input_type?: SortOrder
    required?: SortOrder
    select_options?: SortOrder
  }

  export type attribute_definitionsMaxOrderByAggregateInput = {
    slug?: SortOrder
    label?: SortOrder
    input_type?: SortOrder
    required?: SortOrder
  }

  export type attribute_definitionsMinOrderByAggregateInput = {
    slug?: SortOrder
    label?: SortOrder
    input_type?: SortOrder
    required?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UsersListRelationFilter = {
    every?: usersWhereInput
    some?: usersWhereInput
    none?: usersWhereInput
  }

  export type usersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type groupsAccount_idSlugCompoundUniqueInput = {
    account_id: number
    slug: string
  }

  export type groupsAccount_id_newSlugCompoundUniqueInput = {
    account_id_new: string
    slug: string
  }

  export type groupsCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    color?: SortOrder
    icon?: SortOrder
    default_template?: SortOrder
    product_grant_ids?: SortOrder
    demographics?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_count?: SortOrder
    account_id?: SortOrder
    account_id_new?: SortOrder
  }

  export type groupsAvgOrderByAggregateInput = {
    user_count?: SortOrder
    account_id?: SortOrder
  }

  export type groupsMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    color?: SortOrder
    icon?: SortOrder
    default_template?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_count?: SortOrder
    account_id?: SortOrder
    account_id_new?: SortOrder
  }

  export type groupsMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    color?: SortOrder
    icon?: SortOrder
    default_template?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_count?: SortOrder
    account_id?: SortOrder
    account_id_new?: SortOrder
  }

  export type groupsSumOrderByAggregateInput = {
    user_count?: SortOrder
    account_id?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type User_newslettersListRelationFilter = {
    every?: user_newslettersWhereInput
    some?: user_newslettersWhereInput
    none?: user_newslettersWhereInput
  }

  export type user_newslettersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type newslettersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type newslettersAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type newslettersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type newslettersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type newslettersSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProductsNullableScalarRelationFilter = {
    is?: productsWhereInput | null
    isNot?: productsWhereInput | null
  }

  export type product_usageAccount_idProduct_idDateCompoundUniqueInput = {
    account_id: number
    product_id: number
    date: Date | string
  }

  export type product_usageCountOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    product_id?: SortOrder
    date?: SortOrder
    pageviews?: SortOrder
    active_users?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type product_usageAvgOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    product_id?: SortOrder
    pageviews?: SortOrder
    active_users?: SortOrder
  }

  export type product_usageMaxOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    product_id?: SortOrder
    date?: SortOrder
    pageviews?: SortOrder
    active_users?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type product_usageMinOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    product_id?: SortOrder
    date?: SortOrder
    pageviews?: SortOrder
    active_users?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type product_usageSumOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    product_id?: SortOrder
    pageviews?: SortOrder
    active_users?: SortOrder
  }

  export type productsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type productsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type productsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type productsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type productsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type subscriptionsCountOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    account_id?: SortOrder
    customer_name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    plan_type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    billing_cycle?: SortOrder
    start_date?: SortOrder
    next_billing?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type subscriptionsAvgOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    amount?: SortOrder
  }

  export type subscriptionsMaxOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    account_id?: SortOrder
    customer_name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    plan_type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    billing_cycle?: SortOrder
    start_date?: SortOrder
    next_billing?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type subscriptionsMinOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    account_id?: SortOrder
    customer_name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    plan_type?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    billing_cycle?: SortOrder
    start_date?: SortOrder
    next_billing?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type subscriptionsSumOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    amount?: SortOrder
  }

  export type top_pagesCountOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    pageviews?: SortOrder
    avg_time_on_page?: SortOrder
    bounce_rate?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type top_pagesAvgOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    pageviews?: SortOrder
    avg_time_on_page?: SortOrder
    bounce_rate?: SortOrder
  }

  export type top_pagesMaxOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    pageviews?: SortOrder
    avg_time_on_page?: SortOrder
    bounce_rate?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type top_pagesMinOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    pageviews?: SortOrder
    avg_time_on_page?: SortOrder
    bounce_rate?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type top_pagesSumOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    pageviews?: SortOrder
    avg_time_on_page?: SortOrder
    bounce_rate?: SortOrder
  }

  export type AccountsScalarRelationFilter = {
    is?: accountsWhereInput
    isNot?: accountsWhereInput
  }

  export type UsersScalarRelationFilter = {
    is?: usersWhereInput
    isNot?: usersWhereInput
  }

  export type user_accountsUser_idAccount_idCompoundUniqueInput = {
    user_id: number
    account_id: string
  }

  export type user_accountsCountOrderByAggregateInput = {
    user_id?: SortOrder
    account_id?: SortOrder
  }

  export type user_accountsAvgOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type user_accountsMaxOrderByAggregateInput = {
    user_id?: SortOrder
    account_id?: SortOrder
  }

  export type user_accountsMinOrderByAggregateInput = {
    user_id?: SortOrder
    account_id?: SortOrder
  }

  export type user_accountsSumOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type UsersNullableScalarRelationFilter = {
    is?: usersWhereInput | null
    isNot?: usersWhereInput | null
  }

  export type user_activityUser_idDateCompoundUniqueInput = {
    user_id: number
    date: Date | string
  }

  export type user_activityCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    date?: SortOrder
    logins?: SortOrder
    pageviews?: SortOrder
    created_at?: SortOrder
  }

  export type user_activityAvgOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    logins?: SortOrder
    pageviews?: SortOrder
  }

  export type user_activityMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    date?: SortOrder
    logins?: SortOrder
    pageviews?: SortOrder
    created_at?: SortOrder
  }

  export type user_activityMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    date?: SortOrder
    logins?: SortOrder
    pageviews?: SortOrder
    created_at?: SortOrder
  }

  export type user_activitySumOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    logins?: SortOrder
    pageviews?: SortOrder
  }

  export type NewslettersNullableScalarRelationFilter = {
    is?: newslettersWhereInput | null
    isNot?: newslettersWhereInput | null
  }

  export type user_newslettersUser_idNewsletter_idCompoundUniqueInput = {
    user_id: number
    newsletter_id: number
  }

  export type user_newslettersCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    newsletter_id?: SortOrder
    subscribed?: SortOrder
    open_rate?: SortOrder
    click_rate?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_newslettersAvgOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    newsletter_id?: SortOrder
    open_rate?: SortOrder
    click_rate?: SortOrder
  }

  export type user_newslettersMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    newsletter_id?: SortOrder
    subscribed?: SortOrder
    open_rate?: SortOrder
    click_rate?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_newslettersMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    newsletter_id?: SortOrder
    subscribed?: SortOrder
    open_rate?: SortOrder
    click_rate?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_newslettersSumOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    newsletter_id?: SortOrder
    open_rate?: SortOrder
    click_rate?: SortOrder
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type User_activityListRelationFilter = {
    every?: user_activityWhereInput
    some?: user_activityWhereInput
    none?: user_activityWhereInput
  }

  export type GroupsNullableScalarRelationFilter = {
    is?: groupsWhereInput | null
    isNot?: groupsWhereInput | null
  }

  export type user_activityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrder
    title?: SortOrder
    phone?: SortOrder
    join_date?: SortOrder
    last_login?: SortOrder
    login_count?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    attributes?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    group_id?: SortOrder
    last_synced_at?: SortOrder
    last_source?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    id?: SortOrder
    login_count?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrder
    title?: SortOrder
    phone?: SortOrder
    join_date?: SortOrder
    last_login?: SortOrder
    login_count?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    group_id?: SortOrder
    last_synced_at?: SortOrder
    last_source?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    external_id?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrder
    title?: SortOrder
    phone?: SortOrder
    join_date?: SortOrder
    last_login?: SortOrder
    login_count?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    group_id?: SortOrder
    last_synced_at?: SortOrder
    last_source?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    id?: SortOrder
    login_count?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type accountsCreateNestedOneWithoutAccount_activityInput = {
    create?: XOR<accountsCreateWithoutAccount_activityInput, accountsUncheckedCreateWithoutAccount_activityInput>
    connectOrCreate?: accountsCreateOrConnectWithoutAccount_activityInput
    connect?: accountsWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type accountsUpdateOneWithoutAccount_activityNestedInput = {
    create?: XOR<accountsCreateWithoutAccount_activityInput, accountsUncheckedCreateWithoutAccount_activityInput>
    connectOrCreate?: accountsCreateOrConnectWithoutAccount_activityInput
    upsert?: accountsUpsertWithoutAccount_activityInput
    disconnect?: accountsWhereInput | boolean
    delete?: accountsWhereInput | boolean
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutAccount_activityInput, accountsUpdateWithoutAccount_activityInput>, accountsUncheckedUpdateWithoutAccount_activityInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type account_activityCreateNestedManyWithoutAccountsInput = {
    create?: XOR<account_activityCreateWithoutAccountsInput, account_activityUncheckedCreateWithoutAccountsInput> | account_activityCreateWithoutAccountsInput[] | account_activityUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: account_activityCreateOrConnectWithoutAccountsInput | account_activityCreateOrConnectWithoutAccountsInput[]
    createMany?: account_activityCreateManyAccountsInputEnvelope
    connect?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
  }

  export type groupsCreateNestedManyWithoutAccountsInput = {
    create?: XOR<groupsCreateWithoutAccountsInput, groupsUncheckedCreateWithoutAccountsInput> | groupsCreateWithoutAccountsInput[] | groupsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: groupsCreateOrConnectWithoutAccountsInput | groupsCreateOrConnectWithoutAccountsInput[]
    createMany?: groupsCreateManyAccountsInputEnvelope
    connect?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
  }

  export type product_usageCreateNestedManyWithoutAccountsInput = {
    create?: XOR<product_usageCreateWithoutAccountsInput, product_usageUncheckedCreateWithoutAccountsInput> | product_usageCreateWithoutAccountsInput[] | product_usageUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutAccountsInput | product_usageCreateOrConnectWithoutAccountsInput[]
    createMany?: product_usageCreateManyAccountsInputEnvelope
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
  }

  export type subscriptionsCreateNestedManyWithoutAccountsInput = {
    create?: XOR<subscriptionsCreateWithoutAccountsInput, subscriptionsUncheckedCreateWithoutAccountsInput> | subscriptionsCreateWithoutAccountsInput[] | subscriptionsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: subscriptionsCreateOrConnectWithoutAccountsInput | subscriptionsCreateOrConnectWithoutAccountsInput[]
    createMany?: subscriptionsCreateManyAccountsInputEnvelope
    connect?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
  }

  export type top_pagesCreateNestedManyWithoutAccountsInput = {
    create?: XOR<top_pagesCreateWithoutAccountsInput, top_pagesUncheckedCreateWithoutAccountsInput> | top_pagesCreateWithoutAccountsInput[] | top_pagesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: top_pagesCreateOrConnectWithoutAccountsInput | top_pagesCreateOrConnectWithoutAccountsInput[]
    createMany?: top_pagesCreateManyAccountsInputEnvelope
    connect?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
  }

  export type user_accountsCreateNestedManyWithoutAccountsInput = {
    create?: XOR<user_accountsCreateWithoutAccountsInput, user_accountsUncheckedCreateWithoutAccountsInput> | user_accountsCreateWithoutAccountsInput[] | user_accountsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutAccountsInput | user_accountsCreateOrConnectWithoutAccountsInput[]
    createMany?: user_accountsCreateManyAccountsInputEnvelope
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
  }

  export type account_activityUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<account_activityCreateWithoutAccountsInput, account_activityUncheckedCreateWithoutAccountsInput> | account_activityCreateWithoutAccountsInput[] | account_activityUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: account_activityCreateOrConnectWithoutAccountsInput | account_activityCreateOrConnectWithoutAccountsInput[]
    createMany?: account_activityCreateManyAccountsInputEnvelope
    connect?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
  }

  export type groupsUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<groupsCreateWithoutAccountsInput, groupsUncheckedCreateWithoutAccountsInput> | groupsCreateWithoutAccountsInput[] | groupsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: groupsCreateOrConnectWithoutAccountsInput | groupsCreateOrConnectWithoutAccountsInput[]
    createMany?: groupsCreateManyAccountsInputEnvelope
    connect?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
  }

  export type product_usageUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<product_usageCreateWithoutAccountsInput, product_usageUncheckedCreateWithoutAccountsInput> | product_usageCreateWithoutAccountsInput[] | product_usageUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutAccountsInput | product_usageCreateOrConnectWithoutAccountsInput[]
    createMany?: product_usageCreateManyAccountsInputEnvelope
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
  }

  export type subscriptionsUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<subscriptionsCreateWithoutAccountsInput, subscriptionsUncheckedCreateWithoutAccountsInput> | subscriptionsCreateWithoutAccountsInput[] | subscriptionsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: subscriptionsCreateOrConnectWithoutAccountsInput | subscriptionsCreateOrConnectWithoutAccountsInput[]
    createMany?: subscriptionsCreateManyAccountsInputEnvelope
    connect?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
  }

  export type top_pagesUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<top_pagesCreateWithoutAccountsInput, top_pagesUncheckedCreateWithoutAccountsInput> | top_pagesCreateWithoutAccountsInput[] | top_pagesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: top_pagesCreateOrConnectWithoutAccountsInput | top_pagesCreateOrConnectWithoutAccountsInput[]
    createMany?: top_pagesCreateManyAccountsInputEnvelope
    connect?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
  }

  export type user_accountsUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<user_accountsCreateWithoutAccountsInput, user_accountsUncheckedCreateWithoutAccountsInput> | user_accountsCreateWithoutAccountsInput[] | user_accountsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutAccountsInput | user_accountsCreateOrConnectWithoutAccountsInput[]
    createMany?: user_accountsCreateManyAccountsInputEnvelope
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type account_activityUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<account_activityCreateWithoutAccountsInput, account_activityUncheckedCreateWithoutAccountsInput> | account_activityCreateWithoutAccountsInput[] | account_activityUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: account_activityCreateOrConnectWithoutAccountsInput | account_activityCreateOrConnectWithoutAccountsInput[]
    upsert?: account_activityUpsertWithWhereUniqueWithoutAccountsInput | account_activityUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: account_activityCreateManyAccountsInputEnvelope
    set?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    disconnect?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    delete?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    connect?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    update?: account_activityUpdateWithWhereUniqueWithoutAccountsInput | account_activityUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: account_activityUpdateManyWithWhereWithoutAccountsInput | account_activityUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: account_activityScalarWhereInput | account_activityScalarWhereInput[]
  }

  export type groupsUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<groupsCreateWithoutAccountsInput, groupsUncheckedCreateWithoutAccountsInput> | groupsCreateWithoutAccountsInput[] | groupsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: groupsCreateOrConnectWithoutAccountsInput | groupsCreateOrConnectWithoutAccountsInput[]
    upsert?: groupsUpsertWithWhereUniqueWithoutAccountsInput | groupsUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: groupsCreateManyAccountsInputEnvelope
    set?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    disconnect?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    delete?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    connect?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    update?: groupsUpdateWithWhereUniqueWithoutAccountsInput | groupsUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: groupsUpdateManyWithWhereWithoutAccountsInput | groupsUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: groupsScalarWhereInput | groupsScalarWhereInput[]
  }

  export type product_usageUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<product_usageCreateWithoutAccountsInput, product_usageUncheckedCreateWithoutAccountsInput> | product_usageCreateWithoutAccountsInput[] | product_usageUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutAccountsInput | product_usageCreateOrConnectWithoutAccountsInput[]
    upsert?: product_usageUpsertWithWhereUniqueWithoutAccountsInput | product_usageUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: product_usageCreateManyAccountsInputEnvelope
    set?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    disconnect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    delete?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    update?: product_usageUpdateWithWhereUniqueWithoutAccountsInput | product_usageUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: product_usageUpdateManyWithWhereWithoutAccountsInput | product_usageUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: product_usageScalarWhereInput | product_usageScalarWhereInput[]
  }

  export type subscriptionsUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<subscriptionsCreateWithoutAccountsInput, subscriptionsUncheckedCreateWithoutAccountsInput> | subscriptionsCreateWithoutAccountsInput[] | subscriptionsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: subscriptionsCreateOrConnectWithoutAccountsInput | subscriptionsCreateOrConnectWithoutAccountsInput[]
    upsert?: subscriptionsUpsertWithWhereUniqueWithoutAccountsInput | subscriptionsUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: subscriptionsCreateManyAccountsInputEnvelope
    set?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    disconnect?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    delete?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    connect?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    update?: subscriptionsUpdateWithWhereUniqueWithoutAccountsInput | subscriptionsUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: subscriptionsUpdateManyWithWhereWithoutAccountsInput | subscriptionsUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: subscriptionsScalarWhereInput | subscriptionsScalarWhereInput[]
  }

  export type top_pagesUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<top_pagesCreateWithoutAccountsInput, top_pagesUncheckedCreateWithoutAccountsInput> | top_pagesCreateWithoutAccountsInput[] | top_pagesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: top_pagesCreateOrConnectWithoutAccountsInput | top_pagesCreateOrConnectWithoutAccountsInput[]
    upsert?: top_pagesUpsertWithWhereUniqueWithoutAccountsInput | top_pagesUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: top_pagesCreateManyAccountsInputEnvelope
    set?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    disconnect?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    delete?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    connect?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    update?: top_pagesUpdateWithWhereUniqueWithoutAccountsInput | top_pagesUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: top_pagesUpdateManyWithWhereWithoutAccountsInput | top_pagesUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: top_pagesScalarWhereInput | top_pagesScalarWhereInput[]
  }

  export type user_accountsUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<user_accountsCreateWithoutAccountsInput, user_accountsUncheckedCreateWithoutAccountsInput> | user_accountsCreateWithoutAccountsInput[] | user_accountsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutAccountsInput | user_accountsCreateOrConnectWithoutAccountsInput[]
    upsert?: user_accountsUpsertWithWhereUniqueWithoutAccountsInput | user_accountsUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: user_accountsCreateManyAccountsInputEnvelope
    set?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    disconnect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    delete?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    update?: user_accountsUpdateWithWhereUniqueWithoutAccountsInput | user_accountsUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: user_accountsUpdateManyWithWhereWithoutAccountsInput | user_accountsUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: user_accountsScalarWhereInput | user_accountsScalarWhereInput[]
  }

  export type account_activityUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<account_activityCreateWithoutAccountsInput, account_activityUncheckedCreateWithoutAccountsInput> | account_activityCreateWithoutAccountsInput[] | account_activityUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: account_activityCreateOrConnectWithoutAccountsInput | account_activityCreateOrConnectWithoutAccountsInput[]
    upsert?: account_activityUpsertWithWhereUniqueWithoutAccountsInput | account_activityUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: account_activityCreateManyAccountsInputEnvelope
    set?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    disconnect?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    delete?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    connect?: account_activityWhereUniqueInput | account_activityWhereUniqueInput[]
    update?: account_activityUpdateWithWhereUniqueWithoutAccountsInput | account_activityUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: account_activityUpdateManyWithWhereWithoutAccountsInput | account_activityUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: account_activityScalarWhereInput | account_activityScalarWhereInput[]
  }

  export type groupsUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<groupsCreateWithoutAccountsInput, groupsUncheckedCreateWithoutAccountsInput> | groupsCreateWithoutAccountsInput[] | groupsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: groupsCreateOrConnectWithoutAccountsInput | groupsCreateOrConnectWithoutAccountsInput[]
    upsert?: groupsUpsertWithWhereUniqueWithoutAccountsInput | groupsUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: groupsCreateManyAccountsInputEnvelope
    set?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    disconnect?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    delete?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    connect?: groupsWhereUniqueInput | groupsWhereUniqueInput[]
    update?: groupsUpdateWithWhereUniqueWithoutAccountsInput | groupsUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: groupsUpdateManyWithWhereWithoutAccountsInput | groupsUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: groupsScalarWhereInput | groupsScalarWhereInput[]
  }

  export type product_usageUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<product_usageCreateWithoutAccountsInput, product_usageUncheckedCreateWithoutAccountsInput> | product_usageCreateWithoutAccountsInput[] | product_usageUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutAccountsInput | product_usageCreateOrConnectWithoutAccountsInput[]
    upsert?: product_usageUpsertWithWhereUniqueWithoutAccountsInput | product_usageUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: product_usageCreateManyAccountsInputEnvelope
    set?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    disconnect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    delete?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    update?: product_usageUpdateWithWhereUniqueWithoutAccountsInput | product_usageUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: product_usageUpdateManyWithWhereWithoutAccountsInput | product_usageUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: product_usageScalarWhereInput | product_usageScalarWhereInput[]
  }

  export type subscriptionsUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<subscriptionsCreateWithoutAccountsInput, subscriptionsUncheckedCreateWithoutAccountsInput> | subscriptionsCreateWithoutAccountsInput[] | subscriptionsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: subscriptionsCreateOrConnectWithoutAccountsInput | subscriptionsCreateOrConnectWithoutAccountsInput[]
    upsert?: subscriptionsUpsertWithWhereUniqueWithoutAccountsInput | subscriptionsUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: subscriptionsCreateManyAccountsInputEnvelope
    set?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    disconnect?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    delete?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    connect?: subscriptionsWhereUniqueInput | subscriptionsWhereUniqueInput[]
    update?: subscriptionsUpdateWithWhereUniqueWithoutAccountsInput | subscriptionsUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: subscriptionsUpdateManyWithWhereWithoutAccountsInput | subscriptionsUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: subscriptionsScalarWhereInput | subscriptionsScalarWhereInput[]
  }

  export type top_pagesUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<top_pagesCreateWithoutAccountsInput, top_pagesUncheckedCreateWithoutAccountsInput> | top_pagesCreateWithoutAccountsInput[] | top_pagesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: top_pagesCreateOrConnectWithoutAccountsInput | top_pagesCreateOrConnectWithoutAccountsInput[]
    upsert?: top_pagesUpsertWithWhereUniqueWithoutAccountsInput | top_pagesUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: top_pagesCreateManyAccountsInputEnvelope
    set?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    disconnect?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    delete?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    connect?: top_pagesWhereUniqueInput | top_pagesWhereUniqueInput[]
    update?: top_pagesUpdateWithWhereUniqueWithoutAccountsInput | top_pagesUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: top_pagesUpdateManyWithWhereWithoutAccountsInput | top_pagesUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: top_pagesScalarWhereInput | top_pagesScalarWhereInput[]
  }

  export type user_accountsUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<user_accountsCreateWithoutAccountsInput, user_accountsUncheckedCreateWithoutAccountsInput> | user_accountsCreateWithoutAccountsInput[] | user_accountsUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutAccountsInput | user_accountsCreateOrConnectWithoutAccountsInput[]
    upsert?: user_accountsUpsertWithWhereUniqueWithoutAccountsInput | user_accountsUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: user_accountsCreateManyAccountsInputEnvelope
    set?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    disconnect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    delete?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    update?: user_accountsUpdateWithWhereUniqueWithoutAccountsInput | user_accountsUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: user_accountsUpdateManyWithWhereWithoutAccountsInput | user_accountsUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: user_accountsScalarWhereInput | user_accountsScalarWhereInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type groupsCreateproduct_grant_idsInput = {
    set: string[]
  }

  export type accountsCreateNestedOneWithoutGroupsInput = {
    create?: XOR<accountsCreateWithoutGroupsInput, accountsUncheckedCreateWithoutGroupsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutGroupsInput
    connect?: accountsWhereUniqueInput
  }

  export type usersCreateNestedManyWithoutGroupsInput = {
    create?: XOR<usersCreateWithoutGroupsInput, usersUncheckedCreateWithoutGroupsInput> | usersCreateWithoutGroupsInput[] | usersUncheckedCreateWithoutGroupsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutGroupsInput | usersCreateOrConnectWithoutGroupsInput[]
    createMany?: usersCreateManyGroupsInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type usersUncheckedCreateNestedManyWithoutGroupsInput = {
    create?: XOR<usersCreateWithoutGroupsInput, usersUncheckedCreateWithoutGroupsInput> | usersCreateWithoutGroupsInput[] | usersUncheckedCreateWithoutGroupsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutGroupsInput | usersCreateOrConnectWithoutGroupsInput[]
    createMany?: usersCreateManyGroupsInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type groupsUpdateproduct_grant_idsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type accountsUpdateOneWithoutGroupsNestedInput = {
    create?: XOR<accountsCreateWithoutGroupsInput, accountsUncheckedCreateWithoutGroupsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutGroupsInput
    upsert?: accountsUpsertWithoutGroupsInput
    disconnect?: accountsWhereInput | boolean
    delete?: accountsWhereInput | boolean
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutGroupsInput, accountsUpdateWithoutGroupsInput>, accountsUncheckedUpdateWithoutGroupsInput>
  }

  export type usersUpdateManyWithoutGroupsNestedInput = {
    create?: XOR<usersCreateWithoutGroupsInput, usersUncheckedCreateWithoutGroupsInput> | usersCreateWithoutGroupsInput[] | usersUncheckedCreateWithoutGroupsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutGroupsInput | usersCreateOrConnectWithoutGroupsInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutGroupsInput | usersUpsertWithWhereUniqueWithoutGroupsInput[]
    createMany?: usersCreateManyGroupsInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutGroupsInput | usersUpdateWithWhereUniqueWithoutGroupsInput[]
    updateMany?: usersUpdateManyWithWhereWithoutGroupsInput | usersUpdateManyWithWhereWithoutGroupsInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type usersUncheckedUpdateManyWithoutGroupsNestedInput = {
    create?: XOR<usersCreateWithoutGroupsInput, usersUncheckedCreateWithoutGroupsInput> | usersCreateWithoutGroupsInput[] | usersUncheckedCreateWithoutGroupsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutGroupsInput | usersCreateOrConnectWithoutGroupsInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutGroupsInput | usersUpsertWithWhereUniqueWithoutGroupsInput[]
    createMany?: usersCreateManyGroupsInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutGroupsInput | usersUpdateWithWhereUniqueWithoutGroupsInput[]
    updateMany?: usersUpdateManyWithWhereWithoutGroupsInput | usersUpdateManyWithWhereWithoutGroupsInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type user_newslettersCreateNestedManyWithoutNewslettersInput = {
    create?: XOR<user_newslettersCreateWithoutNewslettersInput, user_newslettersUncheckedCreateWithoutNewslettersInput> | user_newslettersCreateWithoutNewslettersInput[] | user_newslettersUncheckedCreateWithoutNewslettersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutNewslettersInput | user_newslettersCreateOrConnectWithoutNewslettersInput[]
    createMany?: user_newslettersCreateManyNewslettersInputEnvelope
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
  }

  export type user_newslettersUncheckedCreateNestedManyWithoutNewslettersInput = {
    create?: XOR<user_newslettersCreateWithoutNewslettersInput, user_newslettersUncheckedCreateWithoutNewslettersInput> | user_newslettersCreateWithoutNewslettersInput[] | user_newslettersUncheckedCreateWithoutNewslettersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutNewslettersInput | user_newslettersCreateOrConnectWithoutNewslettersInput[]
    createMany?: user_newslettersCreateManyNewslettersInputEnvelope
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
  }

  export type user_newslettersUpdateManyWithoutNewslettersNestedInput = {
    create?: XOR<user_newslettersCreateWithoutNewslettersInput, user_newslettersUncheckedCreateWithoutNewslettersInput> | user_newslettersCreateWithoutNewslettersInput[] | user_newslettersUncheckedCreateWithoutNewslettersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutNewslettersInput | user_newslettersCreateOrConnectWithoutNewslettersInput[]
    upsert?: user_newslettersUpsertWithWhereUniqueWithoutNewslettersInput | user_newslettersUpsertWithWhereUniqueWithoutNewslettersInput[]
    createMany?: user_newslettersCreateManyNewslettersInputEnvelope
    set?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    disconnect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    delete?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    update?: user_newslettersUpdateWithWhereUniqueWithoutNewslettersInput | user_newslettersUpdateWithWhereUniqueWithoutNewslettersInput[]
    updateMany?: user_newslettersUpdateManyWithWhereWithoutNewslettersInput | user_newslettersUpdateManyWithWhereWithoutNewslettersInput[]
    deleteMany?: user_newslettersScalarWhereInput | user_newslettersScalarWhereInput[]
  }

  export type user_newslettersUncheckedUpdateManyWithoutNewslettersNestedInput = {
    create?: XOR<user_newslettersCreateWithoutNewslettersInput, user_newslettersUncheckedCreateWithoutNewslettersInput> | user_newslettersCreateWithoutNewslettersInput[] | user_newslettersUncheckedCreateWithoutNewslettersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutNewslettersInput | user_newslettersCreateOrConnectWithoutNewslettersInput[]
    upsert?: user_newslettersUpsertWithWhereUniqueWithoutNewslettersInput | user_newslettersUpsertWithWhereUniqueWithoutNewslettersInput[]
    createMany?: user_newslettersCreateManyNewslettersInputEnvelope
    set?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    disconnect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    delete?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    update?: user_newslettersUpdateWithWhereUniqueWithoutNewslettersInput | user_newslettersUpdateWithWhereUniqueWithoutNewslettersInput[]
    updateMany?: user_newslettersUpdateManyWithWhereWithoutNewslettersInput | user_newslettersUpdateManyWithWhereWithoutNewslettersInput[]
    deleteMany?: user_newslettersScalarWhereInput | user_newslettersScalarWhereInput[]
  }

  export type accountsCreateNestedOneWithoutProduct_usageInput = {
    create?: XOR<accountsCreateWithoutProduct_usageInput, accountsUncheckedCreateWithoutProduct_usageInput>
    connectOrCreate?: accountsCreateOrConnectWithoutProduct_usageInput
    connect?: accountsWhereUniqueInput
  }

  export type productsCreateNestedOneWithoutProduct_usageInput = {
    create?: XOR<productsCreateWithoutProduct_usageInput, productsUncheckedCreateWithoutProduct_usageInput>
    connectOrCreate?: productsCreateOrConnectWithoutProduct_usageInput
    connect?: productsWhereUniqueInput
  }

  export type accountsUpdateOneWithoutProduct_usageNestedInput = {
    create?: XOR<accountsCreateWithoutProduct_usageInput, accountsUncheckedCreateWithoutProduct_usageInput>
    connectOrCreate?: accountsCreateOrConnectWithoutProduct_usageInput
    upsert?: accountsUpsertWithoutProduct_usageInput
    disconnect?: accountsWhereInput | boolean
    delete?: accountsWhereInput | boolean
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutProduct_usageInput, accountsUpdateWithoutProduct_usageInput>, accountsUncheckedUpdateWithoutProduct_usageInput>
  }

  export type productsUpdateOneWithoutProduct_usageNestedInput = {
    create?: XOR<productsCreateWithoutProduct_usageInput, productsUncheckedCreateWithoutProduct_usageInput>
    connectOrCreate?: productsCreateOrConnectWithoutProduct_usageInput
    upsert?: productsUpsertWithoutProduct_usageInput
    disconnect?: productsWhereInput | boolean
    delete?: productsWhereInput | boolean
    connect?: productsWhereUniqueInput
    update?: XOR<XOR<productsUpdateToOneWithWhereWithoutProduct_usageInput, productsUpdateWithoutProduct_usageInput>, productsUncheckedUpdateWithoutProduct_usageInput>
  }

  export type product_usageCreateNestedManyWithoutProductsInput = {
    create?: XOR<product_usageCreateWithoutProductsInput, product_usageUncheckedCreateWithoutProductsInput> | product_usageCreateWithoutProductsInput[] | product_usageUncheckedCreateWithoutProductsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutProductsInput | product_usageCreateOrConnectWithoutProductsInput[]
    createMany?: product_usageCreateManyProductsInputEnvelope
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
  }

  export type product_usageUncheckedCreateNestedManyWithoutProductsInput = {
    create?: XOR<product_usageCreateWithoutProductsInput, product_usageUncheckedCreateWithoutProductsInput> | product_usageCreateWithoutProductsInput[] | product_usageUncheckedCreateWithoutProductsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutProductsInput | product_usageCreateOrConnectWithoutProductsInput[]
    createMany?: product_usageCreateManyProductsInputEnvelope
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
  }

  export type product_usageUpdateManyWithoutProductsNestedInput = {
    create?: XOR<product_usageCreateWithoutProductsInput, product_usageUncheckedCreateWithoutProductsInput> | product_usageCreateWithoutProductsInput[] | product_usageUncheckedCreateWithoutProductsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutProductsInput | product_usageCreateOrConnectWithoutProductsInput[]
    upsert?: product_usageUpsertWithWhereUniqueWithoutProductsInput | product_usageUpsertWithWhereUniqueWithoutProductsInput[]
    createMany?: product_usageCreateManyProductsInputEnvelope
    set?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    disconnect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    delete?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    update?: product_usageUpdateWithWhereUniqueWithoutProductsInput | product_usageUpdateWithWhereUniqueWithoutProductsInput[]
    updateMany?: product_usageUpdateManyWithWhereWithoutProductsInput | product_usageUpdateManyWithWhereWithoutProductsInput[]
    deleteMany?: product_usageScalarWhereInput | product_usageScalarWhereInput[]
  }

  export type product_usageUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: XOR<product_usageCreateWithoutProductsInput, product_usageUncheckedCreateWithoutProductsInput> | product_usageCreateWithoutProductsInput[] | product_usageUncheckedCreateWithoutProductsInput[]
    connectOrCreate?: product_usageCreateOrConnectWithoutProductsInput | product_usageCreateOrConnectWithoutProductsInput[]
    upsert?: product_usageUpsertWithWhereUniqueWithoutProductsInput | product_usageUpsertWithWhereUniqueWithoutProductsInput[]
    createMany?: product_usageCreateManyProductsInputEnvelope
    set?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    disconnect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    delete?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    connect?: product_usageWhereUniqueInput | product_usageWhereUniqueInput[]
    update?: product_usageUpdateWithWhereUniqueWithoutProductsInput | product_usageUpdateWithWhereUniqueWithoutProductsInput[]
    updateMany?: product_usageUpdateManyWithWhereWithoutProductsInput | product_usageUpdateManyWithWhereWithoutProductsInput[]
    deleteMany?: product_usageScalarWhereInput | product_usageScalarWhereInput[]
  }

  export type accountsCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<accountsCreateWithoutSubscriptionsInput, accountsUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutSubscriptionsInput
    connect?: accountsWhereUniqueInput
  }

  export type accountsUpdateOneWithoutSubscriptionsNestedInput = {
    create?: XOR<accountsCreateWithoutSubscriptionsInput, accountsUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutSubscriptionsInput
    upsert?: accountsUpsertWithoutSubscriptionsInput
    disconnect?: accountsWhereInput | boolean
    delete?: accountsWhereInput | boolean
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutSubscriptionsInput, accountsUpdateWithoutSubscriptionsInput>, accountsUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type accountsCreateNestedOneWithoutTop_pagesInput = {
    create?: XOR<accountsCreateWithoutTop_pagesInput, accountsUncheckedCreateWithoutTop_pagesInput>
    connectOrCreate?: accountsCreateOrConnectWithoutTop_pagesInput
    connect?: accountsWhereUniqueInput
  }

  export type accountsUpdateOneWithoutTop_pagesNestedInput = {
    create?: XOR<accountsCreateWithoutTop_pagesInput, accountsUncheckedCreateWithoutTop_pagesInput>
    connectOrCreate?: accountsCreateOrConnectWithoutTop_pagesInput
    upsert?: accountsUpsertWithoutTop_pagesInput
    disconnect?: accountsWhereInput | boolean
    delete?: accountsWhereInput | boolean
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutTop_pagesInput, accountsUpdateWithoutTop_pagesInput>, accountsUncheckedUpdateWithoutTop_pagesInput>
  }

  export type accountsCreateNestedOneWithoutUser_accountsInput = {
    create?: XOR<accountsCreateWithoutUser_accountsInput, accountsUncheckedCreateWithoutUser_accountsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutUser_accountsInput
    connect?: accountsWhereUniqueInput
  }

  export type usersCreateNestedOneWithoutUser_accountsInput = {
    create?: XOR<usersCreateWithoutUser_accountsInput, usersUncheckedCreateWithoutUser_accountsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_accountsInput
    connect?: usersWhereUniqueInput
  }

  export type accountsUpdateOneRequiredWithoutUser_accountsNestedInput = {
    create?: XOR<accountsCreateWithoutUser_accountsInput, accountsUncheckedCreateWithoutUser_accountsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutUser_accountsInput
    upsert?: accountsUpsertWithoutUser_accountsInput
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutUser_accountsInput, accountsUpdateWithoutUser_accountsInput>, accountsUncheckedUpdateWithoutUser_accountsInput>
  }

  export type usersUpdateOneRequiredWithoutUser_accountsNestedInput = {
    create?: XOR<usersCreateWithoutUser_accountsInput, usersUncheckedCreateWithoutUser_accountsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_accountsInput
    upsert?: usersUpsertWithoutUser_accountsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutUser_accountsInput, usersUpdateWithoutUser_accountsInput>, usersUncheckedUpdateWithoutUser_accountsInput>
  }

  export type usersCreateNestedOneWithoutUser_activityInput = {
    create?: XOR<usersCreateWithoutUser_activityInput, usersUncheckedCreateWithoutUser_activityInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_activityInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneWithoutUser_activityNestedInput = {
    create?: XOR<usersCreateWithoutUser_activityInput, usersUncheckedCreateWithoutUser_activityInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_activityInput
    upsert?: usersUpsertWithoutUser_activityInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutUser_activityInput, usersUpdateWithoutUser_activityInput>, usersUncheckedUpdateWithoutUser_activityInput>
  }

  export type newslettersCreateNestedOneWithoutUser_newslettersInput = {
    create?: XOR<newslettersCreateWithoutUser_newslettersInput, newslettersUncheckedCreateWithoutUser_newslettersInput>
    connectOrCreate?: newslettersCreateOrConnectWithoutUser_newslettersInput
    connect?: newslettersWhereUniqueInput
  }

  export type usersCreateNestedOneWithoutUser_newslettersInput = {
    create?: XOR<usersCreateWithoutUser_newslettersInput, usersUncheckedCreateWithoutUser_newslettersInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_newslettersInput
    connect?: usersWhereUniqueInput
  }

  export type newslettersUpdateOneWithoutUser_newslettersNestedInput = {
    create?: XOR<newslettersCreateWithoutUser_newslettersInput, newslettersUncheckedCreateWithoutUser_newslettersInput>
    connectOrCreate?: newslettersCreateOrConnectWithoutUser_newslettersInput
    upsert?: newslettersUpsertWithoutUser_newslettersInput
    disconnect?: newslettersWhereInput | boolean
    delete?: newslettersWhereInput | boolean
    connect?: newslettersWhereUniqueInput
    update?: XOR<XOR<newslettersUpdateToOneWithWhereWithoutUser_newslettersInput, newslettersUpdateWithoutUser_newslettersInput>, newslettersUncheckedUpdateWithoutUser_newslettersInput>
  }

  export type usersUpdateOneWithoutUser_newslettersNestedInput = {
    create?: XOR<usersCreateWithoutUser_newslettersInput, usersUncheckedCreateWithoutUser_newslettersInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_newslettersInput
    upsert?: usersUpsertWithoutUser_newslettersInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutUser_newslettersInput, usersUpdateWithoutUser_newslettersInput>, usersUncheckedUpdateWithoutUser_newslettersInput>
  }

  export type user_accountsCreateNestedManyWithoutUsersInput = {
    create?: XOR<user_accountsCreateWithoutUsersInput, user_accountsUncheckedCreateWithoutUsersInput> | user_accountsCreateWithoutUsersInput[] | user_accountsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutUsersInput | user_accountsCreateOrConnectWithoutUsersInput[]
    createMany?: user_accountsCreateManyUsersInputEnvelope
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
  }

  export type user_activityCreateNestedManyWithoutUsersInput = {
    create?: XOR<user_activityCreateWithoutUsersInput, user_activityUncheckedCreateWithoutUsersInput> | user_activityCreateWithoutUsersInput[] | user_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_activityCreateOrConnectWithoutUsersInput | user_activityCreateOrConnectWithoutUsersInput[]
    createMany?: user_activityCreateManyUsersInputEnvelope
    connect?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
  }

  export type user_newslettersCreateNestedManyWithoutUsersInput = {
    create?: XOR<user_newslettersCreateWithoutUsersInput, user_newslettersUncheckedCreateWithoutUsersInput> | user_newslettersCreateWithoutUsersInput[] | user_newslettersUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutUsersInput | user_newslettersCreateOrConnectWithoutUsersInput[]
    createMany?: user_newslettersCreateManyUsersInputEnvelope
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
  }

  export type groupsCreateNestedOneWithoutUsersInput = {
    create?: XOR<groupsCreateWithoutUsersInput, groupsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: groupsCreateOrConnectWithoutUsersInput
    connect?: groupsWhereUniqueInput
  }

  export type user_accountsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<user_accountsCreateWithoutUsersInput, user_accountsUncheckedCreateWithoutUsersInput> | user_accountsCreateWithoutUsersInput[] | user_accountsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutUsersInput | user_accountsCreateOrConnectWithoutUsersInput[]
    createMany?: user_accountsCreateManyUsersInputEnvelope
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
  }

  export type user_activityUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<user_activityCreateWithoutUsersInput, user_activityUncheckedCreateWithoutUsersInput> | user_activityCreateWithoutUsersInput[] | user_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_activityCreateOrConnectWithoutUsersInput | user_activityCreateOrConnectWithoutUsersInput[]
    createMany?: user_activityCreateManyUsersInputEnvelope
    connect?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
  }

  export type user_newslettersUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<user_newslettersCreateWithoutUsersInput, user_newslettersUncheckedCreateWithoutUsersInput> | user_newslettersCreateWithoutUsersInput[] | user_newslettersUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutUsersInput | user_newslettersCreateOrConnectWithoutUsersInput[]
    createMany?: user_newslettersCreateManyUsersInputEnvelope
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
  }

  export type user_accountsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<user_accountsCreateWithoutUsersInput, user_accountsUncheckedCreateWithoutUsersInput> | user_accountsCreateWithoutUsersInput[] | user_accountsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutUsersInput | user_accountsCreateOrConnectWithoutUsersInput[]
    upsert?: user_accountsUpsertWithWhereUniqueWithoutUsersInput | user_accountsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: user_accountsCreateManyUsersInputEnvelope
    set?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    disconnect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    delete?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    update?: user_accountsUpdateWithWhereUniqueWithoutUsersInput | user_accountsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: user_accountsUpdateManyWithWhereWithoutUsersInput | user_accountsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: user_accountsScalarWhereInput | user_accountsScalarWhereInput[]
  }

  export type user_activityUpdateManyWithoutUsersNestedInput = {
    create?: XOR<user_activityCreateWithoutUsersInput, user_activityUncheckedCreateWithoutUsersInput> | user_activityCreateWithoutUsersInput[] | user_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_activityCreateOrConnectWithoutUsersInput | user_activityCreateOrConnectWithoutUsersInput[]
    upsert?: user_activityUpsertWithWhereUniqueWithoutUsersInput | user_activityUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: user_activityCreateManyUsersInputEnvelope
    set?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    disconnect?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    delete?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    connect?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    update?: user_activityUpdateWithWhereUniqueWithoutUsersInput | user_activityUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: user_activityUpdateManyWithWhereWithoutUsersInput | user_activityUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: user_activityScalarWhereInput | user_activityScalarWhereInput[]
  }

  export type user_newslettersUpdateManyWithoutUsersNestedInput = {
    create?: XOR<user_newslettersCreateWithoutUsersInput, user_newslettersUncheckedCreateWithoutUsersInput> | user_newslettersCreateWithoutUsersInput[] | user_newslettersUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutUsersInput | user_newslettersCreateOrConnectWithoutUsersInput[]
    upsert?: user_newslettersUpsertWithWhereUniqueWithoutUsersInput | user_newslettersUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: user_newslettersCreateManyUsersInputEnvelope
    set?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    disconnect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    delete?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    update?: user_newslettersUpdateWithWhereUniqueWithoutUsersInput | user_newslettersUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: user_newslettersUpdateManyWithWhereWithoutUsersInput | user_newslettersUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: user_newslettersScalarWhereInput | user_newslettersScalarWhereInput[]
  }

  export type groupsUpdateOneWithoutUsersNestedInput = {
    create?: XOR<groupsCreateWithoutUsersInput, groupsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: groupsCreateOrConnectWithoutUsersInput
    upsert?: groupsUpsertWithoutUsersInput
    disconnect?: groupsWhereInput | boolean
    delete?: groupsWhereInput | boolean
    connect?: groupsWhereUniqueInput
    update?: XOR<XOR<groupsUpdateToOneWithWhereWithoutUsersInput, groupsUpdateWithoutUsersInput>, groupsUncheckedUpdateWithoutUsersInput>
  }

  export type user_accountsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<user_accountsCreateWithoutUsersInput, user_accountsUncheckedCreateWithoutUsersInput> | user_accountsCreateWithoutUsersInput[] | user_accountsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_accountsCreateOrConnectWithoutUsersInput | user_accountsCreateOrConnectWithoutUsersInput[]
    upsert?: user_accountsUpsertWithWhereUniqueWithoutUsersInput | user_accountsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: user_accountsCreateManyUsersInputEnvelope
    set?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    disconnect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    delete?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    connect?: user_accountsWhereUniqueInput | user_accountsWhereUniqueInput[]
    update?: user_accountsUpdateWithWhereUniqueWithoutUsersInput | user_accountsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: user_accountsUpdateManyWithWhereWithoutUsersInput | user_accountsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: user_accountsScalarWhereInput | user_accountsScalarWhereInput[]
  }

  export type user_activityUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<user_activityCreateWithoutUsersInput, user_activityUncheckedCreateWithoutUsersInput> | user_activityCreateWithoutUsersInput[] | user_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_activityCreateOrConnectWithoutUsersInput | user_activityCreateOrConnectWithoutUsersInput[]
    upsert?: user_activityUpsertWithWhereUniqueWithoutUsersInput | user_activityUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: user_activityCreateManyUsersInputEnvelope
    set?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    disconnect?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    delete?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    connect?: user_activityWhereUniqueInput | user_activityWhereUniqueInput[]
    update?: user_activityUpdateWithWhereUniqueWithoutUsersInput | user_activityUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: user_activityUpdateManyWithWhereWithoutUsersInput | user_activityUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: user_activityScalarWhereInput | user_activityScalarWhereInput[]
  }

  export type user_newslettersUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<user_newslettersCreateWithoutUsersInput, user_newslettersUncheckedCreateWithoutUsersInput> | user_newslettersCreateWithoutUsersInput[] | user_newslettersUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: user_newslettersCreateOrConnectWithoutUsersInput | user_newslettersCreateOrConnectWithoutUsersInput[]
    upsert?: user_newslettersUpsertWithWhereUniqueWithoutUsersInput | user_newslettersUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: user_newslettersCreateManyUsersInputEnvelope
    set?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    disconnect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    delete?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    connect?: user_newslettersWhereUniqueInput | user_newslettersWhereUniqueInput[]
    update?: user_newslettersUpdateWithWhereUniqueWithoutUsersInput | user_newslettersUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: user_newslettersUpdateManyWithWhereWithoutUsersInput | user_newslettersUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: user_newslettersScalarWhereInput | user_newslettersScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type accountsCreateWithoutAccount_activityInput = {
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    groups?: groupsCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutAccount_activityInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    groups?: groupsUncheckedCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageUncheckedCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsUncheckedCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesUncheckedCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutAccount_activityInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutAccount_activityInput, accountsUncheckedCreateWithoutAccount_activityInput>
  }

  export type accountsUpsertWithoutAccount_activityInput = {
    update: XOR<accountsUpdateWithoutAccount_activityInput, accountsUncheckedUpdateWithoutAccount_activityInput>
    create: XOR<accountsCreateWithoutAccount_activityInput, accountsUncheckedCreateWithoutAccount_activityInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutAccount_activityInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutAccount_activityInput, accountsUncheckedUpdateWithoutAccount_activityInput>
  }

  export type accountsUpdateWithoutAccount_activityInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    groups?: groupsUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutAccount_activityInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    groups?: groupsUncheckedUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUncheckedUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUncheckedUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUncheckedUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type account_activityCreateWithoutAccountsInput = {
    date: Date | string
    active_users?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type account_activityUncheckedCreateWithoutAccountsInput = {
    id?: number
    date: Date | string
    active_users?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type account_activityCreateOrConnectWithoutAccountsInput = {
    where: account_activityWhereUniqueInput
    create: XOR<account_activityCreateWithoutAccountsInput, account_activityUncheckedCreateWithoutAccountsInput>
  }

  export type account_activityCreateManyAccountsInputEnvelope = {
    data: account_activityCreateManyAccountsInput | account_activityCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type groupsCreateWithoutAccountsInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
    users?: usersCreateNestedManyWithoutGroupsInput
  }

  export type groupsUncheckedCreateWithoutAccountsInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
    users?: usersUncheckedCreateNestedManyWithoutGroupsInput
  }

  export type groupsCreateOrConnectWithoutAccountsInput = {
    where: groupsWhereUniqueInput
    create: XOR<groupsCreateWithoutAccountsInput, groupsUncheckedCreateWithoutAccountsInput>
  }

  export type groupsCreateManyAccountsInputEnvelope = {
    data: groupsCreateManyAccountsInput | groupsCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type product_usageCreateWithoutAccountsInput = {
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    products?: productsCreateNestedOneWithoutProduct_usageInput
  }

  export type product_usageUncheckedCreateWithoutAccountsInput = {
    id?: number
    product_id?: number | null
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type product_usageCreateOrConnectWithoutAccountsInput = {
    where: product_usageWhereUniqueInput
    create: XOR<product_usageCreateWithoutAccountsInput, product_usageUncheckedCreateWithoutAccountsInput>
  }

  export type product_usageCreateManyAccountsInputEnvelope = {
    data: product_usageCreateManyAccountsInput | product_usageCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type subscriptionsCreateWithoutAccountsInput = {
    external_id: string
    customer_name: string
    email?: string | null
    plan: string
    plan_type: string
    status: string
    amount?: Decimal | DecimalJsLike | number | string | null
    billing_cycle?: string | null
    start_date?: Date | string | null
    next_billing?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscriptionsUncheckedCreateWithoutAccountsInput = {
    id?: number
    external_id: string
    customer_name: string
    email?: string | null
    plan: string
    plan_type: string
    status: string
    amount?: Decimal | DecimalJsLike | number | string | null
    billing_cycle?: string | null
    start_date?: Date | string | null
    next_billing?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscriptionsCreateOrConnectWithoutAccountsInput = {
    where: subscriptionsWhereUniqueInput
    create: XOR<subscriptionsCreateWithoutAccountsInput, subscriptionsUncheckedCreateWithoutAccountsInput>
  }

  export type subscriptionsCreateManyAccountsInputEnvelope = {
    data: subscriptionsCreateManyAccountsInput | subscriptionsCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type top_pagesCreateWithoutAccountsInput = {
    url: string
    title?: string | null
    pageviews?: number | null
    avg_time_on_page?: number | null
    bounce_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type top_pagesUncheckedCreateWithoutAccountsInput = {
    id?: number
    url: string
    title?: string | null
    pageviews?: number | null
    avg_time_on_page?: number | null
    bounce_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type top_pagesCreateOrConnectWithoutAccountsInput = {
    where: top_pagesWhereUniqueInput
    create: XOR<top_pagesCreateWithoutAccountsInput, top_pagesUncheckedCreateWithoutAccountsInput>
  }

  export type top_pagesCreateManyAccountsInputEnvelope = {
    data: top_pagesCreateManyAccountsInput | top_pagesCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type user_accountsCreateWithoutAccountsInput = {
    users: usersCreateNestedOneWithoutUser_accountsInput
  }

  export type user_accountsUncheckedCreateWithoutAccountsInput = {
    user_id: number
  }

  export type user_accountsCreateOrConnectWithoutAccountsInput = {
    where: user_accountsWhereUniqueInput
    create: XOR<user_accountsCreateWithoutAccountsInput, user_accountsUncheckedCreateWithoutAccountsInput>
  }

  export type user_accountsCreateManyAccountsInputEnvelope = {
    data: user_accountsCreateManyAccountsInput | user_accountsCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type account_activityUpsertWithWhereUniqueWithoutAccountsInput = {
    where: account_activityWhereUniqueInput
    update: XOR<account_activityUpdateWithoutAccountsInput, account_activityUncheckedUpdateWithoutAccountsInput>
    create: XOR<account_activityCreateWithoutAccountsInput, account_activityUncheckedCreateWithoutAccountsInput>
  }

  export type account_activityUpdateWithWhereUniqueWithoutAccountsInput = {
    where: account_activityWhereUniqueInput
    data: XOR<account_activityUpdateWithoutAccountsInput, account_activityUncheckedUpdateWithoutAccountsInput>
  }

  export type account_activityUpdateManyWithWhereWithoutAccountsInput = {
    where: account_activityScalarWhereInput
    data: XOR<account_activityUpdateManyMutationInput, account_activityUncheckedUpdateManyWithoutAccountsInput>
  }

  export type account_activityScalarWhereInput = {
    AND?: account_activityScalarWhereInput | account_activityScalarWhereInput[]
    OR?: account_activityScalarWhereInput[]
    NOT?: account_activityScalarWhereInput | account_activityScalarWhereInput[]
    id?: IntFilter<"account_activity"> | number
    account_id?: IntNullableFilter<"account_activity"> | number | null
    date?: DateTimeFilter<"account_activity"> | Date | string
    active_users?: IntNullableFilter<"account_activity"> | number | null
    pageviews?: IntNullableFilter<"account_activity"> | number | null
    created_at?: DateTimeNullableFilter<"account_activity"> | Date | string | null
  }

  export type groupsUpsertWithWhereUniqueWithoutAccountsInput = {
    where: groupsWhereUniqueInput
    update: XOR<groupsUpdateWithoutAccountsInput, groupsUncheckedUpdateWithoutAccountsInput>
    create: XOR<groupsCreateWithoutAccountsInput, groupsUncheckedCreateWithoutAccountsInput>
  }

  export type groupsUpdateWithWhereUniqueWithoutAccountsInput = {
    where: groupsWhereUniqueInput
    data: XOR<groupsUpdateWithoutAccountsInput, groupsUncheckedUpdateWithoutAccountsInput>
  }

  export type groupsUpdateManyWithWhereWithoutAccountsInput = {
    where: groupsScalarWhereInput
    data: XOR<groupsUpdateManyMutationInput, groupsUncheckedUpdateManyWithoutAccountsInput>
  }

  export type groupsScalarWhereInput = {
    AND?: groupsScalarWhereInput | groupsScalarWhereInput[]
    OR?: groupsScalarWhereInput[]
    NOT?: groupsScalarWhereInput | groupsScalarWhereInput[]
    id?: UuidFilter<"groups"> | string
    slug?: StringFilter<"groups"> | string
    name?: StringFilter<"groups"> | string
    color?: StringNullableFilter<"groups"> | string | null
    icon?: StringNullableFilter<"groups"> | string | null
    default_template?: StringNullableFilter<"groups"> | string | null
    product_grant_ids?: StringNullableListFilter<"groups">
    demographics?: JsonFilter<"groups">
    created_at?: DateTimeFilter<"groups"> | Date | string
    updated_at?: DateTimeFilter<"groups"> | Date | string
    user_count?: IntFilter<"groups"> | number
    account_id?: IntFilter<"groups"> | number
    account_id_new?: StringNullableFilter<"groups"> | string | null
  }

  export type product_usageUpsertWithWhereUniqueWithoutAccountsInput = {
    where: product_usageWhereUniqueInput
    update: XOR<product_usageUpdateWithoutAccountsInput, product_usageUncheckedUpdateWithoutAccountsInput>
    create: XOR<product_usageCreateWithoutAccountsInput, product_usageUncheckedCreateWithoutAccountsInput>
  }

  export type product_usageUpdateWithWhereUniqueWithoutAccountsInput = {
    where: product_usageWhereUniqueInput
    data: XOR<product_usageUpdateWithoutAccountsInput, product_usageUncheckedUpdateWithoutAccountsInput>
  }

  export type product_usageUpdateManyWithWhereWithoutAccountsInput = {
    where: product_usageScalarWhereInput
    data: XOR<product_usageUpdateManyMutationInput, product_usageUncheckedUpdateManyWithoutAccountsInput>
  }

  export type product_usageScalarWhereInput = {
    AND?: product_usageScalarWhereInput | product_usageScalarWhereInput[]
    OR?: product_usageScalarWhereInput[]
    NOT?: product_usageScalarWhereInput | product_usageScalarWhereInput[]
    id?: IntFilter<"product_usage"> | number
    account_id?: IntNullableFilter<"product_usage"> | number | null
    product_id?: IntNullableFilter<"product_usage"> | number | null
    date?: DateTimeFilter<"product_usage"> | Date | string
    pageviews?: IntNullableFilter<"product_usage"> | number | null
    active_users?: IntNullableFilter<"product_usage"> | number | null
    created_at?: DateTimeNullableFilter<"product_usage"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"product_usage"> | Date | string | null
  }

  export type subscriptionsUpsertWithWhereUniqueWithoutAccountsInput = {
    where: subscriptionsWhereUniqueInput
    update: XOR<subscriptionsUpdateWithoutAccountsInput, subscriptionsUncheckedUpdateWithoutAccountsInput>
    create: XOR<subscriptionsCreateWithoutAccountsInput, subscriptionsUncheckedCreateWithoutAccountsInput>
  }

  export type subscriptionsUpdateWithWhereUniqueWithoutAccountsInput = {
    where: subscriptionsWhereUniqueInput
    data: XOR<subscriptionsUpdateWithoutAccountsInput, subscriptionsUncheckedUpdateWithoutAccountsInput>
  }

  export type subscriptionsUpdateManyWithWhereWithoutAccountsInput = {
    where: subscriptionsScalarWhereInput
    data: XOR<subscriptionsUpdateManyMutationInput, subscriptionsUncheckedUpdateManyWithoutAccountsInput>
  }

  export type subscriptionsScalarWhereInput = {
    AND?: subscriptionsScalarWhereInput | subscriptionsScalarWhereInput[]
    OR?: subscriptionsScalarWhereInput[]
    NOT?: subscriptionsScalarWhereInput | subscriptionsScalarWhereInput[]
    id?: IntFilter<"subscriptions"> | number
    external_id?: StringFilter<"subscriptions"> | string
    account_id?: IntNullableFilter<"subscriptions"> | number | null
    customer_name?: StringFilter<"subscriptions"> | string
    email?: StringNullableFilter<"subscriptions"> | string | null
    plan?: StringFilter<"subscriptions"> | string
    plan_type?: StringFilter<"subscriptions"> | string
    status?: StringFilter<"subscriptions"> | string
    amount?: DecimalNullableFilter<"subscriptions"> | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: StringNullableFilter<"subscriptions"> | string | null
    start_date?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    next_billing?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    created_at?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"subscriptions"> | Date | string | null
  }

  export type top_pagesUpsertWithWhereUniqueWithoutAccountsInput = {
    where: top_pagesWhereUniqueInput
    update: XOR<top_pagesUpdateWithoutAccountsInput, top_pagesUncheckedUpdateWithoutAccountsInput>
    create: XOR<top_pagesCreateWithoutAccountsInput, top_pagesUncheckedCreateWithoutAccountsInput>
  }

  export type top_pagesUpdateWithWhereUniqueWithoutAccountsInput = {
    where: top_pagesWhereUniqueInput
    data: XOR<top_pagesUpdateWithoutAccountsInput, top_pagesUncheckedUpdateWithoutAccountsInput>
  }

  export type top_pagesUpdateManyWithWhereWithoutAccountsInput = {
    where: top_pagesScalarWhereInput
    data: XOR<top_pagesUpdateManyMutationInput, top_pagesUncheckedUpdateManyWithoutAccountsInput>
  }

  export type top_pagesScalarWhereInput = {
    AND?: top_pagesScalarWhereInput | top_pagesScalarWhereInput[]
    OR?: top_pagesScalarWhereInput[]
    NOT?: top_pagesScalarWhereInput | top_pagesScalarWhereInput[]
    id?: IntFilter<"top_pages"> | number
    account_id?: IntNullableFilter<"top_pages"> | number | null
    url?: StringFilter<"top_pages"> | string
    title?: StringNullableFilter<"top_pages"> | string | null
    pageviews?: IntNullableFilter<"top_pages"> | number | null
    avg_time_on_page?: IntNullableFilter<"top_pages"> | number | null
    bounce_rate?: DecimalNullableFilter<"top_pages"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"top_pages"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"top_pages"> | Date | string | null
  }

  export type user_accountsUpsertWithWhereUniqueWithoutAccountsInput = {
    where: user_accountsWhereUniqueInput
    update: XOR<user_accountsUpdateWithoutAccountsInput, user_accountsUncheckedUpdateWithoutAccountsInput>
    create: XOR<user_accountsCreateWithoutAccountsInput, user_accountsUncheckedCreateWithoutAccountsInput>
  }

  export type user_accountsUpdateWithWhereUniqueWithoutAccountsInput = {
    where: user_accountsWhereUniqueInput
    data: XOR<user_accountsUpdateWithoutAccountsInput, user_accountsUncheckedUpdateWithoutAccountsInput>
  }

  export type user_accountsUpdateManyWithWhereWithoutAccountsInput = {
    where: user_accountsScalarWhereInput
    data: XOR<user_accountsUpdateManyMutationInput, user_accountsUncheckedUpdateManyWithoutAccountsInput>
  }

  export type user_accountsScalarWhereInput = {
    AND?: user_accountsScalarWhereInput | user_accountsScalarWhereInput[]
    OR?: user_accountsScalarWhereInput[]
    NOT?: user_accountsScalarWhereInput | user_accountsScalarWhereInput[]
    user_id?: IntFilter<"user_accounts"> | number
    account_id?: StringFilter<"user_accounts"> | string
  }

  export type accountsCreateWithoutGroupsInput = {
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutGroupsInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityUncheckedCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageUncheckedCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsUncheckedCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesUncheckedCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutGroupsInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutGroupsInput, accountsUncheckedCreateWithoutGroupsInput>
  }

  export type usersCreateWithoutGroupsInput = {
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsCreateNestedManyWithoutUsersInput
    user_activity?: user_activityCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutGroupsInput = {
    id?: number
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutUsersInput
    user_activity?: user_activityUncheckedCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutGroupsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutGroupsInput, usersUncheckedCreateWithoutGroupsInput>
  }

  export type usersCreateManyGroupsInputEnvelope = {
    data: usersCreateManyGroupsInput | usersCreateManyGroupsInput[]
    skipDuplicates?: boolean
  }

  export type accountsUpsertWithoutGroupsInput = {
    update: XOR<accountsUpdateWithoutGroupsInput, accountsUncheckedUpdateWithoutGroupsInput>
    create: XOR<accountsCreateWithoutGroupsInput, accountsUncheckedCreateWithoutGroupsInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutGroupsInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutGroupsInput, accountsUncheckedUpdateWithoutGroupsInput>
  }

  export type accountsUpdateWithoutGroupsInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutGroupsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUncheckedUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUncheckedUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUncheckedUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUncheckedUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type usersUpsertWithWhereUniqueWithoutGroupsInput = {
    where: usersWhereUniqueInput
    update: XOR<usersUpdateWithoutGroupsInput, usersUncheckedUpdateWithoutGroupsInput>
    create: XOR<usersCreateWithoutGroupsInput, usersUncheckedCreateWithoutGroupsInput>
  }

  export type usersUpdateWithWhereUniqueWithoutGroupsInput = {
    where: usersWhereUniqueInput
    data: XOR<usersUpdateWithoutGroupsInput, usersUncheckedUpdateWithoutGroupsInput>
  }

  export type usersUpdateManyWithWhereWithoutGroupsInput = {
    where: usersScalarWhereInput
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyWithoutGroupsInput>
  }

  export type usersScalarWhereInput = {
    AND?: usersScalarWhereInput | usersScalarWhereInput[]
    OR?: usersScalarWhereInput[]
    NOT?: usersScalarWhereInput | usersScalarWhereInput[]
    id?: IntFilter<"users"> | number
    external_id?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    role?: StringNullableFilter<"users"> | string | null
    status?: StringNullableFilter<"users"> | string | null
    department?: StringNullableFilter<"users"> | string | null
    title?: StringNullableFilter<"users"> | string | null
    phone?: StringNullableFilter<"users"> | string | null
    join_date?: DateTimeNullableFilter<"users"> | Date | string | null
    last_login?: DateTimeNullableFilter<"users"> | Date | string | null
    login_count?: IntNullableFilter<"users"> | number | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"users"> | Date | string | null
    attributes?: JsonNullableFilter<"users">
    firstname?: StringNullableFilter<"users"> | string | null
    lastname?: StringNullableFilter<"users"> | string | null
    group_id?: UuidNullableFilter<"users"> | string | null
    last_synced_at?: DateTimeNullableFilter<"users"> | Date | string | null
    last_source?: StringNullableFilter<"users"> | string | null
  }

  export type user_newslettersCreateWithoutNewslettersInput = {
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    users?: usersCreateNestedOneWithoutUser_newslettersInput
  }

  export type user_newslettersUncheckedCreateWithoutNewslettersInput = {
    id?: number
    user_id?: number | null
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type user_newslettersCreateOrConnectWithoutNewslettersInput = {
    where: user_newslettersWhereUniqueInput
    create: XOR<user_newslettersCreateWithoutNewslettersInput, user_newslettersUncheckedCreateWithoutNewslettersInput>
  }

  export type user_newslettersCreateManyNewslettersInputEnvelope = {
    data: user_newslettersCreateManyNewslettersInput | user_newslettersCreateManyNewslettersInput[]
    skipDuplicates?: boolean
  }

  export type user_newslettersUpsertWithWhereUniqueWithoutNewslettersInput = {
    where: user_newslettersWhereUniqueInput
    update: XOR<user_newslettersUpdateWithoutNewslettersInput, user_newslettersUncheckedUpdateWithoutNewslettersInput>
    create: XOR<user_newslettersCreateWithoutNewslettersInput, user_newslettersUncheckedCreateWithoutNewslettersInput>
  }

  export type user_newslettersUpdateWithWhereUniqueWithoutNewslettersInput = {
    where: user_newslettersWhereUniqueInput
    data: XOR<user_newslettersUpdateWithoutNewslettersInput, user_newslettersUncheckedUpdateWithoutNewslettersInput>
  }

  export type user_newslettersUpdateManyWithWhereWithoutNewslettersInput = {
    where: user_newslettersScalarWhereInput
    data: XOR<user_newslettersUpdateManyMutationInput, user_newslettersUncheckedUpdateManyWithoutNewslettersInput>
  }

  export type user_newslettersScalarWhereInput = {
    AND?: user_newslettersScalarWhereInput | user_newslettersScalarWhereInput[]
    OR?: user_newslettersScalarWhereInput[]
    NOT?: user_newslettersScalarWhereInput | user_newslettersScalarWhereInput[]
    id?: IntFilter<"user_newsletters"> | number
    user_id?: IntNullableFilter<"user_newsletters"> | number | null
    newsletter_id?: IntNullableFilter<"user_newsletters"> | number | null
    subscribed?: BoolNullableFilter<"user_newsletters"> | boolean | null
    open_rate?: DecimalNullableFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    click_rate?: DecimalNullableFilter<"user_newsletters"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"user_newsletters"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"user_newsletters"> | Date | string | null
  }

  export type accountsCreateWithoutProduct_usageInput = {
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityCreateNestedManyWithoutAccountsInput
    groups?: groupsCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutProduct_usageInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityUncheckedCreateNestedManyWithoutAccountsInput
    groups?: groupsUncheckedCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsUncheckedCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesUncheckedCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutProduct_usageInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutProduct_usageInput, accountsUncheckedCreateWithoutProduct_usageInput>
  }

  export type productsCreateWithoutProduct_usageInput = {
    name: string
    description?: string | null
    created_at?: Date | string | null
  }

  export type productsUncheckedCreateWithoutProduct_usageInput = {
    id?: number
    name: string
    description?: string | null
    created_at?: Date | string | null
  }

  export type productsCreateOrConnectWithoutProduct_usageInput = {
    where: productsWhereUniqueInput
    create: XOR<productsCreateWithoutProduct_usageInput, productsUncheckedCreateWithoutProduct_usageInput>
  }

  export type accountsUpsertWithoutProduct_usageInput = {
    update: XOR<accountsUpdateWithoutProduct_usageInput, accountsUncheckedUpdateWithoutProduct_usageInput>
    create: XOR<accountsCreateWithoutProduct_usageInput, accountsUncheckedCreateWithoutProduct_usageInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutProduct_usageInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutProduct_usageInput, accountsUncheckedUpdateWithoutProduct_usageInput>
  }

  export type accountsUpdateWithoutProduct_usageInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUpdateManyWithoutAccountsNestedInput
    groups?: groupsUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutProduct_usageInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUncheckedUpdateManyWithoutAccountsNestedInput
    groups?: groupsUncheckedUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUncheckedUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUncheckedUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type productsUpsertWithoutProduct_usageInput = {
    update: XOR<productsUpdateWithoutProduct_usageInput, productsUncheckedUpdateWithoutProduct_usageInput>
    create: XOR<productsCreateWithoutProduct_usageInput, productsUncheckedCreateWithoutProduct_usageInput>
    where?: productsWhereInput
  }

  export type productsUpdateToOneWithWhereWithoutProduct_usageInput = {
    where?: productsWhereInput
    data: XOR<productsUpdateWithoutProduct_usageInput, productsUncheckedUpdateWithoutProduct_usageInput>
  }

  export type productsUpdateWithoutProduct_usageInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type productsUncheckedUpdateWithoutProduct_usageInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_usageCreateWithoutProductsInput = {
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    accounts?: accountsCreateNestedOneWithoutProduct_usageInput
  }

  export type product_usageUncheckedCreateWithoutProductsInput = {
    id?: number
    account_id?: number | null
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type product_usageCreateOrConnectWithoutProductsInput = {
    where: product_usageWhereUniqueInput
    create: XOR<product_usageCreateWithoutProductsInput, product_usageUncheckedCreateWithoutProductsInput>
  }

  export type product_usageCreateManyProductsInputEnvelope = {
    data: product_usageCreateManyProductsInput | product_usageCreateManyProductsInput[]
    skipDuplicates?: boolean
  }

  export type product_usageUpsertWithWhereUniqueWithoutProductsInput = {
    where: product_usageWhereUniqueInput
    update: XOR<product_usageUpdateWithoutProductsInput, product_usageUncheckedUpdateWithoutProductsInput>
    create: XOR<product_usageCreateWithoutProductsInput, product_usageUncheckedCreateWithoutProductsInput>
  }

  export type product_usageUpdateWithWhereUniqueWithoutProductsInput = {
    where: product_usageWhereUniqueInput
    data: XOR<product_usageUpdateWithoutProductsInput, product_usageUncheckedUpdateWithoutProductsInput>
  }

  export type product_usageUpdateManyWithWhereWithoutProductsInput = {
    where: product_usageScalarWhereInput
    data: XOR<product_usageUpdateManyMutationInput, product_usageUncheckedUpdateManyWithoutProductsInput>
  }

  export type accountsCreateWithoutSubscriptionsInput = {
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityCreateNestedManyWithoutAccountsInput
    groups?: groupsCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutSubscriptionsInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityUncheckedCreateNestedManyWithoutAccountsInput
    groups?: groupsUncheckedCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageUncheckedCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesUncheckedCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutSubscriptionsInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutSubscriptionsInput, accountsUncheckedCreateWithoutSubscriptionsInput>
  }

  export type accountsUpsertWithoutSubscriptionsInput = {
    update: XOR<accountsUpdateWithoutSubscriptionsInput, accountsUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<accountsCreateWithoutSubscriptionsInput, accountsUncheckedCreateWithoutSubscriptionsInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutSubscriptionsInput, accountsUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type accountsUpdateWithoutSubscriptionsInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUpdateManyWithoutAccountsNestedInput
    groups?: groupsUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutSubscriptionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUncheckedUpdateManyWithoutAccountsNestedInput
    groups?: groupsUncheckedUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUncheckedUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUncheckedUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type accountsCreateWithoutTop_pagesInput = {
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityCreateNestedManyWithoutAccountsInput
    groups?: groupsCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutTop_pagesInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityUncheckedCreateNestedManyWithoutAccountsInput
    groups?: groupsUncheckedCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageUncheckedCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsUncheckedCreateNestedManyWithoutAccountsInput
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutTop_pagesInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutTop_pagesInput, accountsUncheckedCreateWithoutTop_pagesInput>
  }

  export type accountsUpsertWithoutTop_pagesInput = {
    update: XOR<accountsUpdateWithoutTop_pagesInput, accountsUncheckedUpdateWithoutTop_pagesInput>
    create: XOR<accountsCreateWithoutTop_pagesInput, accountsUncheckedCreateWithoutTop_pagesInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutTop_pagesInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutTop_pagesInput, accountsUncheckedUpdateWithoutTop_pagesInput>
  }

  export type accountsUpdateWithoutTop_pagesInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUpdateManyWithoutAccountsNestedInput
    groups?: groupsUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutTop_pagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUncheckedUpdateManyWithoutAccountsNestedInput
    groups?: groupsUncheckedUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUncheckedUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUncheckedUpdateManyWithoutAccountsNestedInput
    user_accounts?: user_accountsUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type accountsCreateWithoutUser_accountsInput = {
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityCreateNestedManyWithoutAccountsInput
    groups?: groupsCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutUser_accountsInput = {
    id?: number
    external_id: string
    name: string
    type?: string | null
    status: string
    industry?: string | null
    website?: string | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    total_users?: number | null
    active_users?: number | null
    mrr?: Decimal | DecimalJsLike | number | string | null
    subscription_start?: Date | string | null
    next_billing?: Date | string | null
    health_score?: number | null
    rep_id?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    account_activity?: account_activityUncheckedCreateNestedManyWithoutAccountsInput
    groups?: groupsUncheckedCreateNestedManyWithoutAccountsInput
    product_usage?: product_usageUncheckedCreateNestedManyWithoutAccountsInput
    subscriptions?: subscriptionsUncheckedCreateNestedManyWithoutAccountsInput
    top_pages?: top_pagesUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutUser_accountsInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutUser_accountsInput, accountsUncheckedCreateWithoutUser_accountsInput>
  }

  export type usersCreateWithoutUser_accountsInput = {
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_activity?: user_activityCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersCreateNestedManyWithoutUsersInput
    groups?: groupsCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_accountsInput = {
    id?: number
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    group_id?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_activity?: user_activityUncheckedCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_accountsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_accountsInput, usersUncheckedCreateWithoutUser_accountsInput>
  }

  export type accountsUpsertWithoutUser_accountsInput = {
    update: XOR<accountsUpdateWithoutUser_accountsInput, accountsUncheckedUpdateWithoutUser_accountsInput>
    create: XOR<accountsCreateWithoutUser_accountsInput, accountsUncheckedCreateWithoutUser_accountsInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutUser_accountsInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutUser_accountsInput, accountsUncheckedUpdateWithoutUser_accountsInput>
  }

  export type accountsUpdateWithoutUser_accountsInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUpdateManyWithoutAccountsNestedInput
    groups?: groupsUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutUser_accountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    contact_name?: NullableStringFieldUpdateOperationsInput | string | null
    contact_email?: NullableStringFieldUpdateOperationsInput | string | null
    contact_phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    total_users?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    mrr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    subscription_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    health_score?: NullableIntFieldUpdateOperationsInput | number | null
    rep_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    account_activity?: account_activityUncheckedUpdateManyWithoutAccountsNestedInput
    groups?: groupsUncheckedUpdateManyWithoutAccountsNestedInput
    product_usage?: product_usageUncheckedUpdateManyWithoutAccountsNestedInput
    subscriptions?: subscriptionsUncheckedUpdateManyWithoutAccountsNestedInput
    top_pages?: top_pagesUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type usersUpsertWithoutUser_accountsInput = {
    update: XOR<usersUpdateWithoutUser_accountsInput, usersUncheckedUpdateWithoutUser_accountsInput>
    create: XOR<usersCreateWithoutUser_accountsInput, usersUncheckedCreateWithoutUser_accountsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutUser_accountsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutUser_accountsInput, usersUncheckedUpdateWithoutUser_accountsInput>
  }

  export type usersUpdateWithoutUser_accountsInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_activity?: user_activityUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUpdateManyWithoutUsersNestedInput
    groups?: groupsUpdateOneWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_accountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    group_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_activity?: user_activityUncheckedUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_activityInput = {
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersCreateNestedManyWithoutUsersInput
    groups?: groupsCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_activityInput = {
    id?: number
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    group_id?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutUsersInput
    user_newsletters?: user_newslettersUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_activityInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_activityInput, usersUncheckedCreateWithoutUser_activityInput>
  }

  export type usersUpsertWithoutUser_activityInput = {
    update: XOR<usersUpdateWithoutUser_activityInput, usersUncheckedUpdateWithoutUser_activityInput>
    create: XOR<usersCreateWithoutUser_activityInput, usersUncheckedCreateWithoutUser_activityInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutUser_activityInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutUser_activityInput, usersUncheckedUpdateWithoutUser_activityInput>
  }

  export type usersUpdateWithoutUser_activityInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUpdateManyWithoutUsersNestedInput
    groups?: groupsUpdateOneWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_activityInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    group_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUncheckedUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type newslettersCreateWithoutUser_newslettersInput = {
    name: string
    description?: string | null
    created_at?: Date | string | null
  }

  export type newslettersUncheckedCreateWithoutUser_newslettersInput = {
    id?: number
    name: string
    description?: string | null
    created_at?: Date | string | null
  }

  export type newslettersCreateOrConnectWithoutUser_newslettersInput = {
    where: newslettersWhereUniqueInput
    create: XOR<newslettersCreateWithoutUser_newslettersInput, newslettersUncheckedCreateWithoutUser_newslettersInput>
  }

  export type usersCreateWithoutUser_newslettersInput = {
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsCreateNestedManyWithoutUsersInput
    user_activity?: user_activityCreateNestedManyWithoutUsersInput
    groups?: groupsCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_newslettersInput = {
    id?: number
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    group_id?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
    user_accounts?: user_accountsUncheckedCreateNestedManyWithoutUsersInput
    user_activity?: user_activityUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_newslettersInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_newslettersInput, usersUncheckedCreateWithoutUser_newslettersInput>
  }

  export type newslettersUpsertWithoutUser_newslettersInput = {
    update: XOR<newslettersUpdateWithoutUser_newslettersInput, newslettersUncheckedUpdateWithoutUser_newslettersInput>
    create: XOR<newslettersCreateWithoutUser_newslettersInput, newslettersUncheckedCreateWithoutUser_newslettersInput>
    where?: newslettersWhereInput
  }

  export type newslettersUpdateToOneWithWhereWithoutUser_newslettersInput = {
    where?: newslettersWhereInput
    data: XOR<newslettersUpdateWithoutUser_newslettersInput, newslettersUncheckedUpdateWithoutUser_newslettersInput>
  }

  export type newslettersUpdateWithoutUser_newslettersInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type newslettersUncheckedUpdateWithoutUser_newslettersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUpsertWithoutUser_newslettersInput = {
    update: XOR<usersUpdateWithoutUser_newslettersInput, usersUncheckedUpdateWithoutUser_newslettersInput>
    create: XOR<usersCreateWithoutUser_newslettersInput, usersUncheckedCreateWithoutUser_newslettersInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutUser_newslettersInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutUser_newslettersInput, usersUncheckedUpdateWithoutUser_newslettersInput>
  }

  export type usersUpdateWithoutUser_newslettersInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUpdateManyWithoutUsersNestedInput
    user_activity?: user_activityUpdateManyWithoutUsersNestedInput
    groups?: groupsUpdateOneWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_newslettersInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    group_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUncheckedUpdateManyWithoutUsersNestedInput
    user_activity?: user_activityUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type user_accountsCreateWithoutUsersInput = {
    accounts: accountsCreateNestedOneWithoutUser_accountsInput
  }

  export type user_accountsUncheckedCreateWithoutUsersInput = {
    account_id: string
  }

  export type user_accountsCreateOrConnectWithoutUsersInput = {
    where: user_accountsWhereUniqueInput
    create: XOR<user_accountsCreateWithoutUsersInput, user_accountsUncheckedCreateWithoutUsersInput>
  }

  export type user_accountsCreateManyUsersInputEnvelope = {
    data: user_accountsCreateManyUsersInput | user_accountsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type user_activityCreateWithoutUsersInput = {
    date: Date | string
    logins?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type user_activityUncheckedCreateWithoutUsersInput = {
    id?: number
    date: Date | string
    logins?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type user_activityCreateOrConnectWithoutUsersInput = {
    where: user_activityWhereUniqueInput
    create: XOR<user_activityCreateWithoutUsersInput, user_activityUncheckedCreateWithoutUsersInput>
  }

  export type user_activityCreateManyUsersInputEnvelope = {
    data: user_activityCreateManyUsersInput | user_activityCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type user_newslettersCreateWithoutUsersInput = {
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    newsletters?: newslettersCreateNestedOneWithoutUser_newslettersInput
  }

  export type user_newslettersUncheckedCreateWithoutUsersInput = {
    id?: number
    newsletter_id?: number | null
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type user_newslettersCreateOrConnectWithoutUsersInput = {
    where: user_newslettersWhereUniqueInput
    create: XOR<user_newslettersCreateWithoutUsersInput, user_newslettersUncheckedCreateWithoutUsersInput>
  }

  export type user_newslettersCreateManyUsersInputEnvelope = {
    data: user_newslettersCreateManyUsersInput | user_newslettersCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type groupsCreateWithoutUsersInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
    accounts?: accountsCreateNestedOneWithoutGroupsInput
  }

  export type groupsUncheckedCreateWithoutUsersInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
    account_id_new?: string | null
  }

  export type groupsCreateOrConnectWithoutUsersInput = {
    where: groupsWhereUniqueInput
    create: XOR<groupsCreateWithoutUsersInput, groupsUncheckedCreateWithoutUsersInput>
  }

  export type user_accountsUpsertWithWhereUniqueWithoutUsersInput = {
    where: user_accountsWhereUniqueInput
    update: XOR<user_accountsUpdateWithoutUsersInput, user_accountsUncheckedUpdateWithoutUsersInput>
    create: XOR<user_accountsCreateWithoutUsersInput, user_accountsUncheckedCreateWithoutUsersInput>
  }

  export type user_accountsUpdateWithWhereUniqueWithoutUsersInput = {
    where: user_accountsWhereUniqueInput
    data: XOR<user_accountsUpdateWithoutUsersInput, user_accountsUncheckedUpdateWithoutUsersInput>
  }

  export type user_accountsUpdateManyWithWhereWithoutUsersInput = {
    where: user_accountsScalarWhereInput
    data: XOR<user_accountsUpdateManyMutationInput, user_accountsUncheckedUpdateManyWithoutUsersInput>
  }

  export type user_activityUpsertWithWhereUniqueWithoutUsersInput = {
    where: user_activityWhereUniqueInput
    update: XOR<user_activityUpdateWithoutUsersInput, user_activityUncheckedUpdateWithoutUsersInput>
    create: XOR<user_activityCreateWithoutUsersInput, user_activityUncheckedCreateWithoutUsersInput>
  }

  export type user_activityUpdateWithWhereUniqueWithoutUsersInput = {
    where: user_activityWhereUniqueInput
    data: XOR<user_activityUpdateWithoutUsersInput, user_activityUncheckedUpdateWithoutUsersInput>
  }

  export type user_activityUpdateManyWithWhereWithoutUsersInput = {
    where: user_activityScalarWhereInput
    data: XOR<user_activityUpdateManyMutationInput, user_activityUncheckedUpdateManyWithoutUsersInput>
  }

  export type user_activityScalarWhereInput = {
    AND?: user_activityScalarWhereInput | user_activityScalarWhereInput[]
    OR?: user_activityScalarWhereInput[]
    NOT?: user_activityScalarWhereInput | user_activityScalarWhereInput[]
    id?: IntFilter<"user_activity"> | number
    user_id?: IntNullableFilter<"user_activity"> | number | null
    date?: DateTimeFilter<"user_activity"> | Date | string
    logins?: IntNullableFilter<"user_activity"> | number | null
    pageviews?: IntNullableFilter<"user_activity"> | number | null
    created_at?: DateTimeNullableFilter<"user_activity"> | Date | string | null
  }

  export type user_newslettersUpsertWithWhereUniqueWithoutUsersInput = {
    where: user_newslettersWhereUniqueInput
    update: XOR<user_newslettersUpdateWithoutUsersInput, user_newslettersUncheckedUpdateWithoutUsersInput>
    create: XOR<user_newslettersCreateWithoutUsersInput, user_newslettersUncheckedCreateWithoutUsersInput>
  }

  export type user_newslettersUpdateWithWhereUniqueWithoutUsersInput = {
    where: user_newslettersWhereUniqueInput
    data: XOR<user_newslettersUpdateWithoutUsersInput, user_newslettersUncheckedUpdateWithoutUsersInput>
  }

  export type user_newslettersUpdateManyWithWhereWithoutUsersInput = {
    where: user_newslettersScalarWhereInput
    data: XOR<user_newslettersUpdateManyMutationInput, user_newslettersUncheckedUpdateManyWithoutUsersInput>
  }

  export type groupsUpsertWithoutUsersInput = {
    update: XOR<groupsUpdateWithoutUsersInput, groupsUncheckedUpdateWithoutUsersInput>
    create: XOR<groupsCreateWithoutUsersInput, groupsUncheckedCreateWithoutUsersInput>
    where?: groupsWhereInput
  }

  export type groupsUpdateToOneWithWhereWithoutUsersInput = {
    where?: groupsWhereInput
    data: XOR<groupsUpdateWithoutUsersInput, groupsUncheckedUpdateWithoutUsersInput>
  }

  export type groupsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
    accounts?: accountsUpdateOneWithoutGroupsNestedInput
  }

  export type groupsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
    account_id_new?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type account_activityCreateManyAccountsInput = {
    id?: number
    date: Date | string
    active_users?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type groupsCreateManyAccountsInput = {
    id?: string
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: groupsCreateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    user_count?: number
    account_id: number
  }

  export type product_usageCreateManyAccountsInput = {
    id?: number
    product_id?: number | null
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscriptionsCreateManyAccountsInput = {
    id?: number
    external_id: string
    customer_name: string
    email?: string | null
    plan: string
    plan_type: string
    status: string
    amount?: Decimal | DecimalJsLike | number | string | null
    billing_cycle?: string | null
    start_date?: Date | string | null
    next_billing?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type top_pagesCreateManyAccountsInput = {
    id?: number
    url: string
    title?: string | null
    pageviews?: number | null
    avg_time_on_page?: number | null
    bounce_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type user_accountsCreateManyAccountsInput = {
    user_id: number
  }

  export type account_activityUpdateWithoutAccountsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type account_activityUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type account_activityUncheckedUpdateManyWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type groupsUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
    users?: usersUpdateManyWithoutGroupsNestedInput
  }

  export type groupsUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
    users?: usersUncheckedUpdateManyWithoutGroupsNestedInput
  }

  export type groupsUncheckedUpdateManyWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    default_template?: NullableStringFieldUpdateOperationsInput | string | null
    product_grant_ids?: groupsUpdateproduct_grant_idsInput | string[]
    demographics?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_count?: IntFieldUpdateOperationsInput | number
    account_id?: IntFieldUpdateOperationsInput | number
  }

  export type product_usageUpdateWithoutAccountsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    products?: productsUpdateOneWithoutProduct_usageNestedInput
  }

  export type product_usageUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    product_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_usageUncheckedUpdateManyWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    product_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscriptionsUpdateWithoutAccountsInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    customer_name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    plan_type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscriptionsUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    customer_name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    plan_type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscriptionsUncheckedUpdateManyWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    customer_name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    plan_type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billing_cycle?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_billing?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type top_pagesUpdateWithoutAccountsInput = {
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    avg_time_on_page?: NullableIntFieldUpdateOperationsInput | number | null
    bounce_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type top_pagesUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    avg_time_on_page?: NullableIntFieldUpdateOperationsInput | number | null
    bounce_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type top_pagesUncheckedUpdateManyWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    avg_time_on_page?: NullableIntFieldUpdateOperationsInput | number | null
    bounce_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_accountsUpdateWithoutAccountsInput = {
    users?: usersUpdateOneRequiredWithoutUser_accountsNestedInput
  }

  export type user_accountsUncheckedUpdateWithoutAccountsInput = {
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type user_accountsUncheckedUpdateManyWithoutAccountsInput = {
    user_id?: IntFieldUpdateOperationsInput | number
  }

  export type usersCreateManyGroupsInput = {
    id?: number
    external_id: string
    email: string
    role?: string | null
    status?: string | null
    department?: string | null
    title?: string | null
    phone?: string | null
    join_date?: Date | string | null
    last_login?: Date | string | null
    login_count?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: string | null
    lastname?: string | null
    last_synced_at?: Date | string | null
    last_source?: string | null
  }

  export type usersUpdateWithoutGroupsInput = {
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUpdateManyWithoutUsersNestedInput
    user_activity?: user_activityUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutGroupsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
    user_accounts?: user_accountsUncheckedUpdateManyWithoutUsersNestedInput
    user_activity?: user_activityUncheckedUpdateManyWithoutUsersNestedInput
    user_newsletters?: user_newslettersUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateManyWithoutGroupsInput = {
    id?: IntFieldUpdateOperationsInput | number
    external_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    join_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    login_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attributes?: NullableJsonNullValueInput | InputJsonValue
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    last_synced_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_source?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_newslettersCreateManyNewslettersInput = {
    id?: number
    user_id?: number | null
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type user_newslettersUpdateWithoutNewslettersInput = {
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutUser_newslettersNestedInput
  }

  export type user_newslettersUncheckedUpdateWithoutNewslettersInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_newslettersUncheckedUpdateManyWithoutNewslettersInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_usageCreateManyProductsInput = {
    id?: number
    account_id?: number | null
    date: Date | string
    pageviews?: number | null
    active_users?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type product_usageUpdateWithoutProductsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accounts?: accountsUpdateOneWithoutProduct_usageNestedInput
  }

  export type product_usageUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_usageUncheckedUpdateManyWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    active_users?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_accountsCreateManyUsersInput = {
    account_id: string
  }

  export type user_activityCreateManyUsersInput = {
    id?: number
    date: Date | string
    logins?: number | null
    pageviews?: number | null
    created_at?: Date | string | null
  }

  export type user_newslettersCreateManyUsersInput = {
    id?: number
    newsletter_id?: number | null
    subscribed?: boolean | null
    open_rate?: Decimal | DecimalJsLike | number | string | null
    click_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type user_accountsUpdateWithoutUsersInput = {
    accounts?: accountsUpdateOneRequiredWithoutUser_accountsNestedInput
  }

  export type user_accountsUncheckedUpdateWithoutUsersInput = {
    account_id?: StringFieldUpdateOperationsInput | string
  }

  export type user_accountsUncheckedUpdateManyWithoutUsersInput = {
    account_id?: StringFieldUpdateOperationsInput | string
  }

  export type user_activityUpdateWithoutUsersInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_activityUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_activityUncheckedUpdateManyWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: NullableIntFieldUpdateOperationsInput | number | null
    pageviews?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_newslettersUpdateWithoutUsersInput = {
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    newsletters?: newslettersUpdateOneWithoutUser_newslettersNestedInput
  }

  export type user_newslettersUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    newsletter_id?: NullableIntFieldUpdateOperationsInput | number | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_newslettersUncheckedUpdateManyWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    newsletter_id?: NullableIntFieldUpdateOperationsInput | number | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    open_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    click_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}