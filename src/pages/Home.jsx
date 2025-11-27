import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaStar,
  FaUsers,
  FaSoap,
  FaTractor,
  FaTools,
  FaShower,
  FaWarehouse,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdLocalLaundryService, MdCleaningServices } from "react-icons/md";
import { GiPlatform  } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Layout from "../components/Layout/Layout";
// New railway-themed palette and assets
const images = [
  {
    src: "https://i.ytimg.com/vi/M_KwO1fMeHg/maxresdefault.jpg",
    text: "Railway Cleaning & Onboard Housekeeping",
  },
  {
    src: "https://bsmedia.business-standard.com/_media/bs/img/article/2024-10/23/full/1729660159-8604.jpg?im=FeatureCrop,size=(826,465)",
    text: "Mechanized Laundry & Bedsheet Management",
  },
  {
    src: "https://blog-content.ixigo.com/wp-content/uploads/2017/04/blog3.jpg",
    text: "Bio-Toilet Maintenance & Pit/Yard Cleaning",
  },
  {
    src: "https://images.hindustantimes.com/rf/image_size_800x600/HT/p2/2015/08/12/Incoming/Pictures/sealdah-railway-station-kolkata_06912819-41af-11e5-a8da-005056b4648e.jpg",
    text: "PFTR & Quick Turnaround Platform Services",
  },
];

const services = [
  {
    id: "railway-clean",
    title: "Platform & Coach Cleaning",
    desc: "End-to-end platform and coach cleaning with trained staff and SOP-driven checklists.",
    icon: MdCleaningServices,
  },
  {
    id: "laundry",
    title: "Mechanized Laundry",
    desc: "High-capacity mechanized laundry for linens, bedsheets and uniforms with quality control.",
    icon: MdLocalLaundryService,
  },
  {
    id: "bedsheet",
    title: "Bedsheet & Linen Management",
    desc: "Inventory, rotation and hygienic processing of linens for hotels and rail rakes.",
    icon: FaSoap,
  },
  {
    id: "bio-toilet",
    title: "Bio-Toilet Maintenance",
    desc: "Routine maintenance and safe disposal services for bio-toilets on coaches and yards.",
    icon: GiPlatform,
  },
  {
    id: "pit-yard",
    title: "Pit & Yard Services",
    desc: "Pit cleaning, washing lines, and yard maintenance using modern equipment.",
    icon: FaWarehouse,
  },
  {
    id: "pftr",
    title: "PFTR (Platform Turn Round)",
    desc: "Quick platform turnaround checks and readiness for short-turnaround trains.",
    icon: GiPlatform,
  },
];

