describe("Basic functions", function() {
  describe("ctor", function() {
    it("should return the constructor of the object", function() {
      var O = function() { this.foo = 42; };

      expect(L.ctor([])).toBe(Array);
      expect(L.ctor({})).toBe(Object);
      expect(L.ctor(new O())).toBe(O);
      expect(L.ctor(null)).toBe(null);
    });
  });

  describe("interpose", function() {
    it("should inject the first arg in-between the elements of the second array arg", function() {
      var a = [1,2,3];
      var b = [1,2];
      var c = [1];

      expect(L.interpose(0, a)).toEqual([1,0,2,0,3]);
      expect(L.interpose(0, [1])).toEqual([1]);
      expect(L.interpose(0, b)).toEqual([1,0,2]);
      expect(L.interpose(0, c)).toEqual([1]);
    });

    it("should properly handle empty array arguments", function() {
      expect(L.interpose(0, [])).toEqual([]);
    });

    it("should not modify the original", function() {
      var a = [1,2,3];
      var _ = L.interpose(0, a);

      expect(a).toEqual([1,2,3]);
    });

    it("should throw an exception if not given an array", function() {
      expect(function() { L.interpose(0,1); }).toThrow();
      expect(function() { L.interpose(0); }).toThrow();
    });
  });

  describe("interleave", function() {
    it("should weave the arrays together", function() {
      var a = [1,2,3];
      var b = [1,2];
      var c = ['a', 'b', 'c'];

      expect(L.interleave(a,b)).toEqual([1,1,2,2,3]);
      expect(L.interleave(a,a)).toEqual([1,1,2,2,3,3]);
      expect(L.interleave(c,a)).toEqual(['a',1,'b',2,'c',3]);
      expect(L.interleave(a,b,c)).toEqual([1,1,'a',2,2,'b',3,'c']);
    });

    it("should properly handle empty arguments", function() {
      expect(L.interleave([], [])).toEqual([]);
      expect(L.interleave([1,2,3], [])).toEqual([1,2,3]);
      expect(L.interleave([], [1,2,3])).toEqual([1,2,3]);
    });

    it("should not modify the original", function() {
      var a = [1,2,3];
      var _ = L.interleave(a, a);

      expect(a).toEqual([1,2,3]);
    });
  });

  describe("repeat", function() {
    it("should build an array of some size with the specified element in each slot", function() {
      expect(L.repeat(3,1)).toEqual([1,1,1]);
      expect(L.repeat(0)).toEqual([]);
      expect(L.repeat(0,1)).toEqual([]);
    });

    it("should throw an exception if not given a number as the first arg", function() {
      expect(function() { L.repeat(); }).toThrow();
    });

    it("should return an empty array when given a negative repeat value", function() {
      expect(L.repeat(-3,1)).toEqual([]);
    });
  });

  describe("cycle", function() {
    it("should build an array of some size filled with the elements of the given array repeated", function() {
      var a = [1,2,3];

      expect(L.cycle(3,a)).toEqual([1,2,3,1,2,3,1,2,3]);
      expect(L.cycle(0,a)).toEqual([]);
      expect(_.take(L.cycle(33,a), 3)).toEqual([1,2,3]);
    });

    it("should throw an exception if not given a number as the first arg", function() {
      expect(function() { L.cycle(); }).toThrow();
    });

    it("should return an empty array when given a negative repeat value", function() {
      expect(L.cycle(-3,1)).toEqual([]);
    });
  });

  describe("second", function() {
    var a = [1,2,3];

    it("should return the second element of the array given, undefined if outside of the bounds", function() {

      expect(L.second(a)).toEqual(2);
      expect(L.second([1])).toEqual(undefined);
      expect(L.second([])).toEqual(undefined);
    });

    it("should throw an exception if not given a number as the first arg", function() {
      expect(function() { L.second(1); }).toThrow();
    });
  });

  describe("increasing / increasingOrEq / decreasing / decreasingOrEq", function() {
    it("should recognize if the arguments are monotonically increasing or decreasing", function() {
      var inc = [1,2,3];
      var incAlso = [1,2,3,3,4];
      var dec = [5,4,3,2,1];
      var decAlso = [5,4,3,3,2,1];

      expect(L.increasing.apply(null, inc)).toBeTruthy();
      expect(L.increasingOrEq.apply(null, incAlso)).toBeTruthy();
      expect(L.increasing.apply(null, dec)).toBeFalsy();
      expect(L.decreasing.apply(null, dec)).toBeTruthy();
      expect(L.decreasingOrEq.apply(null, decAlso)).toBeTruthy();
      expect(L.decreasing.apply(null, inc)).toBeFalsy();
    });
  });

  describe("assoc", function() {
    it("should allow the placement of a value at any depth in an associative structure", function() {
      var obj = {a: {b: {c: 42, d: 108}}};
      var ary = ['a', ['b', ['c', 'd'], 'e']];

      expect(L.assoc(obj, ['a', 'b', 'c'], 9)).toEqual({a: {b: {c: 9, d: 108}}});
      expect(L.assoc(ary, [1, 1, 0], 9)).toEqual(['a', ['b', [9, 'd'], 'e']]);

      expect(L.assoc(obj, 'a', 9)).toEqual({a: 9});
      expect(L.assoc(ary, 1, 9)).toEqual(['a', 9]);
    });

    it("should not modify the original", function() {
      var obj = {a: {b: {c: 42, d: 108}}};
      var ary = ['a', ['b', ['c', 'd'], 'e']];
      var _   = L.assoc(obj, ['a', 'b', 'c'], 9);
      var __  = L.assoc(ary, [1, 1, 0], 9);

      expect(obj).toEqual({a: {b: {c: 42, d: 108}}});
      expect(ary).toEqual(['a', ['b', ['c', 'd'], 'e']]);
    });
  });

  describe("splitAt", function() {
    it("should bifurcate an array at a given index, returning an array of the parts", function() {
      var a = [1,2,3,4,5];

      expect(L.splitAt(2, a)).toEqual([[1,2], [3,4,5]]);
      expect(L.splitAt(0, a)).toEqual([[], [1,2,3,4,5]]);
      expect(L.splitAt(5, a)).toEqual([[1,2,3,4,5], []]);
      expect(L.splitAt(2, [])).toEqual([[], []]);
    });

    it("should not modify the original", function() {
      var a = [1,2,3,4,5];
      var _ = L.splitAt(2, a);

      expect(a).toEqual([1,2,3,4,5]);
    });

    it("should throw an exception if not given a number as the first arg or an array as the second", function() {
      expect(function() { L.splitAt('a', []); }).toThrow();
      expect(function() { L.splitAt(1); }).toThrow();
      expect(function() { L.splitAt(); }).toThrow();
    });
  });

  describe("takeSkipping", function() {
    it("should take every nth element in an array", function() {
      var a = _.range(10);

      expect(L.takeSkipping(2, a)).toEqual([0, 2, 4, 6, 8]);
    });

    it("should not modify the original", function() {
      var a = [1,2,3];
      var _ = L.takeSkipping(2, a);

      expect(a).toEqual([1,2,3]);
    });

    it("should throw an exception if not given a number as the first arg or an array as the second", function() {
      expect(function() { L.takeSkipping('a', []); }).toThrow();
      expect(function() { L.takeSkipping(1); }).toThrow();
      expect(function() { L.takeSkipping(); }).toThrow();
    });
  });

  describe("renameKeys", function() {
    it("should rename the keys in the first object to the mapping in the second object", function() {
      expect(L.renameKeys({'a': 1, 'b': 2}, {'a': 'A'})).toEqual({'b': 2, 'A': 1});
    });

    it("should not modify the original", function() {
      var a = {'a': 1, 'b': 2};
      var _ = L.renameKeys(a, {'a': 'A'});

      expect(a).toEqual({'a': 1, 'b': 2});
    });
  });

  describe("selectKeys", function() {
    it("should return an object filled with the entries of the keys array given", function() {
      expect(L.selectKeys({'a': 1, 'b': 2}, ['a'])).toEqual({'a': 1});
    });
  });
});
