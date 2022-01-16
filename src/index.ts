/**
 * A library for overriding methods.
 * Based on the {@link https://me.dt.in.th/page/JavaScript-override/ | Monkey-Patching, Overriding, and Decorating Methods in JavaScript} article.
 * @packageDocumentation
 */
import { Decorator } from './types'
export * from './types'

/**
 * Overrides a method named `methodName` on the `object` with the result from
 * calling the `callback` function with the original method.
 *
 * @param object - The object with the method that you want to override.
 * @param methodName - The name of the method to override.
 * @param decorator - The function that should return the overridden method.
 * @public
 */
export function ride<T extends object, K extends keyof T>(
  object: T,
  methodName: K,
  decorator: Decorator<T, T[K]>,
) {
  const unsafeObject = object as any
  unsafeObject[methodName] = decorator(unsafeObject[methodName])
}

/**
 * Decorators that can be used with the {@link (ride:function)} function.
 * @public
 */
export namespace ride {
  /**
   * Calls the `extraBehavior` after the original function has been called.
   * @remarks
   * If the original function throws an error, the `extraBehavior` will NOT be called.
   * @param extraBehavior - The function to call after the original function returned.
   * @public
   * @example
   * ```
   * ride(test, 'saveResults', ride.after(savePlan))
   * ```
   */
  export function after<T, A extends any[], R>(
    extraBehavior: (this: T, ...args: A) => void,
  ): Decorator<T, (this: T, ...args: A) => R> {
    return function (original) {
      return function (...args) {
        var returnValue = original.apply(this, args)
        extraBehavior.apply(this, args)
        return returnValue
      }
    }
  }

  /**
   * Calls the `extraBehavior` before the original function will be called.
   * @remarks
   * If `extraBehavior` throws an error, the original function will NOT be called.
   * Any returned value from `extraBehavior` will be ignored.
   * @param extraBehavior - The function to call before the original function is called.
   * @public
   * @example
   * ```
   * ride(test, 'exit', ride.before(captureScreenshot))
   * ```
   */
  export function before<T, A extends any[], R>(
    extraBehavior: (this: T, ...args: A) => void,
  ): Decorator<T, (this: T, ...args: A) => R> {
    return function (original) {
      return function (...args) {
        extraBehavior.apply(this, args)
        return original.apply(this, args)
      }
    }
  }

  /**
   * Transforms the return value of the original function.
   * @remarks
   * If the original function throws an error, the `transformer` function will NOT be called.
   * @param transformer - The function that takes in the return value of the original function and returns a new return value.
   * @public
   * @example
   * ```
   * ride(test, 'getName', ride.compose(name => name.toUpperCase()))
   * ```
   */

  export function compose<T, R>(
    transformer: (this: T, value: R) => R,
  ): Decorator<T, (this: T, ...args: any[]) => R> {
    return function (original) {
      return function (...args) {
        return transformer.call(this, original.apply(this, args))
      }
    }
  }

  /**
   * Calls the `wrapper` function instead of the original function.
   * The wrapper function is passed a function that can invoke the original function with the original arguments.
   * @param wrapper - The function that will be called instead of the original function.
   * The first parameter passed to the wrapper function is a function that will call the original function with the original arguments and return its result.
   * @public
   * @example
   * ```
   * ride(test, 'deletePost', ride.wrap(function(wrapped, postId) {
   *   if (this.user.owns(postId)) {
   *     return wrapped()
   *   } else {
   *     throw new Error('No, you can\'t do that!')
   *   }
   * })
   * ```
   */
  export function wrap<T, A extends any[], R>(
    wrapper: (this: T, wrapped: () => R, ...args: A) => R,
  ): Decorator<T, (this: T, ...args: A) => R> {
    return function (original) {
      return function (...args) {
        return wrapper.call(this, () => original.apply(this, args), ...args)
      }
    }
  }
}
