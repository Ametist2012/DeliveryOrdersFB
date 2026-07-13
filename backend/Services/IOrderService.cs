using DeliveryOrders.Models;
using DeliveryOrders.DTOs;

namespace DeliveryOrders.Services;

public interface IOrderService
{
    Task<OrderResponse> CreateAsync(CreateOrderRequest request);
    Task<List<OrderResponse>> GetAllAsync();
}