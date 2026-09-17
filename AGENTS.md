# AGENTS.md

# CLINIC PROJECT — AGENT GOVERNANCE CONTRACT

## 1. Purpose

This file defines the mandatory operating rules for every AI agent, coding agent, automation agent, reviewer, or assistant working inside this project.

This file does not replace the project constitution.

Its purpose is to enforce the correct order of reading, decision-making, implementation, verification, and reporting.

Every agent working in this repository is bound by this contract.

---

## 2. Absolute Source-of-Truth Rule

Before performing any analysis, planning, coding, modification, deletion, refactoring, styling, architectural decision, or file creation, the agent MUST consult the following official project sources.

### Source of Truth 1 — Project Constitution

```text
docs/CLINIC_PROJECT_CONSTITUTION.md

This document is the authoritative source for the complete project.

It contains the project's requirements, architecture, structure, rules, constraints, responsibilities, technical decisions, business behavior, data rules, security rules, performance rules, implementation conditions, and all other project requirements.

All numbered sections and all topics described inside the constitution are part of one authoritative document.

This includes, but is not limited to:

Architecture

Application structure

Content structure

Database rules

API rules

Authentication

Authorization

Security

Validation

Business logic

Data ownership

Performance

Caching

Events and hooks

Media

SEO

Deployment

Testing

Development rules

Prohibited practices

Architectural simplicity

Agent behavior

All explicit project requirements

The agent MUST NOT treat these topics as independent sources.

The constitution is the single authoritative source for all of them.

Source of Truth 2 — Brand Identity and Visual Guidelines
brand-guidelines/

This directory is the authoritative source for the project's visual identity and brand presentation.

It is mandatory for every user-facing visual decision, including:
### Primary Brown Abstract Background

Reference asset:
`brand-guidelines/bg-for-sec-and-identty/primary-brown-abstract-background.webp`

This image is the approved visual reference for the clinic's brown
abstract background style.

Use it as a visual reference for:

- Brown section backgrounds
- Premium brand surfaces
- Abstract background compositions
- Soft flowing shapes
- Brown and bronze gradients
- Elegant layered background treatments
- Calm visual depth
- Refined medical-brand sections

The agent must preserve the same visual direction:

- Deep brown foundation
- Warm bronze highlights
- Soft flowing curves
- Subtle layered shapes
- Controlled contrast
- Premium and calm appearance
- No excessive decoration
- No random colors
- No neon effects
- No aggressive gradients
- No visual clutter

This image is a visual reference, not a requirement to copy the exact
composition into every section.

Use it selectively and only when the section benefits from a brown,
premium, abstract background.

Pages

Layouts

Components

Sections

Forms

Buttons

Navigation

Typography

Colors

Logos

design-system/
├── CLINIC_DESIGN_SYSTEM.md
└── visual-references/
    └── john-sevo-dental-clinic-primary-website-visual-reference.png

Icons

Images

Backgrounds

Spacing

Borders

Radius

Visual hierarchy

Responsive behavior

Visual assets

Any other user-facing interface

The agent MUST inspect and follow the relevant brand-guideline materials before creating or modifying any user-facing visual work.

3. No Third Source of Truth

The agent MUST NOT treat any of the following as a higher or equal authority to the two official sources:

Personal preference

Generic AI recommendations

Assumptions

Memory

Previous unrelated projects

External templates

Random examples

Unverified online patterns

Existing code that contradicts the constitution

Existing UI that contradicts the brand guidelines

A previous agent's decision without verification

A guessed architectural convention

A copied structure from another project

Existing code is evidence to inspect, not automatic authority.

Existing files must be respected only when they are consistent with the official project sources and the actual responsibility they own.

4. Mandatory Reading Order

Before starting any task, the agent MUST follow this order:

Step 1 — Read the Project Constitution

Read:

docs/CLINIC_PROJECT_CONSTITUTION.md

Identify every rule relevant to the requested task.

Do not rely only on the title, summary, table of contents, or a previous explanation.

The agent must inspect the actual relevant sections.

Step 2 — Read the Brand Guidelines When UI Is Involved

If the task affects anything visible to users, inspect:

brand-guidelines/

Read the relevant brand rules before making visual decisions.

Step 3 — Inspect the Existing Project

After reading the official sources, inspect the current project state.

The agent must determine:

What already exists

Which file owns the responsibility

Which implementation is authoritative

Which components can be reused

Which logic already exists

Whether the requested feature is already implemented

Whether the requested change affects other responsibilities

Whether the current implementation conflicts with the constitution

Whether the current implementation conflicts with the brand guidelines

Step 4 — Plan Before Changing

The agent MUST form a short implementation plan before editing.

The plan must identify:

The requested result

The relevant constitutional rules

The relevant brand rules, if applicable

The existing source of truth

The smallest correct change

Potential side effects

Required verification

Step 5 — Implement Only After Verification

The agent may modify the project only after the previous steps have been completed.

5. Constitution Has Priority Over Agent Preference

The agent MUST follow the constitution even when another approach appears:

More modern

More elegant

More scalable

More abstract

More familiar

More sophisticated

Easier to generate

Common in other projects

The agent must not replace a documented project decision with a personal architectural preference.

If the constitution already defines the responsibility, ownership, flow, or restriction, the agent must follow it.

6. Brand Guidelines Have Priority Over Visual Preference

For user-facing work, the brand guidelines take precedence over the agent's personal design preference.

The agent MUST NOT invent or introduce:

Alternative colors

Unapproved fonts

Different typography

New logo treatments

Unapproved logo variations

Arbitrary spacing systems

Unapproved button styles

Unapproved icon styles

Unapproved visual patterns

Inconsistent image treatment

A different design language

The agent must reuse existing approved visual patterns and tokens whenever they are available.

Brand consistency is a project requirement, not an optional design preference.

7. No Guessing

The agent MUST NOT guess when information is missing, unclear, conflicting, or not verified.

The agent must not invent:

Requirements

Business rules

Database fields

API behavior

User roles

Permissions

Data relationships

File ownership

Architectural layers

UI patterns

Brand values

Content

Production data

Error behavior

Deployment behavior

When a decision cannot be verified from the official sources or the inspected project, the agent must clearly identify the uncertainty and request clarification when necessary.

8. Protect the Existing Architecture

The agent MUST NOT change the architectural shape of the project without a verified reason.

Before introducing a new layer, abstraction, service, hook, utility, repository, provider, adapter, store, event system, cache layer, or infrastructure mechanism, the agent must verify:

What real problem does it solve?

Is the responsibility already owned elsewhere?

Does an existing capability already solve the problem?

Is the new layer required by the constitution?

Does it reduce duplication?

Does it improve correctness or maintainability?

Is the additional complexity justified?

What existing behavior could it affect?

If the answer is not clearly justified, the agent MUST NOT create it.

The preferred solution is the simplest correct solution that satisfies the constitution and the actual requirement.

Simple does not mean careless.

Unnecessary complexity is not allowed.

9. No Duplicate Sources of Truth

The agent MUST preserve one authoritative owner for each responsibility.

The agent MUST NOT create parallel versions of:

Business logic

Data rules

Validation rules

Authentication

Authorization

Database access

API behavior

Configuration

Content

Brand tokens

UI patterns

Cache invalidation

Events

Media handling

SEO data

Production values

Before creating anything new, search for an existing implementation.

Reuse or extend the existing authoritative implementation when appropriate.

Do not duplicate logic merely to avoid inspecting the existing code.

10. No Unnecessary Files or Layers

The agent MUST NOT create files, folders, abstractions, or architectural layers merely because they are common in tutorials or appear architecturally sophisticated.

The agent must not automatically create additional layers for:

DTOs

Mappers

Services

Use cases

Controllers

Managers

Factories

Providers

Repositories

Hooks

Stores

Adapters

Event buses

Cache abstractions

Authentication systems

Session systems

API wrappers

Such structures may be created only when the constitution and the inspected project establish a real responsibility that requires them.

A file is justified by responsibility, not by convention.

11. Inspect Before Creating

Before creating a new file or component, the agent MUST:

Search for related files

Search for related functionality

Identify the current owner

Check for reusable components

Check for existing types

Check for existing validation

Check for existing data-access paths

Check for existing hooks or integrations

Check the constitution

Check the brand guidelines when visual work is involved

Creating a new implementation without this inspection is prohibited.

12. Minimal and Targeted Changes

The agent must make the smallest correct change that fully satisfies the requirement.

The agent MUST NOT:

Rewrite unrelated files

Refactor unrelated architecture

Rename files without necessity

Move folders without necessity

Replace working systems without a verified reason

Change behavior outside the requested scope

Introduce broad abstractions for a local problem

Remove existing behavior without proving it is incorrect

Modify protected or unrelated systems casually

Every change must have a clear reason connected to the task.

13. UI and Visual Work

Before creating or modifying UI, the agent MUST:

Read the relevant constitutional rules.

Inspect the relevant brand-guideline materials.

Inspect existing UI patterns.

Reuse existing components and tokens when possible.

Preserve the established visual language.

Verify responsive behavior.

Verify typography and spacing.

Verify colors and contrast.

Verify logo and icon usage.

Verify that no arbitrary visual pattern was introduced.

The agent must not use invented marketing terminology, invented brand language, or unexplained visual concepts when the project already defines appropriate terminology.

14. Data, Security, and Privacy

The agent MUST treat all project data rules as mandatory.

The agent must not:

Use mock data as a substitute for real implementation

Hardcode production business data

Expose private client data

Trust client-side authorization

Bypass server-side validation

Bypass existing permission checks

Expose sensitive fields unnecessarily

Load unrestricted large datasets

Create arbitrary limits that hide real data

Weaken isolation for convenience

Introduce insecure shortcuts

Any data access must follow the authoritative data-access path defined by the constitution and verified in the project.

15. Error Handling

The agent MUST NOT hide real errors through silent fallbacks.

The agent must not:

Replace failures with fake successful values

Hide missing configuration

Swallow exceptions without justification

Convert invalid data into misleading defaults

Use mock content to conceal incomplete work

Suppress errors merely to make the interface appear functional

Errors must be handled according to the project's documented rules.

16. Verification Is Mandatory

No task is complete merely because code was written.

Before reporting completion, the agent MUST verify the result according to the task and the constitution.

Verification may include:

Type checking

Linting

Tests

Build verification

Route verification

Data-flow verification

Permission verification

Responsive UI inspection

Brand compliance inspection

Regression inspection

Relevant command execution

Review of affected files

The agent must never claim that a test, command, build, or verification was completed if it was not actually executed.

17. Handling Conflicts and Ambiguity

If the agent discovers a conflict between:

The constitution and existing code

The constitution and a proposed implementation

The brand guidelines and existing UI

Two project instructions

A requirement and an architectural restriction

the agent MUST NOT silently choose a personal solution.

The agent must:

Identify the conflict.

State the exact affected responsibility.

Explain the possible impact.

Avoid irreversible changes.

Request clarification or approval when required.

The agent must not resolve ambiguity by guessing.

18. Required Completion Report

At the end of every substantial task, the agent MUST report:

Source Review

Constitution sections reviewed

Brand-guideline materials reviewed, if applicable

Existing project areas inspected

Implementation

Files changed

Files created

Files deleted

Responsibilities affected

Existing logic reused

New logic introduced

Why the change was necessary

Architecture

Whether the architectural shape changed

Why the change was required

Which existing responsibilities remained unchanged

Whether any new abstraction was introduced

Why that abstraction was justified

Verification

Commands executed

Tests executed

Build or type-check results

UI or brand verification performed

Any unresolved issues

Uncertainty

Clearly distinguish between:

Facts verified in the project

Decisions made during implementation

Assumptions

Risks

Items requiring approval

19. Prohibited Agent Behavior

The following behavior is strictly prohibited:

Starting work without reading the constitution

Starting UI work without reviewing brand guidelines

Ignoring relevant constitutional rules

Treating memory as a source of truth

Guessing missing requirements

Creating duplicate sources of truth

Creating unnecessary architecture

Rebuilding capabilities already provided by the project foundation

Modifying unrelated systems

Using mock data to hide incomplete work

Hiding errors

Bypassing security or authorization

Inventing brand styles

Inventing business behavior

Claiming unperformed verification

Reporting success without checking the result

Making irreversible changes during uncertainty

Treating existing code as automatically correct

Treating a diagram or example as permission to violate an explicit rule

20. Final Non-Negotiable Contract

Before every task:

READ THE CONSTITUTION.
READ THE BRAND GUIDELINES WHEN UI IS INVOLVED.
INSPECT THE EXISTING PROJECT.
IDENTIFY THE AUTHORITATIVE OWNER.
SEARCH BEFORE CREATING.
REUSE BEFORE DUPLICATING.
PLAN BEFORE CHANGING.
MAKE THE SMALLEST CORRECT CHANGE.
PROTECT THE ARCHITECTURE.
VERIFY THE RESULT.
REPORT FACTS HONESTLY.

The project must be developed according to its official constitution and visual identity.

No agent may replace those sources with personal preference, assumptions, shortcuts, or external conventions.

The constitution defines what the project is and how it must operate.

The brand guidelines define how the project must look and feel.

Every implementation decision must respect both.

NO GUESSING.
NO DUPLICATION.
NO UNNECESSARY ARCHITECTURE.
NO UNAUTHORIZED CHANGE.
NO INVENTED BRAND LANGUAGE.
NO HIDDEN ERRORS.
NO UNVERIFIED CLAIMS.
NO VIOLATION OF THE OFFICIAL SOURCES.
END OF AGENT GOVERNANCE CONTRACT




========================

all rools and all info about the project and all rouls and all i want and all my requirements for the project
in the **docs/CLINIC_PROJECT_CONSTITUTION.md**

# Brand Identity & Visual Guidelines

## Mandatory Brand Compliance

The project's visual identity is defined in the `brand-guidelines/` directory.

**These guidelines are mandatory and must be followed for every user-facing interface, page, component, feature, and visual asset.**

Any new or modified UI must remain consistent with the established brand identity.

The brand identity includes, but is not limited to:

- Logo and logo usage
- Brand colors
- Color combinations
- Typography and fonts
- Font weights and hierarchy
- Spacing and visual rhythm
- Buttons and interactive elements
- Border radius and shapes
- Icons and icon style
- Images and visual treatment
- Overall visual style and design language

## Source of Truth

Before creating or modifying any user-facing UI, the agent **MUST inspect and follow the relevant files inside `brand-guidelines/`.**

The `brand-guidelines/` directory is the **single source of truth for the project's visual identity**.

Do not invent alternative brand colors, fonts, logo treatments, or visual styles when an approved brand rule already exists.

## Logo Rules

The approved logo assets and their usage rules are located in:

`brand-guidelines/logo/`

Use the provided logo assets whenever the logo is required.

Do not:

- Redesign the logo
- Change its proportions
- Distort or stretch it
- Apply unapproved colors
- Add unapproved effects
- Replace it with a different logo
- Create a new logo variation without explicit approval

## Color Rules

The approved brand colors are documented in:

`brand-guidelines/colors/`

Agents must use the defined brand color tokens/variables whenever applicable.

Do not introduce arbitrary colors simply because they look visually appealing.

If a new color is genuinely required for a functional purpose, such as accessibility, status feedback, error states, or system UI, it should remain visually compatible with the existing brand system.

## Typography Rules

The approved fonts, font weights, and typographic hierarchy are documented in:

`brand-guidelines/typography/`

Use the approved typography system consistently across the project.

Do not introduce a different font or typography style unless explicitly requested or approved.

## Design Consistency

New pages and components must feel like part of the same product.

When implementing a new feature:

1. Inspect the existing design system.
2. Check `brand-guidelines/`.
3. Reuse existing components and design tokens when available.
4. Follow the established colors, typography, spacing, and visual language.
5. Avoid creating unnecessary new visual patterns.

## Priority Rule

If a design decision conflicts with the documented brand guidelines, **the brand guidelines take precedence over the agent's personal design preference.**

Do not replace or reinterpret the established visual identity without explicit approval.

## Before Completing UI Work

Before considering a UI task complete, verify that:

- The correct logo is used.
- Approved colors are used.
- Approved fonts are used.
- Typography hierarchy is consistent.
- Existing components/design patterns are reused where possible.
- New visual elements do not conflict with the brand identity.
- No arbitrary colors, fonts, or logo variations were introduced.

**Brand consistency is a project requirement, not an optional design preference.**
```
