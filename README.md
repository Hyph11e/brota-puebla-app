# Brota Puebla

Brota Puebla is a premium plant gifting app for iOS, Android, and web. It helps people choose, personalize, and send living gifts through a polished mobile-first experience with editorial product photography, premium wrapping, personalized notes, scheduled delivery windows, and simple care guidance.

## Product Overview

Brota is designed as a modern consumer gifting brand. The app focuses on visual discovery, emotional gifting, and a calm checkout experience.

- `Tienda`: editorial plant catalog with premium product cards.
- `Regalar`: occasion-based gift builder with bundle, plant, note, recipient, and delivery zone selection.
- `Track`: branded order status with preparation steps, scheduled delivery window, and delivery confirmation.
- `Brota UI`: warm visual system, realistic plant photography, refined cards, comfortable mobile navigation, and gift-oriented microcopy.

## Features

- Premium plant catalog with care difficulty, light, watering, and pet-safety guidance.
- Gift bundles for birthdays, romantic gestures, new apartments, easy-care starters, and signature moments.
- Personalized message flow for thoughtful gifting.
- Scheduled delivery windows instead of live GPS tracking.
- Branded order status experience from confirmation to delivery.
- Mobile-first layout with floating navigation and compact cart CTA.

## Stack

- Expo SDK 55
- React Native 0.83
- React 19.2
- Expo Router
- TypeScript
- Expo Image

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run web
```

Other useful commands:

```bash
npm run ios
npm run android
npm run serve:web
```

## Web Build

Create a static web export:

```bash
npx expo export --platform web
```

Serve the exported build:

```bash
npm run serve:web
```

## Project Structure

- `src/app`: Expo Router screens for store, gift flow, tracking, and app layout.
- `src/components`: shared UI components, tabs, themed primitives, and Brota visual components.
- `src/data`: app catalog content, gift bundles, and delivery-zone display data.
- `src/state`: local order state used by the in-app gift flow.
- `assets/images`: brand, hero, tab, and plant photography assets.

## Quality Checks

Run lint:

```bash
npm run lint
```

Run TypeScript:

```bash
npx tsc --noEmit
```

Create a production web export:

```bash
npx expo export --platform web
```
