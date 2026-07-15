using DeliveryOrders.Enums;

namespace DeliveryOrders.DTOs;

public class OrderQueryRequest
{
    public OrderSortField SortBy { get; set; } = OrderSortField.CreatedAt;
    public SortDirection Direction { get; set; } = SortDirection.Desc;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}