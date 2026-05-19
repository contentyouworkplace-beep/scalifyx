-- Allow storing time in deadline, not just date
alter table crm_works alter column deadline type timestamptz using deadline::timestamptz;
