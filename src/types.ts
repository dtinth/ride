/**
 * A Decorator is a function that takes an original method function and returns an overridden method function.
 * @public
 */
export type Decorator<T, F> = F extends (this: T, ...args: infer A) => infer R
  ? (original: (this: T, ...args: A) => R) => (this: T, ...args: A) => R
  : (original: F) => F
