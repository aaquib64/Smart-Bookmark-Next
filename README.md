Smart Bookmark – Next.js Project
A modern, full-stack web application built with Next.js and Supabase for authentication and data management. This project demonstrates user authentication, dynamic pages, and secure data handling.


Features
User authentication with Google OAuth via Supabase
Dynamic dashboard with server-side rendering
CRUD operations for user data (e.g., bookmarks)
Responsive and mobile-friendly UI
Secure data access with Row-Level Security (RLS) policies

Technologies Used
Frontend: Next.js, React, Tailwind CSS
Backend & Database: Supabase (PostgreSQL)
Authentication: Supabase Auth (Google OAuth)
Hosting/Deployment: Vercel

Installation
1- Clone the repository:
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject

2- Install dependencies:
   npm install
   or
   yarn install

3- Set up environment variables:
   Create a .env.local file in the root folder and add:
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4- Run the development server:
   npm run dev
   or
   yarn dev
   Open http://localhost:3000
   to view your app.
   
5- Deploy:
   Push to Vercel or Netlify and configure the same environment variables in your hosting dashboard.


Problems Faced & Solutions:
  While building this project, I ran into several challenges and learned how to solve them:

  Supabase Environment Variables Not Found
    Problem: Deployment failed with the error supabaseUrl is required.
    Solution: Added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and configured the same variables in Vercel/Netlify.

Google OAuth Login Not Working
    Problem: Users could not log in via Google OAuth.
    Solution: Configured the correct Client ID and Client Secret in Supabase → Authentication → Providers → Google and ensured the redirect URL matched Google          Cloud Console.

Prerendering Errors on Dashboard
    Problem: The dashboard page caused a prerendering error (Error occurred prerendering page "/dashboard") because it depended on dynamic user-specific data.
    Solution: Switched from getStaticProps to getServerSideProps for pages requiring dynamic data.

Database Table Already Exists
    Problem: SQL query to create the bookmarks table failed with relation "bookmarks" already exists.
    Solution: Used DROP TABLE IF EXISTS bookmarks; before creating the table or skipped creation if it already existed.

Row-Level Security (RLS) Policy Issues
    Problem: Users could not access their own bookmarks.
    Solution: Added a policy on the bookmarks table:
    Policy Name: Allow individual users
      Using Expression: user_id = auth.uid()
      This allowed each user to access only their own data securely.

These challenges helped me better understand Next.js environment variables, authentication with Supabase, server-side rendering, and secure database access.





