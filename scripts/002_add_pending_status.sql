-- Add 'pending' status to newsletter_subscribers
alter table newsletter_subscribers 
  drop constraint if exists newsletter_subscribers_status_check;

alter table newsletter_subscribers 
  add constraint newsletter_subscribers_status_check 
  check (status in ('active', 'pending', 'unsubscribed'));
