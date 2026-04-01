-- Run once after migration. Adjust relative dates as needed.

insert into public.market_events (ticker, title, event_type, event_date, why_it_matters, watch_for)
values
  (null, 'FOMC rate decision', 'macro', now() + interval '14 days',
   'Fed guidance sets expectations for borrowing costs and risk appetite across equities.',
   'Dot plot, press conference tone, and language on inflation vs. employment.'),
  (null, 'CPI (headline)', 'macro', now() + interval '10 days',
   'Inflation prints move rate-cut odds and hit rate-sensitive sectors first.',
   'Core vs. headline, shelter, and any revision to prior months.'),
  ('AAPL', 'Q2 earnings release', 'earnings', now() + interval '5 days',
   'Apple''s iPhone mix and services growth drive sentiment for mega-cap tech.',
   'Guidance, China revenue, and capital return updates.'),
  ('NVDA', 'GTC keynote / product updates', 'catalyst', now() + interval '7 days',
   'New chip and software announcements can reset AI demand narratives.',
   'Data center revenue commentary and roadmap hints for Blackwell rollout.');
