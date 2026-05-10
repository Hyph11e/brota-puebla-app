# Brota Puebla

App iOS, Android y web para vender y regalar plantas en Puebla con entrega programada de marca Brota.

## Producto

Brota combina tienda, regalo y tracking:

- `Tienda`: catalogo de plantas comunes y faciles de abastecer en Puebla/Atlixco.
- `Regalar`: builder de ocasion, mensaje, paquete, planta y checkout express.
- `Track`: estado de pedido con fecha, ventana programada, equipo Brota, notas y confirmacion de entrega.
- `Ops`: panel fundador con costos, precios, margen bruto, lote piloto y abastecimiento.

## Stack

- Expo SDK 55
- React Native 0.83
- React 19.2
- Expo Router
- TypeScript

## Comandos

```bash
npm install
npm run web
npm run ios
npm run android
npm run serve:web
npm run lint
npx tsc --noEmit
npx expo export --platform web
```

## Build web local

El export estatico queda en `dist`.

```bash
npx expo export --platform web
npm run serve:web
```

## Modelo de catalogo

Los datos viven en `src/data/catalog.ts`. Cada planta incluye:

- costo estimado de adquisicion
- costo de envoltura negra premium, tarjeta y guia QR
- reserva de entrega
- precio al cliente
- margen bruto antes de entrega y margen neto posterior a reserva
- dificultad de cuidado, luz, riego, pet friendliness, disponibilidad, riesgo operativo y linea de regalo

La estrategia de lanzamiento usa plantas de alta rotacion y bajo riesgo logistico como Palo de Brasil, Arbol de la abundancia, Suculenta conchita, Janet Craig compacta, Aloe vera, Pinanona 8, Liston y Sansevierias mix, con premium SKUs como Monstera pinanona, Palma areca, Bromelia, Xanadu, Orquideas y Ave de paraiso. El panel `Ops` deja visible el calculo para operar el negocio, pero esa informacion no deberia mostrarse a clientes en produccion.

## Fuentes de mercado consultadas

- Viveros de Atlixco/Cabrera con plantas desde $15 MXN y variedad de sombra, interior, cuna de Moises, alcatraces, cactaceas y gerberas: https://municipiospuebla.mx/nota/de-paseo/los-viveros-de-atlixco-una-belleza-que-debes-conocer
- Produccion durante todo el año en Cabrera, Atlixco: https://www.lajornadadeoriente.com.mx/puebla/atlixco-cabrera-produccion-plantas-nochebuenas-cempasuchil/
- Expo SDK 55 y versiones base: https://docs.expo.dev/versions/v55.0.0
