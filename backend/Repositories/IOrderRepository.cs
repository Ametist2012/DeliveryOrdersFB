using DeliveryOrders.Models;

namespace DeliveryOrders.Repositories;

public interface IOrderRepository
{
    Task AddAsync(Order order);             
    Task<Order?> GetByOrderNumberAsync(string orderNumber); 
    Task<String?> GetLastOrderNumberAsync(string prefix);
    Task<List<Order>> GetAllAsync();
    Task SaveChangesAsync();
}