using DeliveryOrders.DTOs.Auth;

namespace DeliveryOrders.Validators;

public interface IAdminRegisterValidator
{
    Dictionary<string, List<string>> Validate(AdminRegisterRequest request);
}