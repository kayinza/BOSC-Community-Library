# Contributing to BOSC Community Library

Thank you for your interest in contributing to the BOSC Community Library! This document provides comprehensive guidelines for external contributors to ensure high-quality, consistent contributions that align with our mission of supporting public sector transparency and community collaboration.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment Setup](#development-environment-setup)
3. [Contribution Workflow](#contribution-workflow)
4. [Code Standards](#code-standards)
5. [Testing Requirements](#testing-requirements)
6. [Documentation Guidelines](#documentation-guidelines)
7. [Public Sector Considerations](#public-sector-considerations)
8. [Review Process](#review-process)
9. [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js (version 18.x or higher)
- Git (version 2.20 or higher)
- A GitHub account
- Familiarity with our [Code of Conduct](CODE_OF_CONDUCT.md)

### First-Time Contributors

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/kayinza/BOSC-Community-Library.git
   cd BOSC-Community-Library
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/kayinza/BOSC-Community-Library.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Environment Setup

### Required Tools

- **Code Editor**: VS Code recommended with the following extensions:
  - ESLint
  - Prettier
  - GitLens
  - Accessibility Insights
- **Testing**: Jest and Testing Library
- **Linting**: ESLint with our custom configuration
- **Formatting**: Prettier with our style guide

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your local environment variables as needed

3. Run the development server:
   ```bash
   npm run dev
   ```

## Contribution Workflow

### 1. Issue Creation

Before starting work:

- **Search existing issues** to avoid duplicates
- **Create a new issue** using our templates for:
  - Bug reports
  - Feature requests
  - Documentation improvements
- **Wait for maintainer approval** before starting work on new features

### 2. Branch Strategy

- **Create feature branches** from `main`:
  ```bash
  git checkout main
  git pull upstream main
  git checkout -b feature/your-feature-name
  ```

- **Branch naming conventions**:
  - `feature/description` - New features
  - `fix/description` - Bug fixes
  - `docs/description` - Documentation updates
  - `refactor/description` - Code refactoring
  - `test/description` - Test improvements

### 3. Development Process

1. **Make atomic commits** with clear, descriptive messages
2. **Follow conventional commit format**:
   ```
   type(scope): description
   
   Longer description if needed
   
   Closes #123
   ```

3. **Commit message types**:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes
   - `refactor`: Code refactoring
   - `test`: Test additions or modifications
   - `chore`: Maintenance tasks

### 4. Pull Request Process

1. **Update your branch** with the latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run the full test suite**:
   ```bash
   npm run test:full
   npm run lint
   npm run type-check
   ```

3. **Create a pull request** using our template
4. **Ensure all checks pass** (CI/CD, tests, linting)
5. **Respond to review feedback** promptly

## Code Standards

### JavaScript/TypeScript Guidelines

- **Use TypeScript** for all new code
- **Follow ESLint configuration** strictly
- **Use functional programming** patterns where appropriate
- **Implement proper error handling** with try-catch blocks
- **Add JSDoc comments** for all public APIs

### Code Style

```typescript
// Good: Clear, typed function with documentation
/**
 * Validates user input for government forms
 * @param input - The user input to validate
 * @param schema - The validation schema
 * @returns Validation result with errors if any
 */
export const validateGovernmentForm = (
  input: FormData,
  schema: ValidationSchema
): ValidationResult => {
  try {
    // Implementation here
    return { isValid: true, errors: [] };
  } catch (error) {
    logger.error('Form validation failed', { error, input: sanitizeInput(input) });
    throw new ValidationError('Form validation failed');
  }
};
```

### Security Considerations

- **Never commit sensitive data** (API keys, passwords, etc.)
- **Sanitize all user inputs**
- **Use parameterized queries** for database operations
- **Implement proper authentication** and authorization
- **Follow OWASP security guidelines**

## Testing Requirements

### Test Coverage

- **Minimum 80% code coverage** for new features
- **100% coverage** for critical security functions
- **Unit tests** for all utility functions
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows

### Testing Standards

```typescript
// Example test structure
describe('validateGovernmentForm', () => {
  it('should validate correct form data', () => {
    const validInput = createMockFormData();
    const schema = getValidationSchema();
    
    const result = validateGovernmentForm(validInput, schema);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle accessibility requirements', () => {
    // Test accessibility compliance
  });

  it('should sanitize sensitive data in logs', () => {
    // Test data sanitization
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y

# Run security tests
npm run test:security
```

## Documentation Guidelines

### Code Documentation

- **Document all public APIs** with JSDoc
- **Include usage examples** in documentation
- **Explain complex algorithms** with inline comments
- **Document security considerations** for sensitive functions

### README Updates

When adding new features:

1. Update the feature list
2. Add usage examples
3. Update installation instructions if needed
4. Include any new dependencies

### API Documentation

- Use **OpenAPI/Swagger** for REST APIs
- Include **request/response examples**
- Document **error codes** and handling
- Specify **authentication requirements**

## Public Sector Considerations

### Accessibility Compliance

All contributions must meet **WCAG 2.1 AA standards**:

- **Semantic HTML** structure
- **Proper ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** compliance
- **Focus management**

### Security Requirements

For government and public sector use:

- **Data encryption** at rest and in transit
- **Audit logging** for all user actions
- **Role-based access control**
- **Input validation** and sanitization
- **Regular security updates**

### Transparency Features

- **Open data** export capabilities
- **Public API** documentation
- **Clear privacy policies**
- **Audit trail** functionality
- **Public dashboard** features

## Review Process

### Automated Checks

All PRs must pass:

- **Continuous Integration** tests
- **Code quality** checks (SonarQube)
- **Security scanning** (Snyk)
- **Accessibility testing** (axe-core)
- **Performance testing** (Lighthouse)

### Manual Review

Maintainers will review:

- **Code quality** and adherence to standards
- **Test coverage** and quality
- **Documentation** completeness
- **Security implications**
- **Public sector compliance**
- **Breaking changes** impact

### Review Timeline

- **Initial response**: Within 48 hours
- **Full review**: Within 1 week
- **Follow-up reviews**: Within 24 hours

## Community Guidelines

### Communication

- **Be respectful** and professional
- **Use inclusive language**
- **Provide constructive feedback**
- **Ask questions** when unclear
- **Share knowledge** with the community

### Getting Help

- **GitHub Discussions** for general questions
- **GitHub Issues** for bugs and feature requests
- **Discord/Slack** for real-time chat (if available)
- **Email** for sensitive matters

### Recognition

Contributors are recognized through:

- **Contributors file** updates
- **Release notes** mentions
- **Community highlights**
- **Maintainer nominations** for significant contributors

## License Agreement

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License). You also certify that you have the right to submit your contributions under this license.

## Questions?

If you have questions about contributing, please:

1. Check this document first
2. Search existing issues and discussions
3. Create a new discussion or issue
4. Contact the maintainers directly if needed

Thank you for contributing to the BOSC Community Library and supporting open source in the public sector!