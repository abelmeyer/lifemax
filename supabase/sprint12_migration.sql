-- Lifemaxx Sprint 12 migration — paste into Supabase SQL Editor and run once.
-- Store catalog expansion: 31 new cosmetics, and a new "Head" equip slot.
--
-- Art for each of these lives in src/components/avatar/cosmetics/art/, keyed
-- by the item's exact name. A name with no art falls back to the generic
-- per-slot placeholder, so this migration is safe to run before or after the
-- code deploy — the catalog is never broken by the two landing out of order.

insert into store_items (name, description, category, required_prestige, cost_aura, sort_order) values
  -- Head (new slot)
  ('Sweat Headband',        'Keeps it out of your eyes.',              'Head',      1,   45,  10),
  ('Knit Beanie',           'For cold-garage mornings.',               'Head',      1,   65,  11),
  ('Snapback Cap',          'Brim down, work up.',                     'Head',      1,   70,  12),
  ('Boxing Headgear',       'Padded and competition-legal.',           'Head',      5,  700,  13),
  ('Champion''s Crown',     'Worn only by the undisputed.',            'Head',     10, 2200,  14),

  -- Top
  ('Cutoff Tee',            'Sleeves optional. Sleeves gone.',         'Top',       1,   70,  20),
  ('Compression Long Sleeve','Second-skin fit, seams that breathe.',   'Top',       3,  260,  21),
  ('Team Windbreaker',      'Zip-up shell for warmups.',               'Top',       5,  720,  22),

  -- Bottom
  ('Mesh Shorts',           'Light, loose, breathable.',               'Bottom',    1,   55,  30),
  ('Compression Tights',    'Support through every rep.',              'Bottom',    3,  240,  31),
  ('Gold Trunks',           'Championship trunks, gold trim.',         'Bottom',   10, 1600,  32),

  -- Feet
  ('Running Shoes',         'Cushioned for the long stuff.',           'Feet',      1,   90,  40),
  ('Cross-Trainers',        'Flat, stable, does everything.',          'Feet',      3,  280,  41),
  ('Weightlifting Shoes',   'Raised heel, locked-in strap.',           'Feet',      5,  640,  42),
  ('Gold Signature Sneakers','Your name would fit on these.',          'Feet',     10, 1700,  43),

  -- Waist
  ('Powerlifting Belt',     'Thick suede, double prong.',              'Waist',     5,  620,  50),

  -- Wrists
  ('Sweatbands',            'Terry cloth, both wrists.',               'Wrists',    1,   45,  60),
  ('Lifting Straps',        'When your grip gives out first.',         'Wrists',    3,  190,  61),
  ('Fitness Watch',         'Tracks what you already know.',           'Wrists',    5,  760,  62),

  -- Legs
  ('Compression Sleeves',   'Calf support for long sessions.',         'Legs',      3,  230,  70),
  ('Titanium Knee Wraps',   'Wrapped tight for max-effort squats.',    'Legs',     10, 1400,  71),

  -- Accessory
  ('Gym Towel',             'Wipe down, be considerate.',              'Accessory', 1,   40,  80),
  ('Water Bottle',          'Hydration is a training variable.',       'Accessory', 1,   50,  81),
  ('Weighted Vest',         'Makes everything harder on purpose.',     'Accessory', 5,  800,  82),
  ('Championship Medal',    'Proof, worn around the neck.',            'Accessory',10, 1500,  83),

  -- Aura
  ('Ember Aura',            'A slow-burning heat.',                    'Aura',      3,  300,  90),
  ('Emerald Aura',          'Steady green light.',                     'Aura',      5,  850,  91),
  ('Void Aura',             'Light bends around you.',                 'Aura',     10, 2000,  92),

  -- Display
  ('Medal Rack',            'Somewhere to hang them.',                 'Display',   3,  320, 100),
  ('PR Board',              'Every best lift, in chalk.',              'Display',   5,  780, 101),
  ('Hall of Fame Plaque',   'Cast in bronze.',                         'Display',  10, 2400, 102)
on conflict (name) do update set
  description = excluded.description,
  category = excluded.category,
  required_prestige = excluded.required_prestige,
  cost_aura = excluded.cost_aura,
  sort_order = excluded.sort_order;
