# Brota Puebla

Brota Puebla is a premium plant gifting app for iOS, Android, and web. It turns plant delivery into an elegant gifting experience with curated products, personalized notes, premium wrapping, scheduled delivery windows, and simple care guidance.

## Product

Brota is designed as a modern consumer brand, not a traditional nursery. The app focuses on emotional gifting, visual product discovery, and a polished mobile-first flow.

- `Tienda`: editorial plant catalog with premium product cards.
- `Regalar`: occasion-based gift builder with bundle, plant, note, recipient, and delivery zone selection.
- `Estado`: order status with scheduled delivery window, preparation steps, and delivery confirmation.
- `Brota brand system`: custom visual language, plant illustrations, premium colors, and mobile-first interactions.

## Stack

- Expo SDK 55
- React Native 0.83
- React 19.2
- Expo Router
- TypeScript

## Getting Started

```bash
npm install
npm run web
```

Other useful commands:

```bash
npm run ios
npm run android
npm run serve:web
npm run lint
npx tsc --noEmit
npx expo export --platform web
```

## Local Web Build

The static web export is generated into `dist`.

```bash
npx expo export --platform web
npm run serve:web
```

## Experience Highlights

- Premium gifting flow with personalized messages.
- Scheduled delivery windows instead of live GPS tracking.
- Elegant product cards with care difficulty, light, watering, and pet-safety guidance.
- Gift-focused bundles for birthdays, romance, new apartments, easy-care starters, and signature moments.
- Empty and active order states for a cleaner customer experience.

## Project Structure

- `src/app`: Expo Router screens.
- `src/components/brota`: Brota UI primitives and shared visual components.
- `src/data/catalog.ts`: product catalog, bundles, and delivery zones.
- `src/state/order.tsx`: in-app order state for the prototype flow.
- `assets/images`: brand and hero imagery.

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
```
