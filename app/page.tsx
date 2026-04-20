"use client";

import React, { useState, useEffect } from "react";

// --- Mock Data ---
// const MENU_ITEMS = [
//   {
//     id: "m1",
//     name: "Classic Cheeseburger",
//     price: 8.99,
//     category: "dishes",
//     image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
//     description: "A juicy 100% beef patty with melted cheddar cheese, fresh lettuce, tomato, and our signature source."
//   },
//   {
//     id: "m2",
//     name: "Pepperoni Pizza",
//     price: 12.50,
//     category: "dishes",
//     image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
//     description: "Classic Italian pizza crafted with fresh dough, topped with premium pepperoni slices and mozzarella."
//   },
//   {
//     id: "m3",
//     name: "Crispy French Fries",
//     price: 4.50,
//     category: "dishes",
//     image: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?auto=format&fit=crop&w=800&q=80",
//     description: "Golden and crispy fries served with a side of garlic mayo."
//   },
//   {
//     id: "m4",
//     name: "Iced Caramel Macchiato",
//     price: 5.00,
//     category: "drinks",
//     image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
//     description: "Refreshing iced coffee with a blend of caramel syrup and fresh milk."
//   },
//   {
//     id: "m5",
//     name: "Fresh Orange Juice",
//     price: 4.00,
//     category: "drinks",
//     image: "https://plus.unsplash.com/premium_photo-1675667390417-d9d23160f4a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "100% squeezed fresh oranges with no added sugar."
//   }
// ];

