namespace DeliveryOrders.Models;

public class Order
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string OrderNumber { get; set; } = null!;  //DLV-{YYYYMMDD}-000001 
    public DateTime CreatedAt { get; set; }
    public string SenderCity { get; set; } = null!;  
    public string SenderAddress { get; set; } = null!;
    public string ReceiverCity { get; set; } = null!;
    public string ReceiverAddress { get; set; } = null!;
    public decimal CargoWeight { get; set; }
    public DateOnly CargoPickupDate { get; set; }
}

