import fs from 'fs/promises';
import path from 'path';
import { Apparel, InventoryUpdate, Order } from '../models/Apparel';

const DATA_FILE = path.join(__dirname, '../../data/inventory.json');

export class InventoryService {
  private inventory: Apparel[] = [];

  constructor(private useFileStorage: boolean = true) {
    if (this.useFileStorage) {
      this.loadInventory();
    }
  }

  private async loadInventory(): Promise<void> {
    try {
      await fs.access(DATA_FILE);
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      this.inventory = JSON.parse(data.trim() || '[]');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.saveInventory();
      } else {
        console.error('Error loading inventory:', error);
      }
      this.inventory = [];
    }
  }

  private async saveInventory(): Promise<void> {
    if (this.useFileStorage) {
      try {
        await fs.writeFile(DATA_FILE, JSON.stringify(this.inventory, null, 2));
      } catch (error) {
        console.error('Error saving inventory:', error);
      }
    }
  }

  async updateStock(update: InventoryUpdate): Promise<void> {
    const apparel = this.inventory.find(item => item.code === update.code);
    if (apparel) {
      if (!apparel.sizes[update.size]) {
        apparel.sizes[update.size] = { quantity: 0, price: 0 };
      }
      apparel.sizes[update.size].quantity = update.quantity;
      apparel.sizes[update.size].price = update.price;
    } else {
      this.inventory.push({
        code: update.code,
        sizes: {
          [update.size]: { quantity: update.quantity, price: update.price }
        }
      });
    }
    await this.saveInventory();
  }

  async updateMultipleStocks(updates: InventoryUpdate[]): Promise<void> {
    for (const update of updates) {
      await this.updateStock(update);
    }
  }

  async canFulfillOrder(order: Order): Promise<boolean> {
    for (const item of order.items) {
      const apparel = this.inventory.find(a => a.code === item.code);
      if (!apparel || !apparel.sizes[item.size] || apparel.sizes[item.size].quantity < item.quantity) {
        return false;
      }
    }
    return true;
  }

  async getLowestCost(order: Order): Promise<number | null> {
    if (!(await this.canFulfillOrder(order))) {
      return null;
    }

    let totalCost = 0;
    for (const item of order.items) {
      const apparel = this.inventory.find(a => a.code === item.code);
      if (apparel && apparel.sizes[item.size]) {
        totalCost += apparel.sizes[item.size].price * item.quantity;
      }
    }
    return totalCost;
  }

  getInventory(): Apparel[] {
    return this.inventory;
  }
}

export const inventoryService = new InventoryService();