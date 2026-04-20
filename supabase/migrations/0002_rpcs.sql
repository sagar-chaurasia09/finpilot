-- RPCs used by the app

create or replace function increment_credits(uid text, days int)
returns void language sql security definer as $$
  update users set credits = credits + days where id = uid;
$$;

create or replace function referral_leaderboard()
returns table(id text, name text, total int)
language sql stable as $$
  select u.id, u.name, count(r.*)::int as total
  from users u
  left join referrals r on r.referrer_id = u.id and r.status = 'converted'
  group by u.id, u.name
  order by total desc;
$$;
