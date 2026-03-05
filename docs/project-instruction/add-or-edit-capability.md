# Add or Edit a Capability (Superpower) — Runbook

Use this document whenever you add a **new** capability or **edit** an existing one. It lists every file and step so nothing is missed.

---

## 1. Central ability definition

**File:** `src/data/abilities.js`

- **Add new:** Append an object to the `abilities` array with:
  - `id` — unique number (next after current max)
  - `slug` — URL segment, kebab-case (e.g. `calendar-management`). Used for route `/superpowers/:slug`
  - `title` — Hebrew display name (e.g. `'ניהול יומן'`)
  - `description` — short Hebrew description
  - `image` — path to image, e.g. `'/photos/MyCapability.png'`
  - `conversationsFile` — filename **without** `.js` of the conversation examples file (e.g. `'my-capability'` → loads `conversations/my-capability.js`)

- **Edit:** Update the same object (slug, title, description, image, or conversationsFile).

---

## 2. Picture / image asset

- **Location:** `public/photos/`
- **Add:** Place the capability image in `public/photos/` (e.g. `MyCapability.png`).
- **Reference:** Use that path in `abilities.js` as `image: '/photos/MyCapability.png'`.
- **Note:** Home gallery and Superpowers grid both use `ability.image` from `abilities.js`; no extra references needed for the image once it’s in abilities.

---

## 3. Detail page (link and content)

- **Route:** `/superpowers/:slug` — defined in `App.jsx`. No change needed when adding a capability.
- **Page component:** `src/pages/AbilityDetail.jsx` — loads ability by slug and loads conversations by `ability.conversationsFile`. No change needed if the ability is in `abilities.js` and has `conversationsFile`.
- **Link to detail:** Any link to the capability page is ` /superpowers/<slug> ` (e.g. `/superpowers/calendar-management`). Used in:
  - `AbilityCard` — navigates to `/superpowers/${ability.slug}`
  - `Gallery` (Home) — navigates to `/superpowers/${image.slug}` when an image has `slug`

So: **ensure the ability has a correct `slug` in `abilities.js`**; the link is automatic.

---

## 4. Example use cases (conversation examples)

- **File:** `src/data/conversations/<conversationsFile>.js`  
  `<conversationsFile>` must match the `conversationsFile` field in `abilities.js` (no `.js` in the field).

- **Create new file:** e.g. `src/data/conversations/my-capability.js`
- **Export:** a single named export: `export const conversations = [ ... ]`
- **Shape of each item:**
  - `id` — number
  - `heading` — Hebrew title for the example
  - `subheading` — short Hebrew subtitle
  - **Either** single exchange: `userMessage`, `donnaResponse`, `timestamp`
  - **Or** multi-turn: `exchanges` — array of `{ userMessage, donnaResponse, timestamp }` (same topic in one “phone” with multiple user/agent turns)
  - In `donnaResponse` use `\n` for newlines and `**text**` for bold

- **Edit:** Change or add items in the same file; ensure the file name still matches `conversationsFile` in `abilities.js`.

**Reference:** `AbilityDetail.jsx` loads conversations with:
`import(\`../data/conversations/${abilityData.conversationsFile}.js\`)`

---

## 5. Main page (Home) — gallery

- **File:** `src/pages/Home.jsx`
- **Logic:** Gallery uses `getAllAbilities()` and maps to `{ id, src: ability.image, title: ability.title, slug: ability.slug }`.
- **Action:** None. Adding (or updating) the ability in `src/data/abilities.js` automatically adds/updates it in the Home gallery.

---

## 6. Superpowers page — grid of abilities

- **File:** `src/pages/Superpowers.jsx`
- **Logic:** Uses `getAllAbilities()` and renders each with `AbilityCard`.
- **Action:** None. Adding/editing in `abilities.js` is enough.

---

## 7. Pricing — short brief and which plan

Two places in **`src/pages/Pricing.jsx`**:

### 7.1 Pricing cards (feature bullets per plan)

- **Where:** `plans.monthly` and `plans.annual` — each plan has a `features` array (Hebrew strings).
- **Action:** Add a short feature line for the new capability to the correct plan(s):
  - **בסיסי** (Basic)
  - **מקצועי** (Pro)
  - **עסקי** (Business)
- Add the same line to both `monthly` and `annual` for that plan so the text stays in sync.

### 7.2 Feature comparison table

- **Where:** `comparisonRows` array in `Pricing.jsx`.
- **Shape:** `{ feature: 'יכולת בשפה עברית', basic: true|false|string, pro: true|false|string, business: true|false|string }`
  - `true` = ✓, `false` = —, `string` = shown as-is (e.g. limits).
- **Action:** Append one row for the new capability and set `basic`, `pro`, `business` according to which plan(s) include it.

---

## 8. Optional: “Coming soon” badge

- **File:** `src/components/AbilityCard/AbilityCard.jsx`
- **When:** Only if this capability should show a “בקרוב” (coming soon) badge.
- **Action:** Add the ability’s `slug` to the condition, e.g.  
  `(ability.slug === 'emails' || ability.slug === 'google-workspace' || ability.slug === 'my-capability')`

---

## Checklist (quick reference)

When **adding** a capability:

- [ ] Add image under `public/photos/` and reference it in `abilities.js` as `image: '/photos/...'`
- [ ] Add/update the ability in `src/data/abilities.js` (id, slug, title, description, image, conversationsFile)
- [ ] Create `src/data/conversations/<conversationsFile>.js` with `export const conversations = [ ... ]` (correct shape)
- [ ] Add feature line(s) to the right plan(s) in `src/pages/Pricing.jsx` (`plans.monthly` and `plans.annual`)
- [ ] Add one row to `comparisonRows` in `src/pages/Pricing.jsx` (basic, pro, business)
- [ ] If “coming soon”: add slug to the condition in `src/components/AbilityCard/AbilityCard.jsx`

When **editing** a capability:

- [ ] Update `src/data/abilities.js` (and image path/asset if needed)
- [ ] Update or add examples in `src/data/conversations/<conversationsFile>.js` if needed
- [ ] Update pricing feature text and/or comparison row in `src/pages/Pricing.jsx` if the capability’s name or plan changed
- [ ] Add/remove “coming soon” in `AbilityCard.jsx` if needed

No code changes are required in: `App.jsx`, `AbilityDetail.jsx`, `Home.jsx`, `Superpowers.jsx`, or `Gallery.jsx` when only adding/editing data and pricing.
