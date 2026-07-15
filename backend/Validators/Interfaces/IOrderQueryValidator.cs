using DeliveryOrders.DTOs;

namespace DeliveryOrders.Validators.Interfaces;

public interface IOrderQueryValidator
{
    Dictionary<string, List<string>> Validate(OrderQueryRequest request);
}