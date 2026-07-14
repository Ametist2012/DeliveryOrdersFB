using DeliveryOrders.Data;
using DeliveryOrders.Models;
using DeliveryOrders.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryOrders.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }


    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
    }


    public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
    {
        return await _context.Orders
            .FirstOrDefaultAsync(x => x.OrderNumber == orderNumber);
    }

    public async Task<String?> GetLastOrderNumberAsync(string prefix)
    {
        return await _context.Orders
                    .Where(o => o.OrderNumber.StartsWith(prefix))
                    .OrderByDescending(o => o.OrderNumber)
                    .Select(o => o.OrderNumber)
                    .FirstOrDefaultAsync();
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _context.Orders
            .AsNoTracking()
            .ToListAsync();
    }


    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}