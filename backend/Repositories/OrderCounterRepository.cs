using DeliveryOrders.Data;
using DeliveryOrders.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryOrders.Repositories;

public class OrderCounterRepository : IOrderCounterRepository
{
    private readonly AppDbContext _db;

    public OrderCounterRepository(AppDbContext db)
    {
        _db = db;
    }


    public async Task<int> GetNextNumberAsync(DateOnly date)
    {
        await using var command = _db.Database.GetDbConnection().CreateCommand();

        command.CommandText = """
            INSERT INTO "OrderCounters"
            (
                "Date",
                "LastNumber"
            )
            VALUES
            (
                @date,
                1
            )
            ON CONFLICT ("Date")
            DO UPDATE
            SET "LastNumber" = "OrderCounters"."LastNumber" + 1
            RETURNING "LastNumber";
            """;

        var parameter = command.CreateParameter();
        parameter.ParameterName = "@date";
        parameter.Value = date;

        command.Parameters.Add(parameter);


        if (command.Connection!.State != System.Data.ConnectionState.Open)
        {
            await command.Connection.OpenAsync();
        }

        var result = await command.ExecuteScalarAsync();
        
        return Convert.ToInt32(result);
    }
}