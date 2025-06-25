# Deploying to Vercel

## Prerequisites
- Node.js and npm installed
- Angular CLI installed
- Vercel account (https://vercel.com/signup)
- Git installed

## Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build your Angular project**
   ```bash
   ng build --prod
   ```

3. **Initialize Git if not already done**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. **Login to Vercel**
   ```bash
   vercel login
   ```
   - Open the provided URL in your browser
   - Sign in with your GitHub account
   - Authorize Vercel

5. **Deploy to Vercel**
   ```bash
   vercel
   ```
   - Select your project directory
   - Choose your preferred Git repository
   - Select your project name
   - Confirm the deployment

6. **After deployment**
   - Vercel will provide you with a deployment URL
   - Your application will be live at this URL
   - Example: https://your-project-name.vercel.app

## Additional Configuration

1. **Environment Variables**
   - Create a `.env` file in your project root
   - Add any required environment variables
   - These will be automatically picked up by Vercel

2. **Custom Domain**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add your custom domain
   - Update DNS records as instructed

## Troubleshooting

1. **Build Errors**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are correctly installed
   - Verify environment variables are set

2. **Deployment Issues**
   - Check the deployment status in Vercel dashboard
   - Review the deployment logs
   - Verify Git repository permissions

## Best Practices

1. **Version Control**
   - Always commit your changes before deployment
   - Use descriptive commit messages
   - Keep your code organized

2. **Testing**
   - Test your application locally before deployment
   - Use Vercel's preview deployments for testing
   - Monitor your application after deployment

3. **Security**
   - Never commit sensitive information
   - Use environment variables for sensitive data
   - Regularly update dependencies

## Support

For more information, visit:
- Vercel Documentation: https://vercel.com/docs
- Angular Documentation: https://angular.io/docs
- GitHub Repository: https://github.com/A7me2d/Chess.game.git
