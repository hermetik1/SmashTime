# Cinematic homepage — 11 September 2026

The homepage now uses `cinematic-home.tsx` and `film.css`. Published CMS content supplies the next event, countdown, fightcard, athlete records, stories and partners. Existing detail routes and administration remain available. The event calendar download uses Vienna-aware start times and escaped, folded ICS output.

The header wordmark is the single hero logo. Its light geometry is a child of the same transformed link, so translation and scaling stay synchronized. Eight-sided cage outlines, corner braces and travelling red/gold highlights replace the earlier planetary orbits. The geometry fades before docking in the header; nothing remains behind in the hero. Three lightweight CSS smoke layers drift along the arena edges and fade with the scene. The animation runs continuously; the system reduced-motion preference remains respected.

The new hero arena bitmap was generated with ImageGen and exported as `public/assets/home/cinema/hero-arena-v2.webp`. It contains no embedded wordmark. Supporting arena/action imagery comes from existing project assets. Custom CMS hero images are preserved; the private update script replaces only the former default hero path and backs up the settings row first.

Verification: production build, lint, browser geometry comparison at initial/intermediate/docked positions, athlete next action, calendar success state, motion pause state. Live deployment uses a checksum-filtered production export; remote assets and private CMS settings are backed up before changes.
