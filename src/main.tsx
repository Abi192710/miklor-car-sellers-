import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, CarFront, Check, ChevronDown, Filter, Gauge, Heart,
  Menu, MessageCircle, Search, Send, ShieldCheck, SlidersHorizontal,
  Sparkles, Star, X, Zap
} from "lucide-react";
import "./styles.css";

type Vehicle = {
  id: number;
  make: string;
  model: string;
  year: number;
  type: "SUV" | "Sedan" | "Truck" | "EV" | "Coupe" | "Minibus";
  price: number;
  mileage: string;
  drive: string;
  fuel: string;
  image: string;
  badge?: string;
};

const img = (q: string, seed: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1200&q=82&ixlib=rb-4.1.0&auto=format&fm=jpg&seed=${seed}`;

const inventory: Vehicle[] = [
  {id:1, make:"Toyota", model:"RAV4", year:2024, type:"SUV", price:5480000, mileage:"12,800 km", drive:"AWD", fuel:"Petrol", image:img("photo-1549317661-bd32c8ce0db2",1), badge:"Featured"},
  {id:2, make:"BYD", model:"Song Plus", year:2025, type:"EV", price:4620000, mileage:"2,100 km", drive:"FWD", fuel:"Electric", image:img("photo-1553440569-bcc63803a83d",2), badge:"New"},
  {id:3, make:"Hyundai", model:"Tucson", year:2024, type:"SUV", price:4920000, mileage:"18,400 km", drive:"AWD", fuel:"Petrol", image:img("photo-1606664515524-ed2f786a0bd6",3)},
  {id:4, make:"Suzuki", model:"Swift", year:2023, type:"Sedan", price:2680000, mileage:"24,500 km", drive:"FWD", fuel:"Petrol", image:img("photo-1502877338535-766e1452684a",4)},
  {id:5, make:"Nissan", model:"X-Trail", year:2023, type:"SUV", price:4450000, mileage:"31,200 km", drive:"AWD", fuel:"Petrol", image:img("photo-1494976388531-d1058494cdd8",5)},
  {id:6, make:"Toyota", model:"Hilux", year:2022, type:"Truck", price:5120000, mileage:"46,800 km", drive:"4WD", fuel:"Diesel", image:img("photo-1558981806-ec527fa84c39",6)},
  {id:7, make:"Kia", model:"Sportage", year:2024, type:"SUV", price:4580000, mileage:"14,700 km", drive:"FWD", fuel:"Petrol", image:img("photo-1519641471654-76ce0107ad1b",7)},
  {id:8, make:"Hyundai", model:"Elantra", year:2022, type:"Sedan", price:3150000, mileage:"38,100 km", drive:"FWD", fuel:"Petrol", image:img("photo-1503376780353-7e6692767b70",8)},
  {id:9, make:"BYD", model:"Dolphin", year:2025, type:"EV", price:3490000, mileage:"900 km", drive:"FWD", fuel:"Electric", image:img("photo-1541899481282-d53bffe3c35d",9)},
  {id:10, make:"Toyota", model:"Prado", year:2021, type:"SUV", price:7600000, mileage:"62,000 km", drive:"4WD", fuel:"Diesel", image:img("photo-1511919884226-fd3cad34687c",10)},
  {id:11, make:"Suzuki", model:"Jimny", year:2024, type:"SUV", price:3520000, mileage:"8,200 km", drive:"4WD", fuel:"Petrol", image:img("photo-1492144534655-ae79c964c9d7",11)},
  {id:12, make:"Nissan", model:"Patrol", year:2022, type:"SUV", price:8900000, mileage:"39,600 km", drive:"4WD", fuel:"Petrol", image:img("photo-1606664515524-ed2f786a0bd6",12)},
  {id:13, make:"Toyota", model:"Corolla", year:2023, type:"Sedan", price:3380000, mileage:"21,900 km", drive:"FWD", fuel:"Petrol", image:img("photo-1542362567-b07e54358753",13)},
  {id:14, make:"Hyundai", model:"Staria", year:2024, type:"Minibus", price:5850000, mileage:"17,300 km", drive:"FWD", fuel:"Diesel", image:img("photo-1551830820-330a71b99659",14)},
  {id:15, make:"Kia", model:"Sorento", year:2023, type:"SUV", price:5320000, mileage:"27,800 km", drive:"AWD", fuel:"Diesel", image:img("photo-1542282088-72c9c27ed0cd",15)},
  {id:16, make:"BYD", model:"Atto 3", year:2024, type:"EV", price:4210000, mileage:"5,700 km", drive:"FWD", fuel:"Electric", image:img("photo-1619767886558-efdc259cde1a",16)},
  {id:17, make:"Toyota", model:"Vitz", year:2021, type:"Sedan", price:2240000, mileage:"54,000 km", drive:"FWD", fuel:"Petrol", image:img("photo-1504215680853-026ed2a45def",17)},
  {id:18, make:"Honda", model:"CR-V", year:2022, type:"SUV", price:4380000, mileage:"35,600 km", drive:"AWD", fuel:"Petrol", image:img("photo-1533473359331-0135ef1b58bf",18)},
];

const makes = ["All", "Toyota", "BYD", "Suzuki", "Hyundai", "Nissan", "Kia", "Honda"];
const types = ["All", "SUV", "Sedan", "Truck", "EV", "Coupe", "Minibus"];

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {maximumFractionDigits:0}).format(n);

function App() {
  const [menu, setMenu] = useState(false);
  const [type, setType] = useState("All");
  const [make, setMake] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [lang, setLang] = useState<"am"|"en">("am");
  const [paymentPrice, setPaymentPrice] = useState(4500000);
  const [down, setDown] = useState(800000);
  const [term, setTerm] = useState(60);

  const filtered = useMemo(() => inventory.filter(v =>
    (type === "All" || v.type === type) &&
    (make === "All" || v.make === make) &&
    v.price <= maxPrice &&
    `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  ), [type, make, maxPrice, search]);

  const monthly = Math.round(((Math.max(paymentPrice-down,0) * 0.009) /
    (1-Math.pow(1.009,-term))) || 0);

  const toggleFavorite = (id:number) =>
    setFavorites(x => x.includes(id) ? x.filter(i=>i!==id) : [...x,id]);

  const t = lang === "am" ? {
    nav:["መኪናዎች","ስለ እኛ","አገልግሎት","እንዴት እንረዳዎታለን?"],
    heroKicker:"አዲስ አበባ · 50 መኪናዎች · በየቀኑ ክፍት",
    heroTitle:"የሚፈልጉትን መኪና፣ በቀላሉ ያግኙ።",
    heroSub:"Toyota, BYD, Suzuki, Hyundai, Nissan እና ሌሎች ታዋቂ ብራንዶችን ከኢትዮጵያ ገበያ ጋር በሚስማማ ዋጋ ይመልከቱ።",
    browse:"መኪናዎችን ይመልከቱ", trade:"ዋጋ ይጠይቁ", stock:"በአሁኑ ጊዜ ያሉ መኪናዎች",
    inventory:"መኪና ይምረጡ", filter:"ፊልተር", finance:"የክፍያ ማስያ",
    financeTitle:"ከመግዛትዎ በፊት ወርሃዊ ክፍያዎን ይወቁ",
    contact:"ያግኙን", details:"ዝርዝር ይመልከቱ"
  } : {
    nav:["Inventory","About","Services","Contact"],
    heroKicker:"ADDIS ABABA · 50 VEHICLES · OPEN DAILY",
    heroTitle:"Find the car that fits your drive.",
    heroSub:"Shop Toyota, BYD, Suzuki, Hyundai, Nissan and more, curated for the Ethiopian market.",
    browse:"Browse Cars", trade:"Ask for a Price", stock:"IN STOCK NOW",
    inventory:"Find Your Car", filter:"Filters", finance:"PAYMENT CALCULATOR",
    financeTitle:"Know your monthly payment before you buy",
    contact:"Contact us", details:"View details"
  };

  return (
    <div className="app">
      <header className="nav">
        <a className="brand" href="#home" aria-label="Miklor Car Sellers">
          <span className="brand-mark"><CarFront size={22}/></span>
          <span><b>MIKLOR</b><small>CAR SELLERS</small></span>
        </a>
        <nav className="desktop-nav">
          {t.nav.map((n,i)=><a href={["#inventory","#about","#services","#contact"][i]} key={n}>{n}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="lang" onClick={()=>setLang(lang==="am"?"en":"am")}>{lang==="am"?"EN":"አማ"}</button>
          <a className="call" href="tel:0922322507">0922 32 25 07</a>
          <button className="menu-btn" onClick={()=>setMenu(!menu)} aria-label="menu">{menu?<X/>:<Menu/>}</button>
        </div>
      </header>

      <AnimatePresence>
        {menu && <motion.div className="mobile-menu" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}}>
          {t.nav.map((n,i)=><a onClick={()=>setMenu(false)} href={["#inventory","#about","#services","#contact"][i]} key={n}>{n}<ArrowRight size={18}/></a>)}
          <a className="wa big" href="https://wa.me/251922322507"><MessageCircle/> WhatsApp</a>
        </motion.div>}
      </AnimatePresence>

      <main>
        <section id="home" className="hero">
          <div className="hero-glow"/>
          <div className="hero-grid"/>
          <div className="hero-content">
            <motion.div className="eyebrow" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.6}}
              <span className="pulse"/> {t.heroKicker}
            </motion.div>
            <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.75,delay:.1}}>
              {t.heroTitle}
            </motion.h1>
            <motion.p initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.65,delay:.22}}>
              {t.heroSub}
            </motion.p>
            <motion.div className="hero-buttons" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.32}}>
              <a href="#inventory" className="btn primary">{t.browse}<ArrowRight size={18}/></a>
              <a href="https://wa.me/251922322507?text=Hello%20Miklor%20Car%20Sellers" className="btn ghost"><MessageCircle size={18}/> WhatsApp</a>
            </motion.div>

            <motion.div className="quick-search" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.6,delay:.45}}>
              <div className="search-field"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="am"?"መኪና ይፈልጉ…":"Search Toyota, BYD, SUV…"}/></div>
              <select value={make} onChange={e=>setMake(e.target.value)}>{makes.map(m=><option key={m}>{m}</option>)}</select>
              <button onClick={()=>document.getElementById("inventory")?.scrollIntoView({behavior:"smooth"})} className="search-btn"><Search size={18}/>{lang==="am"?"ፈልግ":"Search"}</button>
            </motion.div>
          </div>
          <div className="hero-car">
            <motion.img
              initial={{opacity:0,x:80,scale:.92}} animate={{opacity:1,x:0,scale:1}}
              transition={{duration:1.1,ease:[.22,1,.36,1]}}
              src={img("photo-1503736334956-4c8f8e92946d",42)}
              alt="Premium vehicle"
            />
            <div className="car-orbit one"/><div className="car-orbit two"/>
          </div>
          <div className="scroll-hint">SCROLL <span/></div>
        </section>

        <section className="trust">
          {[
            [ShieldCheck,"ተመረጡ መኪናዎች","Curated inventory"],
            [Check,"ግልጽ ዋጋ","Transparent pricing"],
            [Zap,"ፈጣን ምላሽ","Fast response"],
            [Star,"ደንበኛ ቅድሚያ","Customer first"]
          ].map(([Icon,am,en]:any)=><div key={am}><Icon size={22}/><span><b>{lang==="am"?am:en}</b><small>{lang==="am"?en:am}</small></span></div>)}
        </section>

        <section id="inventory" className="section">
          <div className="section-head">
            <div><span className="eyebrow">MIKLOR SELECT</span><h2>{t.inventory}</h2></div>
            <div className="count">{filtered.length} / 50 <span>{lang==="am"?"መኪና":"cars"}</span></div>
          </div>

          <div className="filters">
            <div className="filter-scroll">
              <div className="filter-label"><Filter size={16}/>{t.filter}</div>
              {types.map(x=><button className={type===x?"active":""} onClick={()=>setType(x)} key={x}>{x}</button>)}
            </div>
            <div className="filter-row">
              <label>Make<select value={make} onChange={e=>setMake(e.target.value)}>{makes.map(x=><option key={x}>{x}</option>)}</select></label>
              <label className="range-label">Max <b>{money(maxPrice)} ETB</b><input type="range" min="2000000" max="10000000" step="100000" value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)}/></label>
            </div>
          </div>

          <motion.div layout className="grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((v,i)=><motion.article key={v.id} layout initial={{opacity:0,scale:.96,y:18}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.96}} transition={{duration:.32,delay:i*.025}} className="card">
                <div className="card-img">
                  <img src={v.image} alt={`${v.year} ${v.make} ${v.model}`} loading="lazy"/>
                  <div className="image-overlay"/>
                  <span className="stock"><span/> {v.badge || (lang==="am"?"ዝግጁ":"Available")}</span>
                  <button className={"heart "+(favorites.includes(v.id)?"liked":"")} onClick={()=>toggleFavorite(v.id)}><Heart size={18} fill={favorites.includes(v.id)?"currentColor":"none"}/></button>
                  <div className="spec-float"><span>{v.year}</span><span>{v.drive}</span><span>{v.fuel}</span></div>
                </div>
                <div className="card-body">
                  <div className="make">{v.make}</div>
                  <h3>{v.model}</h3>
                  <p>{v.mileage} · {v.type}</p>
                  <div className="price-row"><strong>{money(v.price)} <small>ETB</small></strong><button onClick={()=>setSelected(v)}>{t.details}<ArrowRight size={15}/></button></div>
                </div>
              </motion.article>)}
            </AnimatePresence>
          </motion.div>
          {!filtered.length && <div className="empty"><SlidersHorizontal size={34}/><h3>{lang==="am"?"የፈለጉት መኪና አልተገኘም":"No matching vehicles"}</h3><button className="btn primary" onClick={()=>{setType("All");setMake("All");setMaxPrice(10000000);setSearch("")}}>Reset filters</button></div>}
        </section>

        <section id="about" className="finance section">
          <div className="finance-copy">
            <span className="eyebrow">{t.finance}</span>
            <h2>{t.financeTitle}</h2>
            <p>{lang==="am"?"የመኪናውን ዋጋ፣ ቅድመ ክፍያ እና የክፍያ ጊዜ በመቀየር ግምታዊ ወርሃዊ ክፍያዎን ይመልከቱ።":"Adjust vehicle price, down payment and term to see an estimated monthly payment instantly."}</p>
            <ul><li><Check/> 36 / 48 / 60 / 72 months</li><li><Check/> የራስዎን ቅድመ ክፍያ ያስገቡ</li><li><Check/> Estimate only — subject to lender approval</li></ul>
          </div>
          <div className="calculator">
            <div className="calc-top"><span>ESTIMATED MONTHLY</span><strong>{money(monthly)} <small>ETB</small></strong><p>በወር · {term} months</p></div>
            <CalcSlider label="Vehicle price" value={paymentPrice} min={2000000} max={10000000} step={100000} onChange={setPaymentPrice} suffix=" ETB"/>
            <CalcSlider label="Down payment" value={down} min={0} max={3000000} step={50000} onChange={setDown} suffix=" ETB"/>
            <div className="term"><span>Term</span><div>{[36,48,60,72].map(n=><button className={term===n?"active":""} onClick={()=>setTerm(n)} key={n}>{n}</button>)}</div></div>
            <p className="calc-note">* Example estimate at 10.8% monthly-equivalent model. Actual rates and fees vary by lender.</p>
          </div>
        </section>

        <section id="services" className="services section">
          <div className="section-head"><div><span className="eyebrow">WHY MIKLOR</span><h2>{lang==="am"?"መኪና መግዛት ቀላል እናደርገዋለን":"A simpler way to buy"}</h2></div></div>
          <div className="service-grid">
            {[
              [Search,"ፈልግ","Search & filter","በብራንድ፣ በአይነት እና በዋጋ መኪናዎን ያግኙ።"],
              [CarFront,"ይመልከቱ","See the car","ፎቶዎችን፣ ኪሎሜትር እና ዝርዝር መረጃ ይመልከቱ።"],
              [MessageCircle,"ያነጋግሩ","Talk to us","በWhatsApp ወይም Telegram በቀጥታ ያነጋግሩን።"]
            ].map(([Icon,title,en,desc]:any,i)=><motion.div className="service" whileHover={{y:-6}} key={title}><span className="service-num">0{i+1}</span><Icon size={30}/><h3>{lang==="am"?title:en}</h3><p>{desc}</p><a href="#contact">{lang==="am"?"ተጨማሪ":"Learn more"} <ArrowRight size={15}/></a></motion.div>)}
          </div>
        </section>

        <section className="cta" id="contact">
          <div><span className="eyebrow">MIKLOR CAR SELLERS · ADDIS ABABA</span><h2>{lang==="am"?"ቀጣዩ መኪናዎ እዚህ አለ።":"Your next car is here."}</h2><p>22 ፌስቲቫል አጠገብ · Addis Ababa</p></div>
          <div className="cta-buttons"><a className="btn white" href="https://wa.me/251922322507"><MessageCircle/> WhatsApp</a><a className="btn outline-white" href="https://t.me/Abi27j"><Send/> Telegram</a><a className="phone" href="tel:0922322507">0922 32 25 07</a></div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><div className="brand"><span className="brand-mark"><CarFront size={20}/></span><span><b>MIKLOR</b><small>CAR SELLERS</small></span></div><p>New & pre-owned vehicles · Addis Ababa, Ethiopia</p></div>
        <div><b>Contact</b><a href="tel:0922322507">0922 32 25 07</a><a href="https://wa.me/251922322507">WhatsApp</a><a href="https://t.me/Abi27j">Telegram · Abi27j</a></div>
        <div><b>Location</b><span>22 ፌስቲቫል አጠገብ</span><span>Addis Ababa, Ethiopia</span><span>Open daily</span></div>
        <div><b>Quick links</b><a href="#inventory">Inventory</a><a href="#about">Payment calculator</a><a href="#services">Services</a></div>
        <div className="copyright">© 2026 Miklor Car Sellers. All rights reserved.</div>
      </footer>

      <AnimatePresence>
        {selected && <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}>
          <motion.div className="modal" initial={{opacity:0,y:30,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:30}} onClick={e=>e.stopPropagation()}>
            <button className="close" onClick={()=>setSelected(null)}><X/></button>
            <img src={selected.image} alt={selected.model}/>
            <div className="modal-info"><span className="eyebrow">{selected.make} · {selected.year}</span><h2>{selected.model}</h2><div className="modal-price">{money(selected.price)} ETB</div><div className="modal-specs"><span><Gauge/> {selected.mileage}</span><span><CarFront/> {selected.drive}</span><span><Zap/> {selected.fuel}</span></div><a className="btn primary full" href={`https://wa.me/251922322507?text=Hello%20Miklor%2C%20I%20am%20interested%20in%20the%20${selected.year}%20${selected.make}%20${selected.model}.`}>{t.contact} <MessageCircle size={18}/></a></div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

function CalcSlider({label,value,min,max,step,onChange,suffix}:{label:string,value:number,min:number,max:number,step:number,onChange:(n:number)=>void,suffix:string}) {
  const pct=((value-min)/(max-min))*100;
  return <label className="calc-slider"><div><span>{label}</span><b>{money(value)}{suffix}</b></div><input type="range" min={min} max={max} step={step} value={value} style={{"--pct":`${pct}%`} as React.CSSProperties} onChange={e=>onChange(+e.target.value)}/></label>
}

createRoot(document.getElementById("root")!).render(<App />);
