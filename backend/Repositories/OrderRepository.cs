using DeliveryOrders.Data;
using DeliveryOrders.Models;
using DeliveryOrders.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using DeliveryOrders.DTOs;
using DeliveryOrders.Enums;
using System.Linq.Expressions;

namespace DeliveryOrders.Repositories;

public class OrderRepository : IOrderRepository
{
    private static readonly Dictionary<
                            OrderSortField,
                            Expression<Func<Order, object>> 
                            > SortDictSortBy = new()
                            {
                                {OrderSortField.CreatedAt, x => x.CreatedAt},
                                {OrderSortField.OrderNumber, x=> x.OrderNumber},
                                {OrderSortField.SenderCity, x => x.SenderCity},
                                {OrderSortField.SenderAddress, x => x.SenderAddress},
                                {OrderSortField.ReceiverCity, x => x.ReceiverCity},
                                {OrderSortField.ReceiverAddress, x => x.ReceiverAddress},
                                {OrderSortField.CargoWeight, x => x.CargoWeight},
                                {OrderSortField.CargoPickupDate, x => x.CargoPickupDate}
                            };
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

    public async Task<(List<Order> Items, int TotalCount)> GetPagedAsync(OrderQueryRequest request)
    {
        IQueryable<Order> query = _db.Orders.Include(x => x.User);
        var totalCount = await query.CountAsync();
        query = ApplySorting(query, request);

        var items = await query.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

        return (items, totalCount);
    }


    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    private static IQueryable<Order> ApplySorting(IQueryable<Order> query, OrderQueryRequest request)
    {
        if (!SortDictSortBy.TryGetValue(request.SortBy, out var expression))
            { expression = x =>x.CreatedAt; }
        
        return request.Direction == SortDirection.Asc
                ? query.OrderBy(expression)
                : query.OrderByDescending(expression);
    }
}