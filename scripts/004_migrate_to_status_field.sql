-- Migration: Convert is_active boolean to status text field
-- This handles the case where the table was created with is_active instead of status

-- Step 1: Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'status'
  ) THEN
    ALTER TABLE newsletter_subscribers 
    ADD COLUMN status text NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('active', 'pending', 'unsubscribed'));
  END IF;
END $$;

-- Step 2: Migrate data from is_active to status if is_active exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'is_active'
  ) THEN
    -- Update status based on is_active and unsubscribed_at
    UPDATE newsletter_subscribers 
    SET status = CASE 
      WHEN is_active = true THEN 'active'
      WHEN unsubscribed_at IS NOT NULL THEN 'unsubscribed'
      ELSE 'pending'
    END;
    
    -- Drop the old is_active column
    ALTER TABLE newsletter_subscribers DROP COLUMN is_active;
  END IF;
END $$;

-- Step 3: Ensure the status constraint is correct
ALTER TABLE newsletter_subscribers 
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_status_check;

ALTER TABLE newsletter_subscribers 
  ADD CONSTRAINT newsletter_subscribers_status_check 
  CHECK (status IN ('active', 'pending', 'unsubscribed'));
