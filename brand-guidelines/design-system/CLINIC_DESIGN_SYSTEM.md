# JOHN SEVO DENTAL CLINIC

# CLINIC DESIGN SYSTEM

Version: 1.0
Status: Active
Authority: Mandatory Design Reference

---

## 1. Purpose

This document defines the visual language, interface style, layout behavior,
component appearance, spacing, motion, animation, and interaction principles
for the John Sevo Dental Clinic website.

It exists to ensure that every page, section, component, interaction,
transition, and visual decision feels like part of one coherent product.

This document must be followed by every developer, designer, AI agent,
and automated coding agent working on the project.

The goal is to create a dental clinic experience that is:

- Elegant
- Calm
- Premium
- Modern
- Minimal
- Trustworthy
- Human
- Comfortable
- Visually refined
- Easy to use

The design must feel intentional and polished without becoming excessive,
decorative, noisy, or visually complicated.

---

## 2. Authority and Source of Truth

The following sources must always be consulted before making design decisions:

1. `docs/CLINIC_PROJECT_CONSTITUTION.md`
2. `brand-guidelines/`
3. `design-system/CLINIC_DESIGN_SYSTEM.md`

The project constitution has the highest authority for project rules,
architecture, content, structure, data, APIs, security, deployment,
and implementation constraints.

The `brand-guidelines/` directory is the source of truth for the official
brand identity, including colors, logos, typography, and visual identity assets.

This document defines how the approved identity should be applied to the
website interface.

No developer or AI agent may invent a new visual identity, introduce unrelated
colors, replace approved typography, or create a competing design language.

If a conflict exists:

1. The project constitution has priority.
2. Official brand guidelines have priority over personal visual preference.
3. This design system controls the application of the visual identity.
4. Ambiguity must be reported before implementation.

---

## 3. Core Design Direction

The website must use one consistent visual mode.

The design is not a traditional light theme and not a traditional dark theme.

It is a natural, balanced, editorial-style clinic interface that uses a
controlled combination of light, soft, and brand-colored surfaces.

The page should not look like every section has a white background.

Instead, sections should alternate naturally between approved surfaces,
such as:

- Light neutral surfaces
- Soft brand-tinted surfaces
- Muted background surfaces
- Controlled darker or deeper brand surfaces
- Image-led sections
- White content surfaces when necessary

The result must feel balanced and calm.

The interface should have visual rhythm without becoming repetitive.

The design should feel like a premium medical brand, not a generic SaaS dashboard,
template website, gaming interface, or colorful marketing landing page.

---

## 4. Visual Personality

The visual personality must be:

- Calm rather than loud
- Premium rather than luxurious in an exaggerated way
- Minimal rather than empty
- Warm rather than sterile
- Modern rather than futuristic
- Refined rather than decorative
- Human rather than mechanical
- Confident rather than aggressive
- Clear rather than crowded

The design should communicate:

- Trust
- Care
- Precision
- Comfort
- Professionalism
- Medical expertise
- Personal attention

Avoid visual decisions that create:

- Noise
- Excessive contrast
- Excessive decoration
- Unnecessary gradients
- Too many colors
- Overly sharp edges
- Aggressive animations
- Generic template appearance
- Excessive glassmorphism
- Excessive shadows
- Excessive rounded shapes
- Unnecessary visual effects

---

## 5. Color Usage

Use only the colors defined in `brand-guidelines/`.

Do not invent additional brand colors.

Do not introduce random colors for decoration.

The interface must use a restrained color system.

Color should be used with purpose:

- Primary brand color for important actions and identity
- Secondary brand colors for controlled variation
- Neutral colors for structure and readability
- Soft brand tints for section backgrounds
- Stronger brand surfaces only when they improve hierarchy
- Semantic colors only when required for status or feedback

The design must not become colorful for the sake of being colorful.

Avoid:

- Rainbow palettes
- Multiple unrelated accent colors
- Bright neon colors
- Excessive gradients
- Random colored cards
- Different accent colors for every section
- Using color where spacing or typography would be enough

Color hierarchy must remain simple and recognizable.

A section may use a brand-colored background, but the next section should
not automatically use another strong color.

Use contrast and rhythm, not constant color changes.

---

## 6. Surface and Section System

The page must use a controlled surface rhythm.

Sections should not all use the same white background.

Recommended surface types:

1. Primary light surface
2. Soft neutral surface
3. Soft brand-tinted surface
4. Deep brand surface
5. Image-based surface
6. Content surface

