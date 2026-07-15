using DeliveryOrders.DTOs;
using DeliveryOrders.Enums;
using DeliveryOrders.Validators.Interfaces;

namespace DeliveryOrders.Validators;

public class OrderQueryValidator : IOrderQueryValidator
{
    public Dictionary<string, List<string>> Validate(OrderQueryRequest request)
    {
        var errors = new Dictionary<string, List<string>>();

        ValidatePage(request, errors);
        ValidatePageSize(request, errors);
        ValidateSort(request, errors);
        ValidateDirection(request, errors);

        return errors;
    }


    private static void ValidatePage(
        OrderQueryRequest request,
        Dictionary<string, List<string>> errors)
    {
        if (request.Page < 1)
        {
            AddError(errors,
                nameof(request.Page),
                "Page must be greater than 0.");
        }
    }


    private static void ValidatePageSize(
        OrderQueryRequest request,
        Dictionary<string, List<string>> errors)
    {
        if (request.PageSize < 1 || request.PageSize > 100)
        {
            AddError(errors,
                nameof(request.PageSize),
                "Page size must be between 1 and 100.");
        }
    }


    private static void ValidateSort(
        OrderQueryRequest request,
        Dictionary<string, List<string>> errors)
    {
        if (!Enum.IsDefined(request.SortBy))
        {
            AddError(errors,
                nameof(request.SortBy),
                "Invalid sort field.");
        }
    }


    private static void ValidateDirection(
        OrderQueryRequest request,
        Dictionary<string, List<string>> errors)
    {
        if (!Enum.IsDefined(request.Direction))
        {
            AddError(errors,
                nameof(request.Direction),
                "Invalid sort direction.");
        }
    }


    private static void AddError(
        Dictionary<string, List<string>> errors,
        string key,
        string message)
    {
        if (!errors.ContainsKey(key)) { errors[key] = []; }
            errors[key].Add(message);
    }
}