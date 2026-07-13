using DeliveryOrders.DTOs;

namespace DeliveryOrders.Validators;

public interface IOrderValidator
{
    Dictionary<string, List<string>> Validate(CreateOrderRequest request);
}