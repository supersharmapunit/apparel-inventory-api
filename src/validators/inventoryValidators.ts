import Joi from 'joi';
import { InventoryUpdate, Order } from '../models/Apparel';

export const inventoryUpdateSchema = Joi.object<InventoryUpdate>({
  code: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
});

export const orderSchema = Joi.object<Order>({
  items: Joi.array().items(
    Joi.object({
      code: Joi.string().required(),
      size: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
});