The selected surfaces must come from the official brand identity.

Each section must have a clear visual purpose.

A section background should help communicate:

- Separation
- Hierarchy
- Content importance
- Emotional tone
- Reading comfort
- Visual rhythm

Do not change the background color without a reason.

Do not use a different background for every small component.

Do not create visual noise through excessive surface variation.

The overall page must feel connected and continuous.

---

## 7. Layout Principles

Layouts must be:

- Clean
- Balanced
- Spacious
- Responsive
- Easy to scan
- Visually stable
- Consistent across pages

Use a clear content container and consistent horizontal alignment.

Sections must share common alignment rules.

Avoid:

- Random container widths
- Unbalanced columns
- Inconsistent left and right edges
- Excessive empty space without purpose
- Overcrowded sections
- Too many visual elements competing for attention
- Arbitrary positioning
- Unnecessary absolute positioning

Every layout decision must support content hierarchy and usability.

The design must work on:

- Desktop
- Tablet
- Mobile

Mobile is not an afterthought.

On smaller screens:

- Columns must stack naturally
- Text must remain readable
- Buttons must remain usable
- Images must remain balanced
- Spacing must reduce proportionally
- Content must not overflow
- Animations must remain subtle
- Important actions must remain easy to find

---

## 8. Spacing

Spacing must be consistent and intentional.

Use a small and predictable spacing scale.

Prefer consistency over individual pixel decisions.

Spacing should communicate:

- Grouping
- Separation
- Hierarchy
- Importance
- Reading rhythm

Use tighter spacing inside related components.

Use larger spacing between unrelated sections.

Do not use large empty spaces only to make a page appear premium.

Do not compress content only to fit more elements on the screen.

The design should feel spacious but not wasteful.

---

## 9. Border Radius

Sharp corners should generally be avoided.

Components must use subtle and controlled rounding.

The preferred style is:

- Soft
- Slightly rounded
- Refined
- Comfortable
- Not childish
- Not excessively pill-shaped

Use modest border radii for:

- Cards
- Buttons
- Inputs
- Image containers
- Badges
- Panels
- Dialogs
- Navigation elements

Do not make every element extremely rounded.

Avoid excessive pill shapes unless the component is specifically intended
to behave like a pill, such as a compact status badge or filter.

Do not use sharp rectangular cards as the default visual language.

The rounding must remain consistent across the entire website.

---

## 10. Cards

Cards must be simple and purposeful.

A card should exist only when it helps group or explain content.

Cards should generally use:

- Subtle rounding
- Controlled padding
- Clear hierarchy
- Soft borders or restrained shadows
- Strong typography
- Enough breathing room

Avoid:

- Too many cards in one section
- Cards inside cards without a clear reason
- Heavy shadows
- Excessive borders
- Decorative card backgrounds
- Random card colors
- Overly rounded cards
- Cards that look like dashboard widgets

Cards should feel like calm content surfaces, not floating objects everywhere.

---

## 11. Shadows and Elevation

Shadows must be subtle.

Use elevation only when it helps communicate:

- Separation
- Layering
- Interaction
- Floating elements
- Dialogs
- Menus
- Important content surfaces

Avoid:

- Heavy drop shadows
- Large blurred shadows
- Multiple shadows on one element
- Glow effects
- Neon shadows
- Shadows used as decoration

In many cases, a soft border or surface contrast is preferable to a shadow.

---

## 12. Typography

Typography must follow the official files in `brand-guidelines/`.

Do not introduce additional fonts without explicit approval.

Typography must be:

- Clear
- Elegant
- Readable
- Calm
- Consistent
- Properly scaled

Use typography to create hierarchy instead of using excessive colors,
borders, or decorative effects.

The hierarchy should clearly distinguish:

- Page titles
- Section headings
- Subheadings
- Body text
- Supporting text
- Labels
- Buttons
- Metadata
- Error messages
- Helper text

Avoid:

- Too many font sizes
- Excessive font weights
- Long uppercase text
- Decorative typography
- Tight line-height
- Unreadably small text
- Large headings without a clear purpose

Headings may be expressive, but they must remain professional and readable.

---

## 13. Buttons

Buttons must be clear, calm, and purposeful.

Primary buttons should be visually recognizable without being aggressive.

Buttons should use:

- Subtle rounding
- Clear typography
- Comfortable padding
- Consistent height
- Consistent interaction states
- Strong readability

Avoid:

