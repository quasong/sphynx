import type { ComponentType } from 'react';
import type { FigureProps } from '../types/figure';
import { ArchimedeanFigure } from './ArchimedeanFigure';
import { BisectionFigure } from './BisectionFigure';
import { CauchyCriterionFigure, CauchyFigure } from './CauchyFigure';
import { ClosedSetFigure } from './ClosedSetFigure';
import { CompactFigure } from './CompactFigure';
import { CompleteMetricFigure } from './CompleteMetricFigure';
import { ContinuousCompleteFigure } from './ContinuousCompleteFigure';
import { DerivativeFigure } from './DerivativeFigure';
import { EpsilonDeltaFigure } from './EpsilonDeltaFigure';
import { ContinuousIntegrableFigure, FundamentalCalculusFigure, RiemannFigure } from './IntegralFigure';
import { MeanValueFigure } from './MeanValueFigure';
import { ExtremeValueFigure } from './ExtremeValueFigure';
import { QIncompleteFigure } from './QIncompleteFigure';
import { IntermediateValueFigure } from './IntermediateValueFigure';
import { FixedPointFigure } from './FixedPointFigure';
import { MetricFigure } from './MetricFigure';
import { MonotoneFigure } from './MonotoneFigure';
import { PicardFigure } from './PicardFigure';
import { SequenceLimitFigure } from './SequenceLimitFigure';
import { Sqrt2Figure } from './Sqrt2Figure';
import { HeineCantorFigure, UniformContinuityFigure } from './UniformContinuityFigure';
import { UniformConvergenceFigure } from './UniformConvergenceFigure';
import { UniformLimitFigure } from './UniformLimitFigure';
import { SupremumFigure } from './SupremumFigure';

/**
 * Figures are looked up by the id an entry declares. Entries stay plain data
 * and never import a component, so content and rendering can move separately.
 */
const FIGURES: Record<string, ComponentType<FigureProps>> = {
  sqrt2: Sqrt2Figure,
  'epsilon-delta': EpsilonDeltaFigure,
  supremum: SupremumFigure,
  'q-incomplete': QIncompleteFigure,
  archimedean: ArchimedeanFigure,
  'extreme-value': ExtremeValueFigure,
  'sequence-limit': SequenceLimitFigure,
  monotone: MonotoneFigure,
  bisection: BisectionFigure,
  'uniform-continuity': UniformContinuityFigure,
  'heine-cantor': HeineCantorFigure,
  cauchy: CauchyFigure,
  'cauchy-criterion': CauchyCriterionFigure,
  'intermediate-value': IntermediateValueFigure,
  metric: MetricFigure,
  'complete-metric': CompleteMetricFigure,
  'fixed-point': FixedPointFigure,
  'closed-set': ClosedSetFigure,
  compact: CompactFigure,
  'uniform-convergence': UniformConvergenceFigure,
  'uniform-limit': UniformLimitFigure,
  'continuous-complete': ContinuousCompleteFigure,
  derivative: DerivativeFigure,
  'mean-value': MeanValueFigure,
  'riemann-integral': RiemannFigure,
  'continuous-integrable': ContinuousIntegrableFigure,
  'fundamental-calculus': FundamentalCalculusFigure,
  picard: PicardFigure,
};

export function getFigure(id: string | undefined): ComponentType<FigureProps> | undefined {
  return id ? FIGURES[id] : undefined;
}
