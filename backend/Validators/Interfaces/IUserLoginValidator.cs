using DeliveryOrders.DTOs.Auth;

namespace DeliveryOrders.Validators.Interfaces;

public interface IUserLoginValidator
{
    Dictionary<string, List<string>> Validate(LoginRequest request);
}