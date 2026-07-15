using DeliveryOrders.Models;
using DeliveryOrders.Repositories;
using DeliveryOrders.DTOs;
using DeliveryOrders.Repositories.Interfaces;
using DeliveryOrders.Services.Interfaces;
using System.Security.Claims;

namespace DeliveryOrders.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repOrder;
    private readonly IOrderCounterRepository _repCount;
    private readonly ICurrentUserService _servCrUs;

    public OrderService(IOrderRepository repOrder,
                        IOrderCounterRepository repCount,
                        ICurrentUserService servCrUs)
    {
        _repOrder = repOrder;
        _repCount = repCount;
        _servCrUs = servCrUs;
    }

    private string Normalize(string value)
    {
        return string.Join(" ", value.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries));
    }


    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = _servCrUs.UserId,
            CreatedAt = DateTime.UtcNow,
            OrderNumber = await GenerateOrderNumberAsync(),
            SenderCity = Normalize(request.SenderCity),
            SenderAddress = Normalize(request.SenderAddress),
            ReceiverCity = Normalize(request.ReceiverCity),
            ReceiverAddress = Normalize(request.ReceiverAddress),
            CargoWeight = request.CargoWeight,
            CargoPickupDate = request.CargoPickupDate
        };
       
        await _repOrder.AddAsync(order);
        await _repOrder.SaveChangesAsync();

        return new OrderResponse
        {
            OrderNumber = order.OrderNumber,
            SenderCity = order.SenderCity,
            SenderAddress = order.SenderAddress,
            ReceiverCity = order.ReceiverCity,
            ReceiverAddress = order.ReceiverAddress,
            CargoWeight = order.CargoWeight,
            CargoPickupDate = order.CargoPickupDate,
            CreatedAt = order.CreatedAt
        };
    }


    public async Task<List<OrderResponse>> GetAllSortSAsync(OrderQueryRequest request)
    {
        var orders = await _repOrder.GetAllSortAsync(request);
        return orders.Select(order => new OrderResponse
        {
            CreatedAt = order.CreatedAt, 
            OrderNumber = order.OrderNumber, 
            SenderCity = order.SenderCity,
            SenderAddress = order.SenderAddress,
            ReceiverCity = order.ReceiverCity,
            ReceiverAddress = order.ReceiverAddress,
            CargoWeight = order.CargoWeight,
            CargoPickupDate = order.CargoPickupDate
        }).ToList();
    }

    private async Task<string> GenerateOrderNumberAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var nextNumber = await _repCount.GetNextNumberAsync(today);
        
        return $"DLV-{today:yyyyMMdd}-{nextNumber:D6}";
    }
}