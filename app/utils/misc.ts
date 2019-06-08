import R, { compose, curry, flip, of, repeat } from "ramda";

export const permutations: any = curry(
  compose(
    (R as any).sequence(of),
    flip(repeat)
  )
);
