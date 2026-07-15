using DeliveryOrders.DTOs;
using DeliveryOrders.Models;

namespace DeliveryOrders.Repositories.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order);             
    Task<Order?> GetByOrderNumberAsync(string orderNumber); 
    Task<(List<Order> Items, int TotalCount)> GetPagedAsync(OrderQueryRequest request);
    Task SaveChangesAsync();
}