import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/jsenewlogoblack.png";

// Navigation items
const navItems = ["Home", "Features", "Pricing", "FAQs", "Contact us"];

// Hook to detect screen size
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
};

// Animation variants
const navVariants = {
  open: {
    transition: {
      staggerChildren: 0.03,  // less gap between menu items
      delayChildren: 0.05,    // fast start
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};


const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};


const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 850px)");

  return (
    <nav className="fixed top-0 left-0 w-full bg-white px-6 py-4 flex items-center justify-between z-[50]">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0">
        <img src={logo} alt="Logo" className="w-24 h-9 object-cover" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden min-[851px]:flex flex-grow justify-center">
        <ul className="flex space-x-6 text-gray-800 ms-28 font-Manrope font-medium">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <a
                href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                className="group relative font-medium transition-colors duration-300"
              >
                <span className="font-semibold  group-hover:text-[#2c6472]">
                  {item}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#2c6472] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden min-[851px]:flex items-center gap-3 flex-shrink-0">
        <Link to="/user/signup">
          <button className="border border-[#2c6472] text-[#2c6472] px-6 py-2 rounded-full font-medium hover:bg-[#25545f]/5 transition duration-300">
            Sign Up
          </button>
        </Link>
        <Link to="/user/login">
          <button className="bg-[#2c6472] text-white px-6 py-2 rounded-full font-medium hover:bg-[#25545f] transition duration-300">
            Login
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="min-[851px]:hidden relative z-[60]">
        <button onClick={() => setIsOpen(!isOpen)} className="text-[#2c6472]">
          <svg width="23" height="23" viewBox="0 0 23 23">
            <motion.path
              fill="transparent"
              strokeWidth="3"
              stroke="#2c6472"
              strokeLinecap="round"
              variants={{
                closed: { d: "M 2 2.5 L 20 2.5" },
                open: { d: "M 3 16.5 L 17 2.5" },
              }}
              animate={isOpen ? "open" : "closed"}
            />
            <motion.path
              d="M 2 9.423 L 20 9.423"
              stroke="#2c6472"
              strokeWidth="3"
              strokeLinecap="round"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              animate={isOpen ? "open" : "closed"}
              transition={{ duration: 0.1 }}
            />
            <motion.path
              fill="transparent"
              strokeWidth="3"
              stroke="#2c6472"
              strokeLinecap="round"
              variants={{
                closed: { d: "M 2 16.346 L 20 16.346" },
                open: { d: "M 3 2.5 L 17 16.346" },
              }}
              animate={isOpen ? "open" : "closed"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={isOpen ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-lg z-40"
        >
          <motion.ul
            className="flex flex-col gap-6 text-left text-gray-800 font-Manrope font-medium mt-24 px-6"
            variants={navVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
          >
            {navItems.map((item, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </motion.ul>
          <div className="mt-10 flex flex-col gap-4 px-6">
            <Link to="/user/signup">
              <button className="w-full border border-[#2c6472] text-[#2c6472] px-6 py-2 rounded-full font-medium hover:bg-[#25545f]/5 transition duration-300">
                Sign Up
              </button>
            </Link>
            <Link to="/user/login">
              <button className="w-full bg-[#2c6472] text-white py-2 rounded-full font-medium hover:bg-[#25545f] transition duration-300">
                Login
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default LandingNavbar;
