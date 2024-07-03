import { Router } from 'express';
import * as inventoryController from '../controllers/inventoryController';

const router = Router();

router.post('/update-stock', inventoryController.updateStock);
router.post('/update-multiple-stocks', inventoryController.updateMultipleStocks);
router.post('/check-order-fulfillment', inventoryController.checkOrderFulfillment);
router.post('/get-lowest-cost', inventoryController.getLowestCost);

export default router;