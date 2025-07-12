# Troubleshooting Guide

## Common Issues and Solutions

### 1. Server Won't Start

**Problem**: `pnpm dev` doesn't start or shows errors

**Solutions**:
```bash
# Try different package managers
npm run dev
# or
yarn dev

# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev

# Check port availability
lsof -ti:3000
lsof -ti:3001
```

### 2. Port Already in Use

**Problem**: Port 3000 or 3001 is already in use

**Solutions**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
npx next dev -p 3002
```

### 3. Build Errors

**Problem**: TypeScript or ESLint errors during build

**Solutions**:
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Fix ESLint issues
npx eslint . --fix

# Skip linting during build (temporary)
npm run build --skip-lint
```

### 4. Authentication Issues

**Problem**: Login/Register not working

**Check**:
- Browser console for JavaScript errors
- Network tab for API call failures
- Make sure AuthContext is properly wrapped

### 5. Database Connection Issues

**Problem**: Supabase connection fails

**Check**:
- Environment variables in `.env.local`
- Supabase project URL and keys
- Database schema is set up correctly

### 6. Styling Issues

**Problem**: Tailwind CSS not working

**Solutions**:
```bash
# Restart development server
pnpm dev

# Check Tailwind config
npx tailwindcss --init
```

### 7. Module Not Found Errors

**Problem**: Import errors or module resolution

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Debug Steps

1. **Check Browser Console** (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Check Terminal Output**
   - Look for compilation errors
   - Check for missing dependencies

3. **Verify Environment**
   - Node.js version (18+)
   - Package manager working
   - All dependencies installed

4. **Test Basic Functionality**
   - Can you access localhost:3000?
   - Do basic pages load?
   - Is navigation working?

## Getting Help

If none of these solutions work:

1. **Share the exact error message**
2. **Include browser console output**
3. **Mention which page/feature is failing**
4. **Include your environment details**:
   - Operating system
   - Node.js version
   - Package manager version

## Emergency Reset

If everything fails, try a complete reset:

```bash
# Backup your work first!
git add -A
git commit -m "Backup before reset"

# Complete reset
rm -rf node_modules .next
npm cache clean --force
npm install
npm run dev
```