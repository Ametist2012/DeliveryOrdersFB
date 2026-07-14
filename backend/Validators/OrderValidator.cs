using DeliveryOrders.DTOs;

namespace DeliveryOrders.Validators.Interfaces;

public class OrderValidator : IOrderValidator
{
    public Dictionary<string, List<string>> Validate( CreateOrderRequest request)
    {
        var errors = new Dictionary<string, List<string>>();

        ValidateSenderCity(request, errors);
        ValidateSenderAddress(request, errors);

        ValidateReceiverCity(request, errors);
        ValidateReceiverAddress(request, errors);

        ValidateCargoWeight(request, errors);
        ValidateCargoPickupDate(request, errors);

        return errors;
    }


    private static void ValidateSenderCity(CreateOrderRequest request, Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(request.SenderCity))
        {
            AddError(errors, nameof(request.SenderCity),
                    "The Sender's City field is required.");
            return;
        }

        if (request.SenderCity.Length < 2 || request.SenderCity.Length > 30)
        {
            AddError(errors, nameof(request.SenderCity),
                    "The Sender's City length must be between 2 and 30 characters");
        }
    }


    private static void ValidateSenderAddress(CreateOrderRequest request, Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(request.SenderAddress))
        {
            AddError(errors, nameof(request.SenderAddress),
                    "The Sender's Address field is required.");
            return;
        }

        if (request.SenderAddress.Length < 5 || request.SenderAddress.Length > 100)
        {
            AddError(errors, nameof(request.SenderAddress),
                    "The Sender's Address length must be between 5 and 100 characters");
        }
    }


    private static void ValidateReceiverCity(CreateOrderRequest request,Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(request.ReceiverCity))
        {
            AddError(errors, nameof(request.ReceiverCity),
                    "The Receiver's City field is required.");
            return;
        }

        if (request.ReceiverCity.Length < 2 || request.ReceiverCity.Length > 30)
        {
            AddError(errors, nameof(request.ReceiverCity),
                    "The Receiver's City length must be between 2 and 30 characters");
        }
    }


    private static void ValidateReceiverAddress(CreateOrderRequest request, Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(request.ReceiverAddress))
        {
            AddError(errors, nameof(request.ReceiverAddress),
                    "The Receiver's Address field is required.");
            return;
        }

        if (request.ReceiverAddress.Length < 5 || request.ReceiverAddress.Length > 100)
        {
            AddError(errors, nameof(request.ReceiverAddress),
                    "The Receiver's Address length must be between 5 and 100 characters");
        }
    }


    private static void ValidateCargoWeight(CreateOrderRequest request, Dictionary<string, List<string>> errors)
    {
        if (request.CargoWeight < 0.01m || request.CargoWeight > 100000m)
        {
            AddError(errors, nameof(request.CargoWeight),
                    "The Cargo's weight must be between 0.01 and 100000 kg");
            return;
        }

        if (decimal.Round(request.CargoWeight, 2) != request.CargoWeight)
        {
            AddError( errors, nameof(request.CargoWeight),
                    "The Cargo's weight cannot have more than 2 decimal places");
        }
    }


    private static void ValidateCargoPickupDate(CreateOrderRequest request, Dictionary<string, List<string>> errors)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (request.CargoPickupDate < today)
        {
            AddError(errors, nameof(request.CargoPickupDate),
                    "The Cargo's pickup date cannot be in the past");
        }
    }


    private static void AddError(Dictionary<string, List<string>> errors, string key, string message)
    {
        if (!errors.ContainsKey(key)) { errors[key] = []; }
        errors[key].Add(message);
    }
}