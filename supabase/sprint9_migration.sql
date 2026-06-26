-- Lifemaxx Sprint 9 migration — paste into Supabase SQL Editor and run once.
-- Equipped cosmetics: lets purchased store items be visually equipped onto
-- the avatar, one item per equip slot at a time.

alter table owned_items add column if not exists equipped boolean not null default false;

-- store_items.category was seeded as a duplicate of the tier label
-- ("Basic Fits", "Gear", ...), which the Store screen never actually reads
-- for grouping (it groups by required_prestige). Repurpose it into a real
-- equip slot so "one item per category equipped at a time" is meaningful —
-- multiple items can now compete for the same body slot (e.g. Classic Tank
-- Top vs. Pro Singlet vs. Signature Hoodie all occupy "Top").
update store_items set category = case name
  when 'Classic Tank Top' then 'Top'
  when 'Pro Singlet' then 'Top'
  when 'Signature Hoodie' then 'Top'
  when 'Training Shorts' then 'Bottom'
  when 'Gym Socks' then 'Feet'
  when 'Lifting Belt' then 'Waist'
  when 'Golden Championship Belt' then 'Waist'
  when 'Wrist Wraps' then 'Wrists'
  when 'Chalk Bag' then 'Accessory'
  when 'Carbon Knee Sleeves' then 'Legs'
  when 'Diamond Avatar Aura' then 'Aura'
  when 'Legacy Trophy Case' then 'Display'
  else category
end
where name in (
  'Classic Tank Top', 'Pro Singlet', 'Signature Hoodie', 'Training Shorts', 'Gym Socks',
  'Lifting Belt', 'Golden Championship Belt', 'Wrist Wraps', 'Chalk Bag',
  'Carbon Knee Sleeves', 'Diamond Avatar Aura', 'Legacy Trophy Case'
);
