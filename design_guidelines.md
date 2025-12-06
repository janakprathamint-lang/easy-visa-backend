# Canada Study Visa Eligibility Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern immigration/education platforms like IDP Education and Study in Canada portals, emphasizing trust, professionalism, and Canadian identity while maintaining accessibility for international students.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Canadian Red: `0 74% 49%` (primary brand color)
- Pure White: `0 0% 100%` (backgrounds)
- Soft Gray: `0 0% 96%` (secondary backgrounds)

**Supporting Colors:**
- Success Green: `142 76% 36%` (eligibility status)
- Warning Red: `0 84% 60%` (ineligible status)
- Text Gray: `0 0% 20%` (primary text)
- Light Gray: `0 0% 60%` (secondary text)

### B. Typography
- **Primary Font**: Inter (clean, modern, highly legible)
- **Hierarchy**: 
  - Headlines: Bold 600-700 weight
  - Body text: Regular 400 weight
  - Labels: Medium 500 weight

### C. Layout System
**Tailwind Spacing**: Primary units of 4, 6, 8, 12, 16 for consistent rhythm
- Containers: `max-w-6xl mx-auto px-4`
- Card spacing: `p-8` for desktop, `p-6` for mobile
- Section gaps: `space-y-12` between major sections

### D. Component Library

**Navigation**:
- Glassmorphism navbar: blurred background with transparency
- Rounded pill shape with centered navigation links
- Logo positioned left, navigation centered

**Cards**:
- Rounded corners: `rounded-2xl`
- Soft shadows: `shadow-lg`
- White backgrounds with subtle borders
- Centered content alignment

**Buttons**:
- Primary: Canadian red background with white text
- Secondary: White background with red border
- Gradient effects: Red to lighter red on hover
- Rounded corners matching card style

**Form Elements**:
- Clean input fields with subtle borders
- Focus states with red accent
- Proper spacing and label hierarchy
- Progress indicators for multi-step forms

### E. Page-Specific Design Patterns

**Landing Page**:
- Hero section with large headline prominence
- Centered layout with clear CTA hierarchy
- Trust indicators subtly placed

**Form Pages**:
- Progress indication at top
- Single-column layout for clarity
- Grouped related fields visually
- Clear validation states

**Results Page**:
- Status prominently displayed with appropriate colors
- Visual hierarchy for score, strengths, weaknesses
- Clear next-step CTA

**Lead Capture**:
- Minimal form design focusing on completion
- Trust signals around data security
- OTP verification with clear instructions

## Responsive Behavior
- **Mobile**: Single column, full-width buttons, stacked navigation
- **Tablet**: Two-column grids where appropriate, comfortable touch targets
- **Desktop**: Multi-column layouts, hover states, spacious design

## Visual Enhancements
- Subtle animations on button interactions
- Smooth transitions between form steps
- Loading states for form submissions
- Canadian maple leaf subtle accent elements where appropriate

## Images
No large hero images required. Focus on:
- Clean iconography for eligibility criteria
- Flag elements or maple leaf accents
- Trust badges/certifications (small, subtle placement)
- Success/failure status icons in results

The design emphasizes trust, clarity, and Canadian identity while maintaining international accessibility and modern web standards.