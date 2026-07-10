import { useEffect, useMemo, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  AtSign,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Flame,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Plus,
  Quote,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from "lucide-react";
import FrameSequence from "./components/FrameSequence";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const menuItems = [
  {
    id: "house-stack",
    name: "The House Stack",
    category: "Burgers",
    price: 349,
    description: "Double smash patties, cheddar, caramelized onion, lettuce and smoky stack sauce.",
    image: "images/signature-burger.webp",
    badge: "Bestseller",
    accent: "red",
  },
  {
    id: "fireline-melt",
    name: "Fireline Melt",
    category: "Burgers",
    price: 329,
    description: "Smash patty, pepper jack, charred jalapeno, tomato and red pepper relish.",
    image: "images/burger-poster.webp",
    badge: "Spicy",
    accent: "yellow",
  },
  {
    id: "garden-crunch",
    name: "Garden Crunch",
    category: "Burgers",
    price: 279,
    description: "Crisp vegetable patty, cheddar, lettuce, tomato, pickles and herb mayo.",
    image: "frames/burger/frame-103.webp",
    badge: "Vegetarian",
    accent: "green",
  },
  {
    id: "loaded-fries",
    name: "Stacked Loaded Fries",
    category: "Sides",
    price: 189,
    description: "Skin-on fries, cheddar sauce, scallions and house smoky seasoning.",
    image: "images/loaded-fries.webp",
    badge: "For sharing",
    accent: "yellow",
  },
  {
    id: "crisp-rings",
    name: "Crisp Onion Rings",
    category: "Sides",
    price: 159,
    description: "Buttermilk onion rings with a bright red pepper dip.",
    image: "images/loaded-fries.webp",
    badge: "Fresh fried",
    accent: "red",
  },
  {
    id: "iced-vanilla",
    name: "Iced Vanilla Latte",
    category: "Coffee",
    price: 199,
    description: "Double espresso, cold milk and house vanilla over clear ice.",
    image: "images/drinks.webp",
    badge: "Double shot",
    accent: "yellow",
    position: "left",
  },
  {
    id: "cold-brew",
    name: "Cold Brew Cloud",
    category: "Coffee",
    price: 179,
    description: "Eighteen-hour cold brew finished with a light sweet cream cap.",
    image: "images/drinks.webp",
    badge: "18-hour brew",
    accent: "green",
    position: "left",
  },
  {
    id: "strawberry-static",
    name: "Strawberry Static",
    category: "Shakes",
    price: 219,
    description: "Strawberry, vanilla bean and milk blended thick, never over-topped.",
    image: "images/drinks.webp",
    badge: "House favourite",
    accent: "red",
    position: "right",
  },
];

const categories = ["All", "Burgers", "Sides", "Coffee", "Shakes"];

const reviews = [
  { name: "Riya M.", note: "The crust on the patty and the cold brew together are exactly why I came back.", rating: 5 },
  { name: "Arjun S.", note: "Fast service, proper portions, and a burger that stays crisp till the last bite.", rating: 5 },
  { name: "Neha P.", note: "The space feels polished without losing the easy neighbourhood-cafe energy.", rating: 5 },
];

function Brand() {
  return (
    <span className="brand" aria-label="Stack and Sip">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span><strong>STACK</strong><small>& SIP</small></span>
    </span>
  );
}

function App() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);

  const visibleItems = useMemo(
    () => activeCategory === "All" ? menuItems : menuItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  const cartItems = useMemo(
    () => menuItems.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] })),
    [cart],
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  useGSAP(() => {
    const reveals = gsap.utils.toArray(".reveal");
    reveals.forEach((element) => {
      gsap.from(element, {
        y: 34,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });
  });

  useEffect(() => {
    const locked = cartOpen || reserveOpen || menuOpen;
    document.body.classList.toggle("is-locked", locked);
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setReserveOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cartOpen, reserveOpen, menuOpen]);

  const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

  const addToCart = (id) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setOrderComplete(false);
  };

  const changeQuantity = (id, delta) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + delta);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      return updated;
    });
  };

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#menu">Skip to menu</a>

      <header className="site-header">
        <button type="button" className="brand-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Brand />
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button type="button" onClick={() => scrollTo("#menu")}>Menu</button>
          <button type="button" onClick={() => scrollTo("#story")}>Our story</button>
          <button type="button" onClick={() => scrollTo("#visit")}>Visit</button>
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button cart-button" onClick={() => setCartOpen(true)} aria-label={`Open order bag, ${cartCount} items`}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
          <button type="button" className="header-order" onClick={() => scrollTo("#menu")}>Order now <ArrowRight size={17} /></button>
          <button type="button" className="icon-button mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main>
        <FrameSequence activeStage={activeStage} onStageChange={setActiveStage} onMenuClick={() => scrollTo("#menu")} />

        <section className="service-strip" aria-label="Cafe details">
          <div><Flame size={21} /><span><strong>Smashed to order</strong><small>Never held under heat</small></span></div>
          <div><Clock3 size={21} /><span><strong>Open late</strong><small>11 AM–12 AM weekends</small></span></div>
          <div><Coffee size={21} /><span><strong>Specialty coffee</strong><small>Roasted weekly</small></span></div>
          <div><Leaf size={21} /><span><strong>Fresh prep</strong><small>Cut and mixed daily</small></span></div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading reveal">
            <span className="eyebrow">THE FULL LINE-UP</span>
            <h2>Big flavour.<br />Zero filler.</h2>
            <p>Built around crisp-edged burgers, bright sides and coffee strong enough to keep up.</p>
          </div>

          <div className="category-tabs reveal" role="tablist" aria-label="Menu categories">
            {categories.map((category) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={activeCategory === category ? "is-active" : ""}
                onClick={() => setActiveCategory(category)}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {visibleItems.map((item) => (
              <article className={`menu-card accent-${item.accent}`} key={item.id}>
                <div className="menu-card-media">
                  <img
                    src={asset(item.image)}
                    alt={item.name}
                    loading="lazy"
                    style={{ objectPosition: item.position === "left" ? "28% center" : item.position === "right" ? "76% center" : "center" }}
                  />
                  <span>{item.badge}</span>
                </div>
                <div className="menu-card-copy">
                  <div><small>{item.category}</small><strong>₹{item.price}</strong></div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <button type="button" onClick={() => addToCart(item.id)} aria-label={`Add ${item.name} to order`}>
                    Add to order <Plus size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story-section" id="story">
          <img src={asset("images/cafe-interior.webp")} alt="Stack and Sip cafe interior" loading="lazy" />
          <div className="story-copy reveal">
            <span className="eyebrow">THE STACK & SIP STANDARD</span>
            <h2>Fast food pace.<br />Chef-led detail.</h2>
            <p>Stack & Sip is a fictional Ahmedabad neighbourhood café concept built around one simple rule: every layer should earn its place. We smash patties when the ticket lands, bake buns in small batches and dial in the coffee every morning.</p>
            <div className="story-points">
              <span><Check size={17} /> Small-batch buns</span>
              <span><Check size={17} /> House-made sauces</span>
              <span><Check size={17} /> Freshly ground coffee</span>
            </div>
          </div>
        </section>

        <section className="feature-band">
          <div className="feature-photo reveal"><img src={asset("images/loaded-fries.webp")} alt="Loaded fries and onion rings" loading="lazy" /></div>
          <div className="feature-copy reveal">
            <span className="eyebrow">WEEKDAY COMBO</span>
            <h2>Lunch should hit harder.</h2>
            <p>Any single burger, skin-on fries and a cold brew from ₹449, Monday to Thursday before 4 PM.</p>
            <button type="button" className="dark-command" onClick={() => { setActiveCategory("Burgers"); scrollTo("#menu"); }}>
              Build a lunch stack <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <section className="reviews-section">
          <div className="section-heading reveal">
            <span className="eyebrow">GUEST NOTES</span>
            <h2>Good food travels<br />by word of mouth.</h2>
          </div>
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card reveal" key={review.name}>
                <Quote size={24} />
                <div className="stars" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}
                </div>
                <p>“{review.note}”</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="visit-section" id="visit">
          <div className="visit-copy reveal">
            <span className="eyebrow">FIND YOUR TABLE</span>
            <h2>Come hungry.<br />Stay for coffee.</h2>
            <div className="visit-details">
              <div><MapPin size={20} /><p><strong>Concept location</strong><span>Near Municipal Market, C.G. Road,<br />Navrangpura, Ahmedabad</span></p></div>
              <div><Clock3 size={20} /><p><strong>Hours</strong><span>Mon–Thu 11 AM–11 PM<br />Fri–Sun 11 AM–12 AM</span></p></div>
            </div>
            <div className="visit-actions">
              <a href="https://www.google.com/maps/search/?api=1&query=Municipal+Market+CG+Road+Ahmedabad" target="_blank" rel="noreferrer">Get directions <ArrowRight size={17} /></a>
              <button type="button" onClick={() => { setReservationComplete(false); setReserveOpen(true); }}>Reserve a table</button>
            </div>
          </div>
          <div className="visit-visual" aria-hidden="true">
            <div className="map-grid" />
            <span className="map-pin"><MapPin size={25} /></span>
            <strong>STACK & SIP</strong>
            <small>C.G. ROAD · AHMEDABAD</small>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Brand />
        <p>Flame-grilled burgers, bright sides and properly dialled coffee.</p>
        <div className="footer-links">
          <button type="button" onClick={() => scrollTo("#menu")}>Menu</button>
          <button type="button" onClick={() => setReserveOpen(true)}>Reservations</button>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><AtSign size={19} /></a>
        </div>
        <small>© 2026 STACK & SIP · FICTIONAL CONCEPT CAFÉ</small>
      </footer>

      <div className="mobile-action-bar">
        <button type="button" onClick={() => setReserveOpen(true)}>Reserve</button>
        <button type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /> Order {cartCount > 0 && `(${cartCount})`}</button>
      </div>

      <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <button type="button" className="icon-button close-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={23} /></button>
        <Brand />
        <nav>
          <button type="button" onClick={() => scrollTo("#menu")}>Menu</button>
          <button type="button" onClick={() => scrollTo("#story")}>Our story</button>
          <button type="button" onClick={() => scrollTo("#visit")}>Visit</button>
          <button type="button" onClick={() => { setMenuOpen(false); setReserveOpen(true); }}>Reserve</button>
        </nav>
      </div>

      <div className={`scrim ${cartOpen || reserveOpen || menuOpen ? "is-visible" : ""}`} onClick={() => { setCartOpen(false); setReserveOpen(false); setMenuOpen(false); }} />

      <aside className={`order-drawer ${cartOpen ? "is-open" : ""}`} aria-hidden={!cartOpen} aria-label="Your order">
        <div className="drawer-header">
          <div><small>YOUR ORDER</small><h2>{cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""}` : "Bag is empty"}</h2></div>
          <button type="button" className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close order"><X size={22} /></button>
        </div>
        {orderComplete ? (
          <div className="success-state">
            <span><Check size={30} /></span>
            <h3>Order received.</h3>
            <p>Your pickup number is <strong>S&S-24</strong>. This concept checkout stores no payment details.</p>
            <button type="button" onClick={() => { setOrderComplete(false); setCart({}); setCartOpen(false); }}>Done</button>
          </div>
        ) : cartItems.length ? (
          <>
            <div className="order-lines">
              {cartItems.map((item) => (
                <div className="order-line" key={item.id}>
                  <img src={asset(item.image)} alt="" />
                  <div><strong>{item.name}</strong><small>₹{item.price * item.quantity}</small></div>
                  <div className="quantity-control">
                    <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>{item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setOrderComplete(true); }}>
              <div className="field-row"><label>Name<input required name="name" placeholder="Your name" /></label><label>Phone<input required name="phone" type="tel" placeholder="10-digit number" pattern="[0-9 ]{10,14}" /></label></div>
              <label>Pickup time<select name="time" defaultValue="20"><option value="20">In 20 minutes</option><option value="35">In 35 minutes</option><option value="60">In 1 hour</option></select><ChevronDown size={16} /></label>
              <div className="order-total"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <button type="submit" className="checkout-button">Confirm pickup order <ArrowRight size={18} /></button>
              <small>Pay at the counter. Taxes included.</small>
            </form>
          </>
        ) : (
          <div className="empty-state"><ShoppingBag size={34} /><p>Your next favourite bite is waiting in the menu.</p><button type="button" onClick={() => { setCartOpen(false); scrollTo("#menu"); }}>Explore menu</button></div>
        )}
      </aside>

      <div className={`reservation-modal ${reserveOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!reserveOpen} aria-labelledby="reserve-title">
        <button type="button" className="icon-button modal-close" onClick={() => setReserveOpen(false)} aria-label="Close reservation"><X size={22} /></button>
        {reservationComplete ? (
          <div className="success-state">
            <span><Check size={30} /></span>
            <h3 id="reserve-title">Table requested.</h3>
            <p>We have held your request. The café team would confirm it by phone before service.</p>
            <button type="button" onClick={() => setReserveOpen(false)}>Done</button>
          </div>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); setReservationComplete(true); }}>
            <span className="eyebrow">RESERVE A TABLE</span>
            <h2 id="reserve-title">Make room for a proper meal.</h2>
            <div className="field-row"><label>Name<input required placeholder="Your name" /></label><label>Phone<input required type="tel" placeholder="10-digit number" pattern="[0-9 ]{10,14}" /></label></div>
            <div className="field-row"><label>Date<input required type="date" /></label><label>Guests<select defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select><ChevronDown size={16} /></label></div>
            <label>Preferred time<select defaultValue="7:30 PM"><option>6:30 PM</option><option>7:30 PM</option><option>8:30 PM</option><option>9:30 PM</option></select><ChevronDown size={16} /></label>
            <label>Note<textarea rows="3" placeholder="Birthday, high chair, accessibility needs..." /></label>
            <button type="submit" className="checkout-button">Request reservation <ArrowRight size={18} /></button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
