import React, { createContext, useContext, useMemo, useState } from 'react';

import { bundles, catalog, deliveryZones } from '@/data/catalog';

const defaultPlantId = 'pothos-jade';
const defaultBundleId = getBundleIdForPlant(defaultPlantId);
const defaultZoneName = deliveryZones[1]?.name ?? deliveryZones[0].name;

export type OrderStatus = 'confirmed' | 'preparing' | 'outForDelivery' | 'delivered';

export type OrderState = {
  cartPlantIds: string[];
  plantId: string;
  bundleId: string;
  recipient: string;
  note: string;
  zoneName: string;
  deliveryDate: string;
  deliveryWindow: string;
  deliveryNotes: string;
  brotaLeadName: string;
  orderId: string;
  status: OrderStatus;
};

type OrderContextValue = {
  order: OrderState;
  toggleCartPlant: (plantId: string) => void;
  startCheckout: () => void;
  selectPlant: (plantId: string) => void;
  selectBundle: (bundleId: string) => void;
  updateGiftDetails: (
    updates: Partial<Pick<OrderState, 'recipient' | 'note' | 'zoneName' | 'deliveryNotes'>>,
  ) => void;
  submitOrder: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

const initialOrder: OrderState = {
  cartPlantIds: [defaultPlantId],
  plantId: defaultPlantId,
  bundleId: defaultBundleId,
  recipient: 'Ana, La Paz',
  note: 'Gracias por estar. Te mando algo vivo porque lo mereces.',
  zoneName: defaultZoneName,
  deliveryDate: 'Sabado 16 de mayo',
  deliveryWindow: deliveryZones[1]?.deliveryWindow ?? deliveryZones[0].deliveryWindow,
  deliveryNotes: 'Entregar en recepcion y mandar foto de confirmacion.',
  brotaLeadName: 'Luis M.',
  orderId: 'BR-0427',
  status: 'confirmed',
};

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<OrderState>(initialOrder);

  const value = useMemo<OrderContextValue>(
    () => ({
      order,
      toggleCartPlant(plantId) {
        setOrder((current) => {
          const wasInCart = current.cartPlantIds.includes(plantId);
          const cartPlantIds = wasInCart
            ? current.cartPlantIds.filter((item) => item !== plantId)
            : [...current.cartPlantIds, plantId];
          const nextPlantId = wasInCart
            ? plantId === current.plantId
              ? cartPlantIds[0] ?? current.plantId
              : current.plantId
            : plantId;

          return {
            ...current,
            cartPlantIds,
            plantId: nextPlantId,
            bundleId: bundleIncludesPlant(current.bundleId, nextPlantId)
              ? current.bundleId
              : getBundleIdForPlant(nextPlantId),
          };
        });
      },
      startCheckout() {
        setOrder((current) => {
          const plantId = current.cartPlantIds.includes(current.plantId)
            ? current.plantId
            : current.cartPlantIds[0] ?? current.plantId;

          return {
            ...current,
            plantId,
            bundleId: bundleIncludesPlant(current.bundleId, plantId)
              ? current.bundleId
              : getBundleIdForPlant(plantId),
          };
        });
      },
      selectPlant(plantId) {
        setOrder((current) => ({
          ...current,
          plantId,
          cartPlantIds: current.cartPlantIds.includes(plantId)
            ? current.cartPlantIds
            : [plantId, ...current.cartPlantIds],
        }));
      },
      selectBundle(bundleId) {
        setOrder((current) => {
          const bundle = getBundleById(bundleId);
          const plantId = bundle.plantIds.includes(current.plantId)
            ? current.plantId
            : bundle.plantIds[0];

          return {
            ...current,
            bundleId,
            plantId,
            cartPlantIds: current.cartPlantIds.includes(plantId)
              ? current.cartPlantIds
              : [plantId, ...current.cartPlantIds],
          };
        });
      },
      updateGiftDetails(updates) {
        setOrder((current) => {
          const zone = updates.zoneName
            ? deliveryZones.find((item) => item.name === updates.zoneName)
            : undefined;

          return {
            ...current,
            ...updates,
            deliveryWindow: zone?.deliveryWindow ?? current.deliveryWindow,
          };
        });
      },
      submitOrder() {
        setOrder((current) => ({
          ...current,
          orderId: current.orderId.startsWith('BR-') ? current.orderId : 'BR-0427',
          status: 'preparing',
        }));
      },
    }),
    [order],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error('useOrder must be used inside OrderProvider');
  }

  return context;
}

export function getOrderDetails(order: OrderState) {
  const plant = catalog.find((item) => item.id === order.plantId) ?? catalog[0];
  const bundle = getBundleById(order.bundleId);
  const zone = deliveryZones.find((item) => item.name === order.zoneName) ?? deliveryZones[0];
  const total = plant.retailPrice + bundle.addOnPrice + zone.fee;

  return {
    plant,
    bundle,
    zone,
    total,
    deliveryWindow: order.deliveryWindow || zone.deliveryWindow,
  };
}

function getBundleById(bundleId: string) {
  return bundles.find((item) => item.id === bundleId) ?? bundles[0];
}

function getBundleIdForPlant(plantId: string) {
  return bundles.find((item) => item.plantIds.includes(plantId))?.id ?? bundles[0].id;
}

function bundleIncludesPlant(bundleId: string, plantId: string) {
  return getBundleById(bundleId).plantIds.includes(plantId);
}
