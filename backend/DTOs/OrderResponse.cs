namespace DeliveryOrders.DTOs;

public class OrderResponse
{
    public DateTime CreatedAt { get; set; }
    public required string OrderNumber { get; set; }
    public required string SenderCity { get; set; }
    public required string SenderAddress { get; set; }
    public required string ReceiverCity { get; set; }
    public required string ReceiverAddress { get; set; }
    public decimal CargoWeight { get; set; }
    public DateOnly CargoPickupDate { get; set; }
}