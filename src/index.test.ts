import { ride } from '.'

class TestClass {
  sequence: any[] = []
  run(a: any) {
    this.sequence.push(['original', a])
    return 'original'
  }
}

let object: TestClass

beforeEach(function () {
  object = new TestClass()
})

describe('ride', function () {
  it('should override a method', function () {
    var originalTest = object.run
    ride(object, 'run', (original) => {
      return function (a) {
        expect(original).toEqual(originalTest)
        this.sequence.push(['overridden', a])
        return 'overridden'
      }
    })
    object.run(42)
    expect(object.sequence).toEqual([['overridden', 42]])
  })
})

describe('ride with after', function () {
  it('should run extra behavior after original', function () {
    ride(
      object,
      'run',
      ride.after(function (a) {
        this.sequence.push(['overridden', a])
        return 'overridden'
      }),
    )
    var returnValue = object.run(42)
    expect(object.sequence).toEqual([
      ['original', 42],
      ['overridden', 42],
    ])
    expect(returnValue).toEqual('original')
  })
})

describe('ride with before', function () {
  it('should run extra behavior before original', function () {
    ride(
      object,
      'run',
      ride.before(function (a) {
        this.sequence.push(['overridden', a])
        return 'overridden'
      }),
    )
    var returnValue = object.run(42)
    expect(object.sequence).toEqual([
      ['overridden', 42],
      ['original', 42],
    ])
    expect(returnValue).toEqual('original')
  })
})

describe('ride with compose', function () {
  it('should compose the return value of the original function with given function', function () {
    ride(
      object,
      'run',
      ride.compose(function (x) {
        this.sequence.push(['overridden'])
        return x.toUpperCase()
      }),
    )
    var returnValue = object.run(42)
    expect(object.sequence).toEqual([['original', 42], ['overridden']])
    expect(returnValue).toEqual('ORIGINAL')
  })
})

describe('ride with wrap', function () {
  it('should wrap the original function', function () {
    ride(
      object,
      'run',
      ride.wrap(function (wrapped, a) {
        this.sequence.push(['overridden', a])
        var r = wrapped()
        this.sequence.push(['overridden', a])
        return r.toUpperCase()
      }),
    )
    var returnValue = object.run(42)
    expect(object.sequence).toEqual([
      ['overridden', 42],
      ['original', 42],
      ['overridden', 42],
    ])
    expect(returnValue).toEqual('ORIGINAL')
  })
})