const Home = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      const { role } = auth.user;
      if (role === 2) navigate("/dashboard/admin");
      else if (role === 3) navigate("/dashboard/manager");
      else {
        setAuth({ user: null, token: "" });
        localStorage.removeItem("auth");
        navigate("/login");
      }
    }
  }, [auth, navigate, setAuth]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const satisfactionPercentage = 98;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    AOS.init({ duration: 900, once: true });
    return () => clearInterval(interval);
  }, []);

  // Animated Counters
  const workers = useSpring({ number: 120, from: { number: 0 }, config: { duration: 2000 } });
  const workDone = useSpring({ number: 600, from: { number: 0 }, config: { duration: 2000 } });
  const clients = useSpring({ number: 180, from: { number: 0 }, config: { duration: 2000 } });
  const states = useSpring({ number: 15, from: { number: 0 }, config: { duration: 2000 } });

  // Testimonials (kept short and rail-themed)
  const testimonials = [
    {
      name: "Station Master - Rajkot",
      review: "Tharu & Sons transformed our platform cleanliness metrics — punctual, disciplined and consistent.",
      rating: 5,
    },
    {
      name: "Hotel Manager - Trivandrum",
      review: "Excellent linen management and quick turnaround. Our guests noticed the difference.",
      rating: 5,
    },
    {
      name: "Depot Supervisor - Bengaluru",
      review: "Pit and yard services are top-quality; equipment and team are professional.",
      rating: 4,
    },
  ];

  const testimonialContainerRef = useRef(null);

  useEffect(() => {
    const container = testimonialContainerRef.current;
    let scrollPosition = 0;
    const scrollTestimonials = () => {
      if (container) {
        scrollPosition += 340;
        if (scrollPosition >= container.scrollWidth - container.clientWidth) scrollPosition = 0;
        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    };
    const interval = setInterval(scrollTestimonials, 3500);
    return () => clearInterval(interval);
  }, [testimonials]);

  const faqs = [
    {
      question: "What services do you offer for railways?",
      answer: "Full suite including platform & coach cleaning, mechanized laundry, bedsheet management, bio-toilet maintenance, pit & yard services, and PFTR checks.",
    },
    {
      question: "Do you handle short-turnaround (PFTR) trains?",
      answer: "Yes — PFTR refers to Platform Turn Round checks for trains with very short turnaround times. We provide quick readiness checks to ensure trains depart on time.",
    },
  ];

  return (
    <Layout title="Tharu & Sons">
      <div className="font-space-grotesk">
        {/* HERO SLIDER - railway themed */}
        <div className="relative w-full h-[80vh] sm:h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
          <motion.div
            key={currentIndex}
            className="flex h-full w-full"
            initial={{ x: 0 }}
            animate={{ x: -currentIndex * 100 + "%" }}
            transition={{ duration: 0.9 }}
          >
            {images.map((item, i) => (
              <div key={i} className="relative min-w-full h-full">
                <img src={item.src} alt={item.text} className="w-full h-full object-cover brightness-75" />
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-1/2 left-6 sm:left-12 transform -translate-y-1/2 text-white p-5 sm:p-8 md:p-10 bg-gradient-to-r from-slate-900/60 to-amber-900/20 rounded-lg border border-amber-400/20"
                >
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg leading-tight text-amber-300">
                    {item.text}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-200 mb-4 max-w-xl">
                    Reliable contracts for railways — scalable teams, certified processes, and accountable delivery.
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-amber-400 text-slate-900 font-semibold px-4 py-2 rounded shadow hover:scale-105 transition">
                      Learn More
                    </button>
                    <button
                      className="border border-amber-300 text-amber-200 px-4 py-2 rounded hover:bg-amber-500/10 transition"
                      onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
                    >
                      Our Services
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ABOUT SECTION */}
        <section className="container mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-8 text-center sm:text-left">
            About Tharu & Sons
          </h1>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-4">Serving Railways Since 1998</h2>
              <p className="text-slate-300 mb-6 leading-relaxed text-sm sm:text-base">
                We specialize in railway cleaning contracts — from mechanized laundries for rakes and hotels to pit & yard maintenance and PFTR readiness. Our processes are safety-first and audit-ready.
              </p>
              <div className="bg-amber-500/10 h-2 rounded-full overflow-hidden mb-6">
                <div className="bg-amber-400 h-full text-xs font-bold text-center" style={{ width: `${satisfactionPercentage}%` }}>
                  {satisfactionPercentage}%
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-slate-200">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-amber-300 text-2xl" />
                  <span className="text-sm sm:text-base">Trained Workforce</span>
                </div>
                <div className="flex items-center gap-2">
                  <IoMdTime className="text-amber-300 text-2xl" />
                  <span className="text-sm sm:text-base">On-Time Turnarounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTools className="text-amber-300 text-2xl" />
                  <span className="text-sm sm:text-base">Modern Equipment</span>
                </div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
              alt="Tharu & Sons team"
              className="rounded-lg shadow-lg w-full h-auto object-cover border-2 border-amber-400/10"
              data-aos="fade-up"
            />
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-slate-900/80 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 text-center mb-8">Our Railway Contracts & Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.id} data-aos="zoom-in" className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-400/10 rounded-lg shadow-lg">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-amber-400/10 rounded shadow-inner">
                        <Icon className="text-amber-300 text-2xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-amber-200">{s.title}</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">{s.desc}</p>
                    <div className="flex gap-3">
                      <button className="text-amber-300 border border-amber-300/20 px-3 py-2 rounded text-sm">Learn More</button>
                      <button className="bg-amber-400 text-slate-900 px-3 py-2 rounded text-sm">Request Quote</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROGRESS / METRICS */}
        <section className="bg-slate-800 py-10 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-6">Our Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 sm:px-8 container mx-auto">
            {[
              { label: "Workers", value: workers },
              { label: "Total Work", value: workDone },
              { label: "Clients", value: clients },
              { label: "States", value: states },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-900/60 rounded">
                <animated.h3 className="text-4xl sm:text-5xl w-full font-bold text-amber-400">{item.value.number.to((n) => Math.floor(n))}</animated.h3>
                <p className="text-slate-300 text-sm sm:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-gradient-to-br from-amber-50 to-slate-900/20 py-12 sm:py-16 px-4 sm:px-8 rounded-lg shadow-inner">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">What Our Clients Say</h1>
            <p className="text-slate-600 text-sm sm:text-base">Trusted by stations, depots and hotels across regions.</p>
          </div>
          <div ref={testimonialContainerRef} className="flex overflow-x-auto gap-4 sm:gap-6 snap-x scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-slate-200 px-2">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial bg-white p-6 sm:p-8 rounded-lg w-64 sm:w-80 snap-start text-center flex-shrink-0 shadow">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar key={idx} className={idx < t.rating ? "text-amber-400" : "text-slate-200"} />
                  ))}
                </div>
                <p className="italic mb-3 text-sm sm:text-base text-slate-700">{t.review}</p>
                <h2 className="font-semibold text-lg text-slate-900">{t.name}</h2>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-semibold text-amber-400 mb-8 text-center">Frequently Asked Questions</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-900/30 shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-bold text-amber-300 mb-2">{faq.question}</h3>
                <p className="text-slate-300 text-sm sm:text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Home;
