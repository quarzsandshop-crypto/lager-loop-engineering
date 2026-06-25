# Lager Reglement

## Current Mode

`L1: observe/dry-run only`

Only fixture data, copied database data, and generated dry-run reports may be used. Real bookings are forbidden.

## Non-Negotiable Rules

- One DHL tracking number equals one sack and one carton.
- A tracking number may be processed once only.
- Every processed row must have a `cartonDecision`.
- Q2 material must be selected only by an explicit rule source:
  - `packaging_not_25kg_majority_stock`
  - `simple_marker_confirmed_by_photo`
  - `photo_transparent_plastic`
  - `photo_opaque_paper`
  - `no_bag_photo_majority_stock`
  - `known_fixed_material_mapping`
- Q1 is always plastic.
- Non-stock goods, shoes, and goods at or below 1 kg are ignored.
- DHL count must equal `processed + ignored + not_found`.
- Before any real booking could ever exist in a higher mode, a backup check must pass first.

## Forbidden In This Repository

- Real DHL login secrets.
- Real live database credentials.
- Any write to a live stock database.
- Any script that books stock outside dry-run fixtures.
- Any Q2 Papier/Plastik decision without a rule.

