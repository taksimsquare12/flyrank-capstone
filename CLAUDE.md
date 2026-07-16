# Claude Code Rules

## Project Development Rules

1.  **Form Implementations:** All form inputs must be strictly controlled using libraries like `react-hook-form`. Uncontrolled inputs or manual state-binding without strict schemas are forbidden.
2.  **Input Validation:** Form fields must always have validation schemas or strict verification logic defined. Usernames must be alphanumeric (min 3 chars) and emails must pass regex validation checks before submission.
3.  **Testing Requirements:** Every newly added component or feature must include a corresponding `.test.jsx` verification file asserting both success states and standard validation edge cases.