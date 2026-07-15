using DeliveryOrders.DTOs;
using DeliveryOrders.Models;

namespace DeliveryOrders.Repositories.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order);             
    Task<Order?> GetByOrderNumberAsync(string orderNumber); 
    Task<List<Order>> GetAllAsync(OrderQueryRequest request);
    Task SaveChangesAsync();
}