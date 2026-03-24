-- Email templates table
CREATE TABLE IF NOT EXISTS newsletter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE
);

-- Email campaigns table (for tracking sent newsletters)
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  total_opens INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0
);

-- Email analytics table (track individual opens/clicks)
CREATE TABLE IF NOT EXISTS newsletter_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  campaign_id UUID REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('open', 'click')),
  url TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_campaign ON newsletter_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_analytics_subscriber ON newsletter_analytics(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON newsletter_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON newsletter_campaigns(created_at DESC);

-- Update trigger for templates
DROP TRIGGER IF EXISTS newsletter_templates_updated_at ON newsletter_templates;
CREATE TRIGGER newsletter_templates_updated_at
  BEFORE UPDATE ON newsletter_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
