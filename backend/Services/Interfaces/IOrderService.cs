using DeliveryOrders.Models;
using DeliveryOrders.DTOs;


namespace DeliveryOrders.Services.Interfaces;

public interface IOrderService
{
    Task<OrderResponse> CreateAsync(CreateOrderRequest request);
    Task<PagedResponse<OrderResponse>> GetPagedSAsync(OrderQueryRequest request);
    Task<bool> DeleteAsync(string orderNumber);
}