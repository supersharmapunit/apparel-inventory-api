import { InventoryService } from '../src/services/inventoryService';
import { InventoryUpdate, Order } from '../src/models/Apparel';

describe('InventoryService', () => {
  let inventoryService: InventoryService;

  beforeEach(() => {
    inventoryService = new InventoryService(false);
  });

  test('updateStock should update existing apparel', async () => {
    const update: InventoryUpdate = { code: 'A001', size: 'M', quantity: 10, price: 20 };
    await inventoryService.updateStock(update);
    const canFulfill = await inventoryService.canFulfillOrder({ items: [{ code: 'A001', size: 'M', quantity: 5 }] });
    expect(canFulfill).toBe(true);
  });

  test('updateMultipleStocks should update multiple apparel items', async () => {
    const updates: InventoryUpdate[] = [
      { code: 'A001', size: 'M', quantity: 10, price: 20 },
      { code: 'A002', size: 'L', quantity: 5, price: 25 },
    ];
    await inventoryService.updateMultipleStocks(updates);
    const canFulfill = await inventoryService.canFulfillOrder({
      items: [
        { code: 'A001', size: 'M', quantity: 5 },
        { code: 'A002', size: 'L', quantity: 3 },
      ],
    });
    expect(canFulfill).toBe(true);
  });

  test('canFulfillOrder should return false for unavailable items', async () => {
    const update: InventoryUpdate = { code: 'A001', size: 'M', quantity: 10, price: 20 };
    await inventoryService.updateStock(update);
    const canFulfill = await inventoryService.canFulfillOrder({ items: [{ code: 'A001', size: 'L', quantity: 5 }] });
    expect(canFulfill).toBe(false);
  });

  test('getLowestCost should calculate correct cost for available order', async () => {
    const updates: InventoryUpdate[] = [
      { code: 'A001', size: 'M', quantity: 10, price: 20 },
      { code: 'A002', size: 'L', quantity: 5, price: 25 },
    ];
    await inventoryService.updateMultipleStocks(updates);
    const order: Order = {
      items: [
        { code: 'A001', size: 'M', quantity: 2 },
        { code: 'A002', size: 'L', quantity: 1 },
      ],
    };
    const lowestCost = await inventoryService.getLowestCost(order);
    expect(lowestCost).toBe(65); // (2 * 20) + (1 * 25) = 65
  });

  test('getLowestCost should return null for unfulfillable order', async () => {
    const update: InventoryUpdate = { code: 'A001', size: 'M', quantity: 10, price: 20 };
    await inventoryService.updateStock(update);
    const order: Order = {
      items: [
        { code: 'A001', size: 'M', quantity: 15 },
      ],
    };
    const lowestCost = await inventoryService.getLowestCost(order);
    expect(lowestCost).toBeNull();
  });

  // Add this test to verify the inventory state
  test('inventory should be correctly updated', async () => {
    const updates: InventoryUpdate[] = [
      { code: 'A001', size: 'M', quantity: 10, price: 20 },
      { code: 'A002', size: 'L', quantity: 5, price: 25 },
    ];
    await inventoryService.updateMultipleStocks(updates);
    const inventory = inventoryService.getInventory();
    expect(inventory).toHaveLength(2);
    expect(inventory[0]).toEqual({
      code: 'A001',
      sizes: { M: { quantity: 10, price: 20 } }
    });
    expect(inventory[1]).toEqual({
      code: 'A002',
      sizes: { L: { quantity: 5, price: 25 } }
    });
  });
});