using DeliveryOrders.Data;
using DeliveryOrders.Models;
using DeliveryOrders.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryOrders.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _db;

    public OrderRepository(AppDbContext db)
    {
        _db = db;
    }


    public async Task AddAsync(Order order)
    {
        await _db.Orders.AddAsync(order);
    }


    public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
    {
        return await _db.Orders
            .FirstOrDefaultAsync(x => x.OrderNumber == orderNumber);
    }

    public async Task<String?> GetLastOrderNumberAsync(string prefix)
    {
        return await _db.Orders
                    .Where(o => o.OrderNumber.StartsWith(prefix))
                    .OrderByDescending(o => o.OrderNumber)
                    .Select(o => o.OrderNumber)
                    .FirstOrDefaultAsync();
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _db.Orders
            .AsNoTracking()
            .ToListAsync();
    }


    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}