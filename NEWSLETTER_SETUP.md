# Newsletter System Documentation

## Overview
Complete newsletter system with email confirmation, admin dashboard, templates, analytics, and subscriber management.

## Features
- ✅ Email subscription with double opt-in confirmation
- ✅ Unsubscribe functionality with confirmation
- ✅ Resubscribe support (clears unsubscribe date)
- ✅ Admin dashboard with stats and analytics
- ✅ Subscriber management (view, search, export to CSV)
- ✅ Email templates (create, edit, preview, reuse)
- ✅ Batch email sending (100 emails per batch)
- ✅ Email preview before sending
- ✅ Automatic unsubscribe links in all emails
- ✅ Password-protected admin area

## Setup Instructions

### 1. Database Setup (Supabase)

Run these SQL scripts in order in your Supabase SQL Editor:

**Script 1: Create subscribers table**
```sql
-- Run scripts/001_create_newsletter_subscribers.sql
```

**Script 2: Add pending status** (if needed)
```sql
-- Run scripts/002_add_pending_status.sql
```

**Script 3: Add templates and analytics tables**
```sql
-- Run scripts/003_add_templates_and_analytics.sql
```

**Script 4: Add missing columns** (if needed)
```sql
-- Add updated_at column if missing
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Disable RLS for testing (or set up proper policies)
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_analytics DISABLE ROW LEVEL SECURITY;
```

### 2. Environment Variables

Add these to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (for sending emails)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Dashboard
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### 3. Install Dependencies

```bash
npm install resend @supabase/ssr
```

### 4. Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. For testing, use `onboarding@resend.dev` as the from address
4. For production, verify your domain in Resend settings

## User-Facing Pages

### Newsletter Signup
- **Location**: Your main page (component: `components/newsletter-signup.tsx`)
- **Flow**: User enters name, email, preferences → Receives confirmation email → Clicks link → Subscribed

### Email Confirmation
- **URL**: `/newsletter/confirm?token=xxx`
- **Purpose**: Activates subscription after user clicks email link

### Unsubscribe
- **URL**: `/newsletter/unsubscribe?token=xxx`
- **Flow**: Shows confirmation → User clicks "Yes, Unsubscribe" → Unsubscribed

## Admin Pages

All admin pages require password authentication (default: "admin123").

### Main Dashboard
- **URL**: `/admin`
- **Features**:
  - Total subscribers count
  - Active subscribers count
  - Weekly growth
  - Total campaigns sent
  - Average open rate
  - Preference breakdown with visual charts
  - Quick links to other admin pages

### Send Newsletter
- **URL**: `/admin/newsletter`
- **Features**:
  - Load from saved templates
  - Compose subject and HTML content
  - Preview email before sending
  - Batch sending (100 emails at a time)
  - Automatic unsubscribe links
  - Success/failure reporting

### Subscriber Management
- **URL**: `/admin/subscribers`
- **Features**:
  - View all subscribers
  - Search by name or email
  - See status (Active/Unsubscribed)
  - View preferences
  - Export to CSV

### Email Templates
- **URL**: `/admin/templates`
- **Features**:
  - Create new templates
  - Edit existing templates
  - Preview templates
  - Delete templates
  - Reuse templates when sending newsletters

## Database Schema

### newsletter_subscribers
- `id` - UUID primary key
- `email` - Unique email address
- `first_name` - Subscriber's first name
- `preferences` - Array of selected preferences
- `is_active` - Boolean (true = active, false = unsubscribed)
- `token` - Unique token for confirm/unsubscribe links
- `source` - Where they signed up (e.g., "website")
- `subscribed_at` - When they subscribed
- `unsubscribed_at` - When they unsubscribed (null if active)

### newsletter_templates
- `id` - UUID primary key
- `name` - Template name
- `subject` - Default subject line
- `html_content` - HTML email content
- `is_default` - Boolean flag for default template

### newsletter_campaigns
- `id` - UUID primary key
- `subject` - Email subject
- `html_content` - Email content
- `sent_count` - Number of emails sent
- `total_opens` - Total opens tracked
- `total_clicks` - Total clicks tracked
- `created_at` - When campaign was sent

### newsletter_analytics
- `id` - UUID primary key
- `campaign_id` - Reference to campaign
- `subscriber_id` - Reference to subscriber
- `event_type` - 'open' or 'click'
- `url` - Clicked URL (for click events)
- `user_agent` - Browser info
- `ip_address` - IP address

## Email Flow

### New Subscription
1. User fills out form with name, email, preferences
2. Record created with `is_active: false`
3. Confirmation email sent with unique token
4. User clicks confirmation link
5. `is_active` set to `true`, `unsubscribed_at` cleared

### Resubscription
1. User who previously unsubscribed fills out form
2. Existing record updated with `is_active: false`
3. New token generated
4. Confirmation email sent
5. User clicks confirmation link
6. `is_active` set to `true`, `unsubscribed_at` cleared

### Unsubscribe
1. User clicks unsubscribe link in email
2. Confirmation page shown
3. User clicks "Yes, Unsubscribe"
4. `is_active` set to `false`, `unsubscribed_at` set to current time

## Security

- Admin pages protected by password
- All subscriber actions use unique tokens
- Tokens regenerated on resubscribe
- Honeypot field to catch bots
- Email validation on signup
- RLS can be enabled on Supabase tables for additional security

## Batch Sending

Newsletters are sent in batches of 100 using Resend's batch API:
- More efficient than one-by-one sending
- Reduces API calls
- Handles large subscriber lists
- Automatic retry on batch failure

## Future Enhancements

To add open/click tracking:
1. Add tracking pixel to emails (1x1 transparent image)
2. Create API route to handle pixel requests
3. Wrap links with tracking redirects
4. Log events to `newsletter_analytics` table

## Troubleshooting

**Emails not sending:**
- Check `RESEND_API_KEY` is set correctly
- Verify `RESEND_FROM_EMAIL` is valid
- Check terminal logs for errors
- Verify Resend dashboard for delivery status

**Confirmation links not working:**
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Check token exists in database
- Verify RLS policies allow updates

**Admin dashboard not loading:**
- Check password is correct
- Verify all SQL scripts have been run
- Check browser console for errors

**Subscribers not appearing:**
- Verify they clicked confirmation link
- Check `is_active` status in database
- Ensure RLS policies allow reads

## Support

For issues or questions, check:
- Supabase logs for database errors
- Browser console for frontend errors
- Terminal for server-side errors
- Resend dashboard for email delivery status
