import { useEffect, useState, useCallback } from "react";
import OrderList from "./OrderList";
import OrderForm from "./OrderForm";
import OrderDetail from "./OrderDetail";

import {
  getOrders,
  getOrderByNumber,
  deleteOrder,
  OrderNotFoundError,
  type Order,
  type OrderSortField,
  type SortDirection,
} from "../api/ordersApi";

import { AuthExpiredError } from "../api/http";
import { useAuth } from "../auth/AuthContext";

type View = "list" | "create" | "detail";

interface OrdersSectionProps {
  view: View;
  orderNumber?: string;
  onNavigateList: () => void;
  onNavigateDetail: (orderNumber: string) => void;
  onCountChange: (count: number) => void;
}

export default function OrdersSection({
  view,
  orderNumber,
  onNavigateList,
  onNavigateDetail,
  onCountChange,
}: OrdersSectionProps) {
  const { token, role, logout } = useAuth();

  const canDelete = role === "Admin";

  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [sortBy, setSortBy] = useState<OrderSortField>("CreatedAt");
  const [direction, setDirection] = useState<SortDirection>("Desc");

  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [deletingNumber, setDeletingNumber] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);


  // Детали заказа
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);


  const loadOrders = useCallback(() => {
    if (!token) return;

    setLoading(true);
    setLoadError(null);

    getOrders(
      {
        page,
        pageSize,
        sortBy,
        direction,
      },
      token
    )
      .then((data) => {
        setOrders(data.items);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);

        onCountChange(data.totalItems);
      })
      .catch((err) => {
        if (err instanceof AuthExpiredError) {
          logout();
          return;
        }

        setLoadError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить список заказов"
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, [
    token,
    page,
    pageSize,
    sortBy,
    direction,
    logout,
    onCountChange,
  ]);



  // Загрузка списка
  useEffect(() => {
    if (view === "list") {
      loadOrders();
    }
  }, [view, loadOrders]);



  // Загрузка деталей заказа по orderNumber
  useEffect(() => {
    if (
      view !== "detail" ||
      !orderNumber ||
      !token
    ) {
      return;
    }


    setDetailOrder(null);
    setDetailLoading(true);
    setDetailError(null);


    getOrderByNumber(orderNumber, token)

      .then((order) => {
        setDetailOrder(order);
      })

      .catch((err) => {

        if (err instanceof AuthExpiredError) {
          logout();
          return;
        }


        if (err instanceof OrderNotFoundError) {
          setDetailError(err.message);
          return;
        }


        setDetailError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить заказ"
        );
      })

      .finally(() => {
        setDetailLoading(false);
      });


  }, [
    view,
    orderNumber,
    token,
    logout,
  ]);




  const handleCreated = () => {

    setPage(1);
    setSortBy("CreatedAt");
    setDirection("Desc");

    onNavigateList();

    setTimeout(() => {
      loadOrders();
    }, 0);
  };




  const handleSortChange = (
    field: OrderSortField
  ) => {

    if (field === sortBy) {

      setDirection((d) =>
        d === "Asc"
          ? "Desc"
          : "Asc"
      );

    } else {

      setSortBy(field);
      setDirection("Asc");

    }


    setPage(1);
  };




  const handleDelete = async (order: Order) => {

    if (!token) return;


    const confirmed = window.confirm(
      `Удалить заказ ${order.orderNumber}?`
    );


    if (!confirmed) return;


    setDeletingNumber(order.orderNumber);
    setActionError(null);


    try {

      await deleteOrder(
        order.orderNumber,
        token
      );


      loadOrders();


    } catch (err) {

      if (err instanceof AuthExpiredError) {
        logout();
        return;
      }


      setActionError(
        err instanceof Error
          ? err.message
          : "Не удалось удалить заказ"
      );

    } finally {

      setDeletingNumber(null);

    }

  };




  return (
    <>

      {view === "list" && (
        <>

          {actionError && (
            <div className="status-banner status-banner--error">
              {actionError}
            </div>
          )}


          <OrderList
            orders={orders}
            loading={loading}
            error={loadError}

            onOpen={(order) =>
              onNavigateDetail(order.orderNumber)
            }

            onRetry={loadOrders}

            sortBy={sortBy}
            direction={direction}
            onSortChange={handleSortChange}

            canDelete={canDelete}
            onDelete={handleDelete}

            deletingNumber={deletingNumber}

            page={page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}

            onPageChange={setPage}

            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />

        </>
      )}




      {view === "create" && (

        <OrderForm
          onCreated={handleCreated}
          onCancel={onNavigateList}
        />

      )}




      {view === "detail" && (

        <>

          {detailLoading && (
            <div className="status-banner--loading">
              Загружаем заказ…
            </div>
          )}



          {!detailLoading && detailError && (

            <div>

              <button
                className="link-back"
                onClick={onNavigateList}
              >
                ← К списку заказов
              </button>


              <div className="status-banner status-banner--error">
                {detailError}
              </div>

            </div>

          )}




          {!detailLoading &&
            !detailError &&
            detailOrder && (

              <OrderDetail
                order={detailOrder}
                onBack={onNavigateList}
              />

          )}

        </>

      )}

    </>
  );
}