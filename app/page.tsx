"use client";

import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "@/lib/config";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  const [activeTab, setActiveTab] = useState("dishes");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWaiterAnimation, setShowWaiterAnimation] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const [activeOrders, setActiveOrders] = useState<
    { id: string; amount: number; status: string; totalAmount?: number }[]
  >([]);
  const [showOrderOverlay, setShowOrderOverlay] = useState(false);
  const [orderReadyMessage, setOrderReadyMessage] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [myTableId, setMyTableId] = useState<number>(0);
  const [inventoryState, setInventoryState] = useState<Record<string, boolean>>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Splash screen timeout
  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 2200);
    const hideTimer = setTimeout(() => setShowSplash(false), 2700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Socket connection
  useEffect(() => {
    const tid = Math.floor(Math.random() * 20) + 1;
    setMyTableId(tid);

    const s = io(config.apiUrl);
    setSocket(s);

    s.on("initial_state", (data) => {
      setInventoryState(data.inventoryState || {});
      setMenuItems(data.menu || []);
      setActiveOrders(
        (data.orders || []).filter(
          (o: any) => o.tableId === tid && o.status !== "served"
        )
      );
    });

    s.on("inventory_update", (data) => {
      setInventoryState(data);
    });

    s.on("orders_update", (orders) => {
      setActiveOrders(
        orders.filter((o: any) => o.tableId === tid && o.status !== "served")
      );
    });

    s.on("order_ready_notification", (data: { tableId: number; orderId: string }) => {
      if (data.tableId === tid) {
        setOrderReadyMessage(
          "🎉 Wonderful news! Your order has been freshly prepared and is on its way to your table. Sit tight and enjoy!"
        );
        setShowOrderOverlay(true);
      }
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const showFloatingProceed = cartItemCount > 0 && activeTab !== "cart";

  const addToast = (text: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const updateCart = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleCheckout = (method: string) => {
    setShowPaymentModal(false);

    const items = Object.keys(cart).map((key) => {
      const item = menuItems.find((m) => m.id === key);
      return {
        menuItemId: key,
        qty: cart[key],
        name: item?.name || "Unknown",
        price: item?.price || 0,
      };
    });

    const orderData = {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      tableId: myTableId,
      items,
      totalAmount: cartTotal,
      paymentMethod: method,
    };

    if (socket) {
      socket.emit("place_order", orderData);
    }

    if (method === "momo") {
      addToast("Order placed, awaiting payment confirmation...");
      setCart({});
      setActiveTab("dishes");
    } else {
      setShowWaiterAnimation(true);
      setTimeout(() => {
        setShowWaiterAnimation(false);
        addToast("Order placed! A waiter will collect your payment shortly.");
        setCart({});
        setActiveTab("dishes");
      }, 4000);
    }
  };

  const cartTotal = Object.keys(cart).reduce((sum, key) => {
    const item = menuItems.find((m) => m.id === key);
    return sum + (item ? item.price * cart[key] : 0);
  }, 0);

  const handleCloseOrderOverlay = () => {
    setShowOrderOverlay(false);
    setOrderReadyMessage(null);
  };

  const filteredItems = menuItems.filter(
    (m) =>
      m.category === activeTab &&
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* ── Splash Screen ── */}
      {showSplash && (
        <div className={`splash-screen ${splashFading ? "splash-fading" : ""}`}>
          <div className="splash-inner">
            <div className="splash-logo-circle">
              <Image
                src="/Logo.png"
                alt="TableTap Logo"
                width={120}
                height={120}
                priority
                className="splash-logo"
              />
            </div>
            <p className="splash-tagline">Order with a tap. Dine with a smile.</p>
          </div>
        </div>
      )}

      <div className="app-container">
        <header className="header">
          <div className="header-top">
            <div className="header-logo-circle">
              <Image
                src="/Logo.png"
                alt="TableTap"
                width={36}
                height={36}
                unoptimized 
                className="w-9 h-9 object-cover rounded-full"
              />
            </div>
            <div className="title">TableTap Menu</div>
            <span className="table-badge">Table {myTableId || "—"}</span>
          </div>
          <div className="tabs">
            <div onClick={() => setActiveTab("dishes")} className={`tab ${activeTab === "dishes" ? "active" : ""}`}>Dishes</div>
            <div onClick={() => setActiveTab("drinks")} className={`tab ${activeTab === "drinks" ? "active" : ""}`}>Drinks</div>
            <div onClick={() => setActiveTab("cart")} className={`tab ${activeTab === "cart" ? "active" : ""}`}>Cart ({cartItemCount})</div>
          </div>
        </header>

        {activeTab !== "cart" && (
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="content-area">
          {activeTab !== "cart" && (
            <div className="dish-grid">
              {menuItems.length === 0 ? (
                <div className="loading-menu">
                  <div className="loading-spinner" />
                  <p>Loading menu...</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const qty = cart[item.id] || 0;
                  const isAbsent = !!inventoryState[item.id];
                  return (
                    <div key={item.id} className={`dish-card ${isAbsent ? "dish-card--absent" : ""}`}>
                      <div
                        className="dish-image-wrapper"
                        onClick={() => !isAbsent && setSelectedDish(item)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="dish-image" loading="lazy" />
                        {isAbsent && <div className="absent-overlay">Out of Stock</div>}
                      </div>
                      <div className="dish-info">
                        <div className="dish-name">{item.name}</div>
                        <div className="dish-price">${item.price.toFixed(2)}</div>
                        {isAbsent ? (
                          <div className="out-of-stock-btn">Out of Stock</div>
                        ) : qty === 0 ? (
                          <button
                            className="add-main-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCart(item.id, 1);
                            }}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="cart-controls">
                            <button className="control-btn" onClick={() => updateCart(item.id, -1)}>−</button>
                            <span className="qty-display">{qty}</span>
                            <button className="control-btn" onClick={() => updateCart(item.id, 1)}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "cart" && (
            <div>
              {Object.keys(cart).length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <h2>Your cart is empty</h2>
                  <p>Add some delicious items to get started!</p>
                </div>
              ) : (
                <>
                  <div className="cart-list">
                    {Object.keys(cart).map((key) => {
                      const item = menuItems.find((m) => m.id === key);
                      if (!item) return null;
                      const qty = cart[key];
                      return (
                        <div key={key} className="cart-item">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="cart-item-img" />
                          <div className="cart-item-info">
                            <span className="cart-item-name">{item.name}</span>
                            <span className="cart-item-price">${item.price.toFixed(2)} × {qty}</span>
                          </div>
                          <div className="cart-item-qty">${(item.price * qty).toFixed(2)}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="checkout-area">
                    <div className="total-row">
                      <span>Total Amount</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => setShowPaymentModal(true)}>
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Floating: Proceed to Cart */}
        {showFloatingProceed && (
          <button className="floating-proceed" onClick={() => setActiveTab("cart")}>
            Proceed to Cart ({cartItemCount} items)
          </button>
        )}

        {/* Floating: Active Orders FAB */}
        {activeOrders.length > 0 && !showWaiterAnimation && (
          <button
            id="orders-fab"
            className="orders-fab"
            onClick={() => setShowOrderOverlay(true)}
            aria-label={`View ${activeOrders.length} active orders`}
          >
            <span className="orders-fab-icon">🛎️</span>
            <span className="orders-fab-badge">{activeOrders.length}</span>
          </button>
        )}

        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className="toast">{t.text}</div>
          ))}
        </div>

        {/* ── Modals ── */}

        {/* Dish Detail Modal */}
        {selectedDish && (
          <div className="overlay" onClick={() => setSelectedDish(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedDish(null)}>✕</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedDish.image} className="modal-img" alt={selectedDish.name} />
              <div className="modal-content">
                <h2 className="modal-title">{selectedDish.name}</h2>
                <div className="modal-price">${selectedDish.price.toFixed(2)}</div>
                <p className="modal-desc">{selectedDish.description}</p>
                <button
                  className="add-main-btn"
                  style={{ marginTop: 16 }}
                  onClick={() => { updateCart(selectedDish.id, 1); setSelectedDish(null); }}
                >
                  Add 1 to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="overlay" onClick={() => setShowPaymentModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
              <div className="modal-content">
                <h2 className="modal-title">Payment Options</h2>
                <p className="modal-desc">
                  Select how you would like to pay for your ${cartTotal.toFixed(2)} order.
                </p>
                <div className="payment-options">
                  <button className="pay-btn momo" onClick={() => handleCheckout("momo")}>📱 Mobile Money</button>
                  <button className="pay-btn card" onClick={() => handleCheckout("card")}>💳 Bank Card</button>
                  <button className="pay-btn cash" onClick={() => handleCheckout("cash")}>💵 Cash</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Orders Modal */}
        {showOrderOverlay && (
          <div className="overlay" onClick={handleCloseOrderOverlay}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseOrderOverlay}>✕</button>
              <div className="modal-content">
                <h2 className="modal-title">Your Orders</h2>

                {orderReadyMessage && (
                  <div className="order-ready-banner">
                    {orderReadyMessage}
                  </div>
                )}

                <div className="cart-list" style={{ marginTop: 16 }}>
                  {activeOrders.map((o) => (
                    <div key={o.id} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-name">Order #{o.id}</span>
                        <span className={`order-status-label status-${o.status}`}>
                          {o.status === "payment_pending" && "⏳ Awaiting Payment"}
                          {o.status === "preparing" && "👨‍🍳 Being Prepared"}
                          {o.status === "ready" && "✅ On Its Way to You"}
                        </span>
                      </div>
                      <div className="cart-item-qty">
                        ${(o.totalAmount || o.amount || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="add-main-btn" style={{ marginTop: 24 }} onClick={handleCloseOrderOverlay}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Waiter Animation Overlay */}
        {showWaiterAnimation && (
          <div className="animation-overlay">
            <svg className="waiter-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <g>
                <circle cx="50" cy="20" r="10" fill="#f5d0b5" />
                <circle cx="53" cy="18" r="1.5" fill="#333" />
                <path d="M40 30 L60 30 L65 70 L35 70 Z" fill="#2c3e50" />
                <path d="M48 35 C60 40, 75 35, 75 35" stroke="#f5d0b5" strokeWidth="4" fill="none" />
                <line x1="60" y1="35" x2="90" y2="35" stroke="silver" strokeWidth="3" />
                <path d="M70 30 C70 30, 78 20, 80 30 Z" fill="#e74c3c" />
                <line x1="45" y1="70" x2="40" y2="95" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round" />
                <line x1="55" y1="70" x2="60" y2="95" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round" />
              </g>
            </svg>
            <div style={{ color: "white", marginTop: "20px", fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>
              A waiter is on the way to collect your payment.
            </div>
          </div>
        )}
      </div>
    </>
  );
}