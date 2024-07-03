import request from 'supertest';
import app from '../src/app';

describe('Inventory API', () => {
  it('should update stock', async () => {
    const res = await request(app)
      .post('/api/update-stock')
      .send({ code: 'A001', size: 'M', quantity: 10, price: 20 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Stock updated successfully');
  });

  it('should update multiple stocks', async () => {
    const res = await request(app)
      .post('/api/update-multiple-stocks')
      .send([
        { code: 'A001', size: 'M', quantity: 10, price: 20 },
        { code: 'A002', size: 'L', quantity: 5, price: 25 },
      ]);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Stocks updated successfully');
  });

  it('should check order fulfillment', async () => {
    await request(app)
      .post('/api/update-stock')
      .send({ code: 'A003', size: 'S', quantity: 15, price: 18 });

    const res = await request(app)
      .post('/api/check-order-fulfillment')
      .send({
        items: [
          { code: 'A003', size: 'S', quantity: 10 },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('canFulfill', true);
  });

  it('should get lowest cost for fulfillable order', async () => {
    await request(app)
      .post('/api/update-multiple-stocks')
      .send([
        { code: 'A004', size: 'M', quantity: 20, price: 15 },
        { code: 'A005', size: 'L', quantity: 10, price: 25 },
      ]);

    const res = await request(app)
      .post('/api/get-lowest-cost')
      .send({
        items: [
          { code: 'A004', size: 'M', quantity: 2 },
          { code: 'A005', size: 'L', quantity: 1 },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('lowestCost', 55); // (2 * 15) + (1 * 25) = 55
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/update-stock')
      .send({ code: 'A006', size: 'XL', quantity: -5, price: 30 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});