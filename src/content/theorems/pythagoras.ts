import type { Entry } from '../../types/entry';

/**
 * The rearrangement (dissection) proof.
 *
 * Four copies of the triangle are packed into a square of side a + b in two
 * different ways. Both packings use the same four triangles, so the leftover
 * area must agree: a tilted square of side c in the first packing, and the two
 * squares a^2 and b^2 in the second.
 */
export const pythagoras: Entry = {
  id: 'thm.pythagoras',
  kind: 'theorem',
  title: 'Pythagorean theorem',
  statement: String.raw`a^2 + b^2 = c^2`,
  informal:
    'In a right triangle, the squares built on the two legs together cover exactly as much area as the square built on the hypotenuse. The proof below never computes a length — it only moves four identical triangles around inside a fixed square and compares what is left over.',
  tags: ['geometry'],
  figureId: 'pythagoras',
  references: [
    { label: 'Euclid, Elements I.47' },
    { label: 'Bhāskara II, Līlāvatī (12th c.)' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [
      String.raw`\text{a right triangle with legs } a, b \text{ and hypotenuse } c`,
      String.raw`\text{the right angle lies between } a \text{ and } b`,
    ],
    steps: [
      {
        id: 'setup',
        title: 'Name the sides',
        claim: String.raw`a \le b, \qquad c = \text{hypotenuse}`,
        note: 'The two legs meet at the right angle; the hypotenuse is the side opposite it. Nothing yet claims a relationship between them — that is the whole point of the theorem.',
        role: 'setup',
        reason: [{ type: 'construction', note: 'Label the sides of the given triangle.' }],
        highlight: ['triangle', 'legs'],
      },
      {
        id: 'frame',
        title: 'Build a square of side a + b',
        claim: String.raw`|\square| = (a+b)^2`,
        note: 'Laying a leg of length a end to end with a leg of length b gives a segment of length a + b. Take the square on that segment. Its area is fixed from here on, and every later step is an argument about how that fixed area gets spent.',
        role: 'construction',
        reason: [{ type: 'construction', note: 'Choose the enclosing square.' }],
        dependsOn: ['setup'],
        highlight: ['square-frame'],
      },
      {
        id: 'pinwheel',
        title: 'Pack in four copies of the triangle',
        note: 'Place one copy in each corner, each turned a quarter turn from the last. Every side of the big square is then covered by one leg a and one leg b, which is exactly why the side length a + b was the right choice.',
        role: 'construction',
        reason: [
          { type: 'construction', note: 'Four congruent copies, rotated by 90° successively.' },
          { type: 'step', ref: 'frame' },
        ],
        dependsOn: ['frame'],
        highlight: ['pinwheel'],
      },
      {
        id: 'hole-is-square',
        title: 'The hole left in the middle is a square of side c',
        claim: String.raw`\alpha + \beta = \tfrac{\pi}{2} \;\Longrightarrow\; \text{each corner of the hole is a right angle}`,
        note: 'All four of its sides are hypotenuses, so they all have length c. For the corners: at each of them two triangle angles α and β sit beside the hole along a straight edge. Since α + β = 90°, the remaining angle is 90° too. Four equal sides and four right angles — a square.',
        role: 'observation',
        reason: [
          { type: 'cite', ref: 'thm.triangle-angle-sum', note: 'forces α + β = 90° in a right triangle' },
          { type: 'step', ref: 'pinwheel' },
        ],
        dependsOn: ['pinwheel'],
        highlight: ['inner-square'],
      },
      {
        id: 'count-a',
        title: 'Account for the area, first packing',
        claim: String.raw`(a+b)^2 = 4 \cdot \tfrac{1}{2}ab \;+\; c^2`,
        note: 'The big square is exactly the four triangles plus the hole, with nothing overlapping and nothing left out.',
        role: 'derivation',
        reason: [
          { type: 'cite', ref: 'ax.area-additivity' },
          { type: 'step', ref: 'hole-is-square' },
        ],
        dependsOn: ['hole-is-square'],
        highlight: ['inner-square', 'pinwheel'],
      },
      {
        id: 'rearrange',
        title: 'Slide the same four triangles into two rectangles',
        note: 'Nothing is added or removed: each triangle is slid or turned into a new position. Pairs of them now meet along a hypotenuse to form two a × b rectangles, which tuck into the square along two opposite edges.',
        role: 'construction',
        reason: [
          { type: 'cite', ref: 'ax.area-additivity', note: 'rigid motions preserve area' },
          { type: 'construction', note: 'Re-pack the same four triangles.' },
        ],
        dependsOn: ['pinwheel'],
        highlight: ['rearranged'],
      },
      {
        id: 'two-squares',
        title: 'Now the uncovered region is two squares',
        claim: String.raw`\text{leftover} = a^2 + b^2`,
        note: 'The two rectangles occupy an a-wide strip and a b-wide strip. What they leave behind is a square of side a in one corner and a square of side b in the opposite corner.',
        role: 'observation',
        reason: [{ type: 'step', ref: 'rearrange' }],
        dependsOn: ['rearrange'],
        highlight: ['a2', 'b2'],
      },
      {
        id: 'count-b',
        title: 'Account for the area, second packing',
        claim: String.raw`(a+b)^2 = 4 \cdot \tfrac{1}{2}ab \;+\; a^2 + b^2`,
        note: 'Same big square, same four triangles, so the same bookkeeping applies — only the description of the leftover has changed.',
        role: 'derivation',
        reason: [
          { type: 'cite', ref: 'ax.area-additivity' },
          { type: 'step', ref: 'two-squares' },
        ],
        dependsOn: ['two-squares'],
        highlight: ['a2', 'b2', 'rearranged'],
      },
      {
        id: 'conclude',
        title: 'Compare the two accounts',
        claim: String.raw`
          4 \cdot \tfrac{1}{2}ab + c^2 = 4 \cdot \tfrac{1}{2}ab + a^2 + b^2
          \;\Longrightarrow\;
          c^2 = a^2 + b^2
        `,
        note: 'Both expressions equal the area of the same square, so they equal each other. The four triangles contribute 2ab to both sides and cancel, leaving the theorem.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'count-a' },
          { type: 'step', ref: 'count-b' },
          { type: 'algebra', note: 'Subtract 2ab from both sides.' },
        ],
        dependsOn: ['count-a', 'count-b'],
        highlight: ['a2', 'b2', 'c2'],
      },
    ],
  },
};
