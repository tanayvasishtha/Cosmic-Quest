# Deployment Guide for Cosmic Quest

## Environment Variables Setup

### Required Environment Variables

- `PPLX_API_KEY`: Your Perplexity AI API key for the AI tutor functionality

### Local Development

1. Create a `.env.local` file in the root directory
2. Add your Perplexity API key:
   ```
   PPLX_API_KEY=your_actual_api_key_here
   ```

### Vercel Deployment

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to "Environment Variables"
4. Add the following variable:
   - **Name**: `PPLX_API_KEY`
   - **Value**: Your Perplexity API key
   - **Environments**: Production, Preview, Development

### Getting a Perplexity API Key

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for an account
3. Navigate to the API section
4. Generate a new API key
5. Copy the key for use in your environment variables

### Fallback Behavior

If the `PPLX_API_KEY` is not configured, the AI tutor will:
- Show a friendly message about service configuration
- Provide fallback responses from a built-in knowledge base
- Continue to function for basic astronomy questions

### Troubleshooting

#### API Error 500
- Check that `PPLX_API_KEY` is properly set in Vercel environment variables
- Ensure the API key is valid and has sufficient quota
- Check Vercel function logs for detailed error messages

#### CSP Violations
- The app includes proper Content Security Policy headers
- Make sure no inline JavaScript is being added
- Check that all external domains are properly whitelisted in CSP

### Deploy Command

```bash
vercel --prod
```

Make sure to set the environment variable before deploying. 