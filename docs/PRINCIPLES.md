# Operational Principles

These principles guide judgement before a pattern is concrete enough to become a requirement. Requirements, architecture notes, and tests remain the source of enforceable truth.

Use this document to ask better questions during design and review.

## Entropy

> Continuous internal metabolism is required to export information noise and prevent the system from reaching a state of stagnant equilibrium.

Systems accumulate noise unless they continually organise, measure, and remove it.

Ask:

- Is this change reducing future ambiguity or creating new maintenance drag?
- What signal would show that this area is becoming noisy?

## Least Action

> Systemic resilience is maximized by achieving objectives through the minimum number of state transitions and data movements.

Prefer the fewest useful state transitions, data movements, and edits.

Ask:

- Can this be expressed as a smaller changeset or narrower state update?
- Can functional transformation replace mutation or broad invalidation?

## Symmetry

> Global stability is maintained by ensuring that logic and patterns remain invariant regardless of the scale or entry point of the operation.

Core patterns should remain recognisable across scale and entry point.

Ask:

- Does this follow the same contract shape as similar code?
- If it diverges, is that divergence intentional and named?

## Integration & Differentiation

> Power is derived from specialized, autonomous components that communicate through a unified, high-fidelity protocol.

Specialised parts should stay focused while speaking a shared protocol.

Ask:

- Does this belong to this component, or to a shared layer or consumer wrapper?
- Does the local API strengthen or weaken the wider system contract?

## Homeostasis

> The system must possess internal feedback loops that allow it to autonomously return to a functional baseline after external shocks.

Systems should recover to a functional baseline after shocks.

Ask:

- What happens after invalid config, partial installs, failed builds, unsupported codemods, or stale generated output?
- Does the CLI, build system, CI, or runtime have a clear recovery path?

## Constructive Interference

> Individual modules must be tuned to reinforce and amplify the operational logic of the surrounding layers.

Adjacent layers should reinforce the same architectural bet.

Ask:

- Do requirements, types, tests, docs, and generated output describe the same behaviour?
- Does this layer amplify the surrounding layers or fight them?

## Symmetry Breaking

> Structural evolution requires the intentional disruption of stable patterns to transition the system into a more complex configuration.

Stable patterns sometimes need intentional disruption to evolve.

Ask:

- What pressure justifies breaking the current pattern?
- What would make this local exception become a new convention?

Potential pressure signals include bundle size, performance, file size, graph size, codemod complexity, and repeated exceptions.

## Polarity

> Systemic health is found in the active management of opposing tensions, such as read vs. write or security vs. access, rather than the elimination of either pole.

Healthy systems manage opposing tensions instead of eliminating one side.

Ask:

- Which tension does this decision sit inside?
- Have we documented the tradeoff rather than hiding it in implementation detail?

Examples include native vs non-native, consumer freedom vs owned semantics, generated ownership vs editability, and strict codemods vs consumer customisation.

## Necessity Of Dissipation

> A sustainable system must provide a dedicated path for the eviction and deletion of obsolete data to prevent internal suffocation.

Obsolete data, code, artefacts, and compatibility paths need an exit.

Ask:

- What removes or retires this when it is no longer useful?
- What cleanup path exists after failure?

## Fractal Integrity

> The architectural philosophy of the entire system must be consistently reflected within its smallest functional units.

Small units should reflect the architecture of the whole.

Ask:

- Would this file teach the same principles as the larger codebase?
- Does local convenience undermine global coherence?

## Synergy

> Component utility is measured by the degree to which local resources are yielded to support the stability and objectives of the global system.

Local value should support global stability.

Ask:

- Does this local improvement make the wider system easier to reason about?
- Does it preserve accessibility, build consistency, runtime health, and test traceability?