- Excessive gradients
- Huge buttons without purpose
- Too many primary buttons in one section
- Multiple competing call-to-actions
- Excessive animation
- Overly decorative button shapes

Every section should have a clear action hierarchy.

One primary action should normally be more prominent than secondary actions.

---

## 14. Forms and Inputs

Forms must feel safe, simple, and comfortable.

Inputs should use:

- Clear labels
- Comfortable height
- Subtle rounding
- Visible focus states
- Clear error states
- Consistent spacing
- Readable placeholder text

Do not rely only on placeholder text as a label.

Validation messages must be clear and human.

Avoid aggressive red styling or unnecessary visual alarm.

Error states should communicate the problem without making the interface feel hostile.

---

## 15. Images

Images must support the clinic's identity and content.

Use images with:

- Natural composition
- Appropriate cropping
- Consistent aspect ratios
- Good visual quality
- Calm presentation
- Proper alignment

Avoid:

- Random image styles
- Excessive image filters
- Overly dramatic effects
- Inconsistent image ratios
- Decorative images that do not support the content
- Excessive image overlays

Image containers should normally use subtle rounding consistent with the rest
of the design system.

---

## 16. Motion and Animation Philosophy

Motion is required, but it must remain restrained.

The website should feel alive, polished, and responsive without becoming a
festival of animations.

Animation must support:

- Understanding
- Feedback
- Continuity
- Hierarchy
- Focus
- Perceived quality

Animation must never compete with the content.

The correct feeling is:

"quietly polished"

Not:

"everything is moving"

Avoid:

- Constant floating elements
- Excessive parallax
- Large bouncing animations
- Repeated spinning
- Aggressive zoom effects
- Unnecessary page transitions
- Excessive staggered animations
- Animating every element independently
- Animation that delays access to content
- Decorative motion with no purpose

---

## 17. Animation Rules

Use a small and consistent motion language.

Preferred animation behavior:

- Gentle fade-in
- Small vertical reveal
- Soft scale from near-normal size
- Subtle hover movement
- Smooth color transition
- Soft image reveal
- Controlled section entrance
- Small elevation change on interaction

Animation should generally be:

- Short
- Smooth
- Predictable
- Natural
- Easy to ignore
- Consistent

Do not use different animation styles randomly across the website.

Do not combine multiple strong effects on one element.

For example, do not combine:

- Large movement
- Strong scale
- Rotation
- Blur
- Glow
- Color change

on the same component.

Choose one primary motion effect and, if necessary, one supporting effect.

---

## 18. Scroll Reveal

Scroll-based reveals may be used selectively.

They should be used for:

- Section introductions
- Important visual groups
- Image and text compositions
- Major content blocks

They should not be used for every line of text.

Avoid excessive staggered animation.

The user must never feel that the content is being withheld.

Important content must remain accessible even if animation is disabled.

Animations must not create layout jumps or unexpected movement.

---

## 19. Hover and Interaction States

Interactive elements must clearly respond to interaction.

Use subtle changes such as:

- Slight color shift
- Slight elevation change
- Small translation
- Border change
- Soft background change
- Underline or indicator
- Controlled opacity change

Avoid:

- Large movement
- Sudden scaling
- Excessive glow
- Rotation
- Flashing
- Strong bouncing
- Unpredictable effects

Hover states must never be the only way to understand an action.

All important interactions must also work with keyboard and touch.

---

## 20. Accessibility and Reduced Motion

The interface must respect accessibility requirements.

Motion must not create discomfort.

The implementation must support reduced-motion preferences.

When reduced motion is enabled:

- Remove unnecessary movement
- Reduce or disable decorative animation
- Preserve content visibility
- Preserve functionality
- Avoid sudden transitions

Focus states must be visible.

Text contrast must be sufficient.

Interactive elements must be usable with keyboard and touch.

Animations must never interfere with reading, navigation, or form completion.

---

## 21. Page Rhythm

A page should have a clear visual rhythm.

A typical page may move between:

- Introductory surface
- Content surface
- Brand-tinted section
- Image-led section
- Neutral information section
- Strong call-to-action section

This is only a visual rhythm principle, not a fixed page template.

Do not force every page to use the same section order.

The rhythm must respond to the content and user journey.

The page should not look like a collection of unrelated blocks.

---

## 22. Responsive Behavior

The design must remain coherent at all screen sizes.

Responsive behavior must preserve:

- Hierarchy
- Readability
- Spacing
- Button usability
- Image quality
- Content order
- Visual calmness

On mobile:

- Avoid horizontal overflow
- Avoid tiny controls
- Avoid excessive side padding
- Avoid overly tall hero sections
- Avoid animations that feel slow
- Avoid content hidden behind hover-only behavior
- Avoid dense multi-column layouts

Responsive changes should feel intentional, not like a broken desktop layout.

---

## 23. Component Consistency

Every reusable component must follow the same design language.

This includes:

- Buttons
- Cards
- Inputs
- Selects
- Modals
- Navigation
- Tabs
- Accordions
- Alerts
- Badges
- Image containers
- Section headers
- Footers
- Loading states
- Empty states
- Error states

A component must not introduce its own unrelated style.

Do not create one-off visual styles without a clear reason.

If a new pattern is needed, it must be evaluated against this design system
before being introduced.

---

## 24. Loading, Empty, and Error States

Loading states must be calm and informative.

Avoid excessive skeleton animations or distracting loaders.

Empty states must be clear and helpful.

Error states must be:

- Human
- Specific
- Readable
- Actionable
- Visually restrained

Do not use dramatic error screens for ordinary validation problems.

The visual language of error and success states must remain consistent with
the overall clinic experience.

---

## 25. Prohibited Visual Behavior

The following are not allowed without explicit approval:

- Random colors
- Unapproved fonts
- Excessive gradients
- Excessive glassmorphism
- Excessive shadows
- Sharp default card corners
- Excessive pill-shaped elements
- Excessive animations
- Animating every section
- Animating every word
- Large bouncing elements
- Neon effects
- Glow effects used as decoration
- Random parallax
- Excessive blur
- Overly futuristic interfaces
- Gaming-style interactions
- Dashboard-like visual clutter
- Unrelated design trends
- Decorative effects that reduce usability
- Visual patterns copied from unrelated products

---

## 26. Implementation Rules for AI Agents

Before creating or modifying any UI, the AI agent must:

1. Read `docs/CLINIC_PROJECT_CONSTITUTION.md`.
2. Consult the relevant files in `brand-guidelines/`.
3. Read this design system.
4. Inspect the existing implementation.
5. Identify the applicable design rules.
6. Avoid creating a new visual pattern if an existing pattern can be reused.
7. Keep the change minimal and targeted.
8. Preserve the established design language.
9. Verify responsive behavior.
10. Verify hover, focus, active, loading, empty, and error states where relevant.
11. Verify reduced-motion behavior where animation is introduced.
12. Report any ambiguity before making a major visual decision.

The AI agent must not rely on personal taste.

The AI agent must not introduce visual changes merely because they look trendy.

The AI agent must not redesign unrelated parts of the product while working
on one component.

The AI agent must not create visual inconsistency between pages.

---

## 27. Design Decision Standard

Every visual decision should answer at least one of the following questions:

- Does it improve clarity?
- Does it improve hierarchy?
- Does it improve trust?
- Does it improve usability?
- Does it support the clinic identity?
- Does it improve visual rhythm?
- Does it make the interface calmer?
- Does it improve the user journey?

If the answer is no, the decision should not be introduced.

---

## 28. Final Design Principle

The final interface must feel:

Elegant, calm, minimal, warm, premium, and human.

It must use the brand identity without becoming overloaded with color.

It must use motion without becoming noisy.

It must use rounded surfaces without becoming childish.

It must use visual variation without becoming inconsistent.

It must feel designed, not decorated.

The highest standard is:

Simple enough to feel effortless.
Refined enough to feel premium.
Clear enough to feel trustworthy.
Warm enough to feel human.
Consistent enough to feel like one product.

This design system is mandatory for all future interface work.النتيجة البصرية التي نريدها

الفكرة الأساسية هي:

Minimal Premium Medical Design — Calm, Warm, Refined, and Quietly Animated

يعني:

ليس كل شيء أبيض.

ليس كل section بلون قوي.

لا يوجد مهرجان ألوان.

لا يوجد كل شيء دائري بشكل مبالغ فيه.

لا توجد كروت كثيرة بلا داعٍ.

لا توجد animation على كل عنصر.

يوجد تنويع هادئ بين الخلفيات.

يوجد rounded بسيط ومتناسق.

يوجد animation ناعم يشعر المستخدم بجودة التصميم دون أن يشتت انتباهه.

وأهم جملة في الملف هي:

It must feel designed, not decorated.

أي:

يجب أن يبدو الموقع مصممًا بعناية، وليس مزينًا بالمؤثرات.