const MENU_ITEMS = [
  {
    id: "m1",
    name: "Classic Cheeseburger",
    price: 8.99,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "A juicy 100% beef patty with melted cheddar cheese, fresh lettuce, tomato, and our signature source."
  },
  {
    id: "m2",
    name: "Pepperoni Pizza",
    price: 12.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
    description: "Classic Italian pizza crafted with fresh dough, topped with premium pepperoni slices and mozzarella."
  },
  {
    id: "m3",
    name: "Crispy French Fries",
    price: 4.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?auto=format&fit=crop&w=800&q=80",
    description: "Golden and crispy fries served with a side of garlic mayo."
  },
  {
    id: "m4",
    name: "Iced Caramel Macchiato",
    price: 5.00,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
    description: "Refreshing iced coffee with a blend of caramel syrup and fresh milk."
  },
  {
    id: "m5",
    name: "Fresh Orange Juice",
    price: 4.00,
    category: "drinks",
    image: "https://plus.unsplash.com/premium_photo-1675667390417-d9d23160f4a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "100% squeezed fresh oranges with no added sugar."
  },
  {
    id: "m6",
    name: "Classic Caesar Salad",
    price: 9.25,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    description: "Crisp romaine lettuce tossed with creamy Caesar dressing, garlic croutons, and parmesan."
  },
  {
    id: "m7",
    name: "Spaghetti Carbonara",
    price: 14.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    description: "Traditional pasta with eggs, pecorino cheese, pancetta, and black pepper."
  },
  {
    id: "m8",
    name: "Salmon Teriyaki",
    price: 18.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    description: "Grilled salmon glazed with house-made teriyaki sauce, served with steamed bok choy."
  },
  {
    id: "m9",
    name: "Avocado Toast",
    price: 10.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    description: "Sourdough bread topped with smashed avocado, chili flakes, and a poached egg."
  },
  {
    id: "m10",
    name: "Beef Tacos",
    price: 11.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    description: "Three corn tortillas with seasoned beef, cilantro, onions, and spicy salsa."
  },
  {
    id: "m11",
    name: "Mushroom Risotto",
    price: 15.75,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80",
    description: "Creamy Arborio rice slow-cooked with porcini mushrooms and truffle oil."
  },
  {
    id: "m12",
    name: "BBQ Chicken Wings",
    price: 9.99,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    description: "Eight pieces of jumbo wings tossed in smoky barbecue sauce."
  },
  {
    id: "m13",
    name: "Blueberry Pancakes",
    price: 8.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=800&q=80",
    description: "Fluffy pancakes bursting with fresh blueberries, served with maple syrup."
  },
  {
    id: "m14",
    name: "Greek Salad",
    price: 8.75,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    description: "Cucumber, tomatoes, olives, and feta cheese with extra virgin olive oil."
  },
  {
    id: "m15",
    name: "Strawberry Cheesecake",
    price: 6.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    description: "Creamy New York style cheesecake topped with fresh strawberry compote."
  },
  {
    id: "m16",
    name: "Iced Green Tea",
    price: 3.50,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80",
    description: "Cold-brewed organic green tea with a hint of honey and lemon."
  },
  {
    id: "m17",
    name: "Beef Pho",
    price: 13.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    description: "Traditional Vietnamese noodle soup with thin slices of beef and herbs."
  },
  {
    id: "m18",
    name: "Chocolate Lava Cake",
    price: 7.25,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
    description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream."
  },
  {
    id: "m19",
    name: "Mango Lassi",
    price: 4.95,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
    description: "Refreshing yogurt-based drink blended with sweet Alphonso mangoes."
  },
  {
    id: "m20",
    name: "Chicken Ramen",
    price: 14.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    description: "Rich chicken broth with handmade noodles, soft-boiled egg, and nori."
  },
  {
    id: "m21",
    name: "Club Sandwich",
    price: 11.25,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    description: "Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo."
  },
  {
    id: "m22",
    name: "Espresso",
    price: 3.00,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
    description: "A concentrated shot of our premium dark roast coffee beans."
  },
  {
    id: "m23",
    name: "Eggs Benedict",
    price: 12.99,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=800&q=80",
    description: "English muffin topped with Canadian bacon, poached eggs, and hollandaise."
  },
  {
    id: "m24",
    name: "Caprese Salad",
    price: 9.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=800&q=80",
    description: "Fresh mozzarella, tomatoes, and basil leaves drizzled with balsamic glaze."
  },
  {
    id: "m25",
    name: "Lemonade",
    price: 3.75,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    description: "Homemade lemonade with fresh lemons and a touch of mint."
  },
  {
    id: "m26",
    name: "Fish and Chips",
    price: 15.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1524339102455-66097b3ca174?auto=format&fit=crop&w=800&q=80",
    description: "Beer-battered cod served with chunky chips and mushy peas."
  },
  {
    id: "m27",
    name: "Tiramisu",
    price: 7.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    description: "Coffee-soaked ladyfingers layered with mascarpone cream and cocoa."
  },
  {
    id: "m28",
    name: "Hot Chocolate",
    price: 4.50,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1544787210-224b6ca4e1e3?auto=format&fit=crop&w=800&q=80",
    description: "Rich Belgian chocolate melted into steamed milk with marshmallows."
  },
  {
    id: "m29",
    name: "Vegetable Stir Fry",
    price: 12.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1512058560366-cd242d59c5bb?auto=format&fit=crop&w=800&q=80",
    description: "Seasonal vegetables wok-tossed in a ginger-soy sauce over jasmine rice."
  },
  {
    id: "m30",
    name: "Pesto Pasta",
    price: 13.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80",
    description: "Fusilli pasta tossed in fresh basil pesto, pine nuts, and parmesan."
  },
  {
    id: "m31",
    name: "Smoothie Bowl",
    price: 9.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=800&q=80",
    description: "Mixed berry smoothie topped with granola, chia seeds, and banana slices."
  },
  {
    id: "m32",
    name: "Pulled Pork Burger",
    price: 11.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=800&q=80",
    description: "Slow-cooked pulled pork with coleslaw and pickles on a brioche bun."
  },
  {
    id: "m33",
    name: "Matcha Latte",
    price: 5.25,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80",
    description: "Ceremonial grade matcha whisked with velvety steamed milk."
  },
  {
    id: "m34",
    name: "Garlic Bread",
    price: 5.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",
    description: "Toasted baguette slices smothered in garlic butter and herbs."
  },
  {
    id: "m35",
    name: "Quinoa Salad",
    price: 10.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    description: "Nutritious quinoa with roasted vegetables, kale, and lemon vinaigrette."
  },
  {
    id: "m36",
    name: "Sparkling Water",
    price: 2.50,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1559839914-17aae19cea9e?auto=format&fit=crop&w=800&q=80",
    description: "Crisp sparkling mineral water with a fresh lime wedge."
  },
  {
    id: "m37",
    name: "Shrimp Scampi",
    price: 17.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1633964913295-ceb4c8248819?auto=format&fit=crop&w=800&q=80",
    description: "Large shrimp sautéed in a garlic, white wine, and butter sauce over linguine."
  },
  {
    id: "m38",
    name: "French Onion Soup",
    price: 8.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1583032015879-e50d23223002?auto=format&fit=crop&w=800&q=80",
    description: "Classic onion broth topped with a crusty bread slice and melted Gruyere."
  },
  {
    id: "m39",
    name: "Apple Pie",
    price: 6.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80",
    description: "Traditional spiced apple filling in a flaky, buttery pastry crust."
  },
  {
    id: "m40",
    name: "Iced Latte",
    price: 4.75,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    description: "Chilled espresso and milk over ice for a smooth coffee experience."
  },
  {
    id: "m41",
    name: "Margherita Pizza",
    price: 11.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=800&q=80",
    description: "Fresh tomato sauce, mozzarella, basil, and a drizzle of olive oil."
  },
  {
    id: "m42",
    name: "Chicken Quesadilla",
    price: 10.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=80",
    description: "Grilled flour tortilla stuffed with spiced chicken and melted Monterey Jack."
  },
  {
    id: "m43",
    name: "Falafel Wrap",
    price: 9.99,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
    description: "Crispy falafel balls with hummus, tahini, and pickles in a warm pita."
  },
  {
    id: "m44",
    name: "Fruit Salad",
    price: 6.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80",
    description: "A colorful mix of seasonal fresh fruits with a hint of lime."
  },
  {
    id: "m45",
    name: "Berry Smoothie",
    price: 5.50,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=800&q=80",
    description: "Blended strawberries, blueberries, and raspberries with Greek yogurt."
  },
  {
    id: "m46",
    name: "Steak Frites",
    price: 22.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    description: "Pan-seared ribeye steak served with herb butter and crispy fries."
  },
  {
    id: "m47",
    name: "Hummus Plate",
    price: 7.99,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1577906030526-f92e8d52763b?auto=format&fit=crop&w=800&q=80",
    description: "Creamy chickpea hummus served with warm pita and vegetable sticks."
  },
  {
    id: "m48",
    name: "Milkshake",
    price: 5.75,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    description: "Thick and creamy vanilla milkshake topped with whipped cream."
  },
  {
    id: "m49",
    name: "Lentil Soup",
    price: 7.50,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1547592115-8576022067b5?auto=format&fit=crop&w=800&q=80",
    description: "Hearty red lentil soup with carrots, celery, and cumin."
  },
  {
    id: "m50",
    name: "Belgian Waffle",
    price: 9.00,
    category: "dishes",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80",
    description: "Thick Belgian waffle dusted with powdered sugar and topped with berries."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dishes"); // 'dishes', 'drinks', 'cart'
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWaiterAnimation, setShowWaiterAnimation] = useState(false);
  const [toasts, setToasts] = useState<{ id: number, text: string }[]>([]);
  const [activeOrders, setActiveOrders] = useState<{ id: string, amount: number, status: string }[]>([]);
  const [showOrderOverlay, setShowOrderOverlay] = useState(false);

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
    
    // Move to active orders
    const totalAmount = Object.keys(cart).reduce((sum, key) => {
      const item = MENU_ITEMS.find((m) => m.id === key);
      return sum + (item ? item.price * cart[key] : 0);
    }, 0);

    const orderId = Math.random().toString(36).substring(7).toUpperCase();
    
    if (method === "momo") {
      addToast("Preparing your order...");
      completeOrder(orderId, totalAmount);
    } else {
      // Cash or card - waiter animation
      setShowWaiterAnimation(true);
      setTimeout(() => {
        setShowWaiterAnimation(false);
        addToast("Preparing your order...");
        completeOrder(orderId, totalAmount);
      }, 4000);
    }
  };

  const completeOrder = (orderId: string, amount: number) => {
    setActiveOrders((prev) => [...prev, { id: orderId, amount, status: "Preparing" }]);
    setCart({}); // clear cart
    setActiveTab("dishes");
  };

  const cartTotal = Object.keys(cart).reduce((sum, key) => {
    const item = MENU_ITEMS.find((m) => m.id === key);
    return sum + (item ? item.price * cart[key] : 0);
  }, 0);

  return (
    <div className="app-container">
      <header className="header">
        <div className="title">TableTap Menu</div>
        <div className="tabs">
          <div onClick={() => setActiveTab("dishes")} className={`tab ${activeTab === 'dishes' ? 'active' : ''}`}>Dishes</div>
          <div onClick={() => setActiveTab("drinks")} className={`tab ${activeTab === 'drinks' ? 'active' : ''}`}>Drinks</div>
          <div onClick={() => setActiveTab("cart")} className={`tab ${activeTab === 'cart' ? 'active' : ''}`}>Cart ({cartItemCount})</div>
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
            {MENU_ITEMS.filter((m) => m.category === activeTab && m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div key={item.id} className="dish-card">
                  <div className="dish-image-wrapper" onClick={() => setSelectedDish(item)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="dish-image" loading="lazy" />
                  </div>
                  <div className="dish-info">
                    <div className="dish-name">{item.name}</div>
                    <div className="dish-price">${item.price.toFixed(2)}</div>
                    {qty === 0 ? (
                      <button className="add-main-btn" onClick={(e) => { e.stopPropagation(); updateCart(item.id, 1); }}>
                        Add to Cart
                      </button>
                    ) : (
                      <div className="cart-controls">
                        <button className="control-btn" onClick={() => updateCart(item.id, -1)}>-</button>
                        <span className="qty-display">{qty}</span>
                        <button className="control-btn" onClick={() => updateCart(item.id, 1)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "cart" && (
          <div>
            {Object.keys(cart).length === 0 ? (
              <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                <div className="cart-list">
                  {Object.keys(cart).map((key) => {
                    const item = MENU_ITEMS.find((m) => m.id === key)!;
                    const qty = cart[key];
                    return (
                      <div key={key} className="cart-item">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="cart-item-img" />
                        <div className="cart-item-info">
                          <span className="cart-item-name">{item.name}</span>
                          <span className="cart-item-price">${item.price.toFixed(2)} x {qty}</span>
                        </div>
                        <div className="cart-item-qty">
                          ${(item.price * qty).toFixed(2)}
                        </div>
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

      {/* Floating Buttons & Toast */}
      {showFloatingProceed && (
        <button className="floating-proceed" onClick={() => setActiveTab("cart")}>
          Proceed to Cart ({cartItemCount} items)
        </button>
      )}

      {activeOrders.length > 0 && !showWaiterAnimation && (
        <div className="floating-status" onClick={() => setShowOrderOverlay(true)}>
          <div className="status-dot"></div>
          {activeOrders.length} Active Orders
        </div>
      )}

      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">{t.text}</div>
        ))}
      </div>

      {/* Modals */}
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

      {showPaymentModal && (
        <div className="overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            <div className="modal-content">
              <h2 className="modal-title">Payment Options</h2>
              <p className="modal-desc">Select how you would like to pay for your ${cartTotal.toFixed(2)} order.</p>
              <div className="payment-options">
                <button className="pay-btn momo" onClick={() => handleCheckout("momo")}>
                  📱 Mobile Money
                </button>
                <button className="pay-btn card" onClick={() => handleCheckout("card")}>
                  💳 Bank Card
                </button>
                <button className="pay-btn cash" onClick={() => handleCheckout("cash")}>
                  💵 Cash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderOverlay && (
        <div className="overlay" onClick={() => setShowOrderOverlay(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowOrderOverlay(false)}>✕</button>
            <div className="modal-content">
              <h2 className="modal-title">Your Orders</h2>
              <div className="cart-list" style={{ marginTop: 16 }}>
                {activeOrders.map((o) => (
                  <div key={o.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">Order #{o.id}</span>
                      <span className="cart-item-price" style={{ color: 'var(--success)', fontWeight: 'bold' }}>{o.status}</span>
                    </div>
                    <div className="cart-item-qty">
                      ${o.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <button className="add-main-btn" style={{ marginTop: 24 }} onClick={() => setShowOrderOverlay(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Waiter Animation Overlay */}
      {showWaiterAnimation && (
        <div className="animation-overlay">
          <svg className="waiter-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              {/* Waiter Head */}
              <circle cx="50" cy="20" r="10" fill="#f5d0b5"/>
              {/* Eye */}
              <circle cx="53" cy="18" r="1.5" fill="#333"/>
              {/* Mustard Waiter Suit */}
              <path d="M40 30 L60 30 L65 70 L35 70 Z" fill="#2c3e50"/>
              {/* Arm and Tray */}
              <path d="M48 35 C60 40, 75 35, 75 35" stroke="#f5d0b5" strokeWidth="4" fill="none"/>
              <line x1="60" y1="35" x2="90" y2="35" stroke="silver" strokeWidth="3"/>
              <path d="M70 30 C70 30, 78 20, 80 30 Z" fill="#e74c3c"/> {/* Cloche/Tray cover */}
              {/* Legs */}
              <line x1="45" y1="70" x2="40" y2="95" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round"/>
              <line x1="55" y1="70" x2="60" y2="95" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round"/>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
