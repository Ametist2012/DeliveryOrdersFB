using DeliveryOrders.DTOs;

namespace DeliveryOrders.Validators.Interfaces;

public interface IOrderValidator
{
    Dictionary<string, List<string>> Validate(CreateOrderRequest request);
}