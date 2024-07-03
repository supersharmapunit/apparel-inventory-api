import { Request, Response } from 'express';
import Joi from 'joi';
import { inventoryService } from '../services/inventoryService';
import { InventoryUpdate, Order } from '../models/Apparel';
import { inventoryUpdateSchema, orderSchema } from '../validators/inventoryValidators';

export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = inventoryUpdateSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const update: InventoryUpdate = value;
    await inventoryService.updateStock(update);
    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMultipleStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = Joi.array().items(inventoryUpdateSchema).validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const updates: InventoryUpdate[] = value;
    await inventoryService.updateMultipleStocks(updates);
    res.status(200).json({ message: 'Stocks updated successfully' });
  } catch (error) {
    console.error('Error updating multiple stocks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkOrderFulfillment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const order: Order = value;
    const canFulfill = await inventoryService.canFulfillOrder(order);
    res.status(200).json({ canFulfill });
  } catch (error) {
    console.error('Error checking order fulfillment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLowestCost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const order: Order = value;
    const lowestCost = await inventoryService.getLowestCost(order);
    if (lowestCost === null) {
      res.status(400).json({ error: 'Order cannot be fulfilled' });
    } else {
      res.status(200).json({ lowestCost });
    }
  } catch (error) {
    console.error('Error getting lowest cost:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};