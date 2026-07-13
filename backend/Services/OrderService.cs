using DeliveryOrders.Models;
using DeliveryOrders.Repositories;
using DeliveryOrders.DTOs;

namespace DeliveryOrders.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;

    public OrderService(IOrderRepository repository)
    {
        _repository = repository;
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
            CreatedAt = DateTime.UtcNow,
            OrderNumber = await GenerateOrderNumberAsync(),
            SenderCity = Normalize(request.SenderCity),
            SenderAddress = Normalize(request.SenderAddress),
            ReceiverCity = Normalize(request.ReceiverCity),
            ReceiverAddress = Normalize(request.ReceiverAddress),
            CargoWeight = request.CargoWeight,
            CargoPickupDate = request.CargoPickupDate
        };
       
        await _repository.AddAsync(order);
        await _repository.SaveChangesAsync();

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


    public async Task<List<OrderResponse>> GetAllAsync()
    {
        var orders = await _repository.GetAllAsync();
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
        var prefix = $"DLV-{DateTime.UtcNow:yyyyMMdd}-";

        var lastOrderNumber = await _repository.GetLastOrderNumberAsync(prefix);
        var nextNumber = 1;

        if (!string.IsNullOrEmpty(lastOrderNumber))
        {
            var lastSequence = lastOrderNumber[prefix.Length..];
            nextNumber = int.Parse(lastSequence) + 1;
        }

        return $"DLV-{DateTime.UtcNow:yyyyMMdd}-{nextNumber:D6}";
    }
}