# Clean Code Rules

**Category:** Code Quality  
**Tags:** #clean-code #readability #maintainability

## Description

Guidelines for writing clean, maintainable code that's easy to read and understand.

## Rules

### Function Design
- Functions should do one thing and do it well
- Keep functions under 50 lines
- Use meaningful, descriptive names
- Maximum 3-4 parameters per function

### Code Organization
- Avoid deep nesting (max 3 levels)
- Group related code together
- Use early returns to reduce nesting
- Separate concerns into different modules

### Naming Conventions
- Use meaningful variable names (no single letters except loop counters)
- Boolean variables should ask a question (isValid, hasPermission)
- Function names should be verbs (getUserData, calculateTotal)
- Class names should be nouns (UserManager, DataProcessor)

### Code Cleanup
- No commented-out code in production
- Remove console.log/print statements before committing
- Delete unused imports and variables
- Remove dead code paths

## Examples

### Good Example
```javascript
function calculateOrderTotal(items, taxRate, discountCode) {
  const subtotal = calculateSubtotal(items);
  const discount = applyDiscount(subtotal, discountCode);
  const tax = calculateTax(discount, taxRate);
  return discount + tax;
}
```

### Bad Example
```javascript
function calc(i, t, d) {
  let s = 0;
  for(let x = 0; x < i.length; x++) {
    s += i[x].price * i[x].qty;
  }
  // Apply discount
  if(d) {
    if(d === 'SAVE10') {
      s = s * 0.9;
    }
  }
  return s + (s * t);
}
```

## Benefits
- Easier to understand and maintain
- Fewer bugs
- Faster code reviews
- Better team collaboration
