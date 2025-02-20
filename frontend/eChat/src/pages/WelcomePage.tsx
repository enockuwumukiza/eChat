import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaVideo, FaMicrophone, FaCommentDots, FaPhone } from "react-icons/fa";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <FaCommentDots className="text-5xl text-blue-500" />, 
    title: "Text Messaging",
    description: "SSend instant messages in real time with a smooth, fast chat experience."
  },
  {
    icon: <FaMicrophone className="text-5xl text-green-500" />, 
    title: "Voice Notes",
    description: "RRecord and send high-quality voice messages to your friends."
  },
  {
    icon: <FaVideo className="text-5xl text-red-500" />, 
    title: "Recorded Videos",
    description: "CCapture and share video messages effortlessly with friends."
  },
  {
    icon: <FaPhone className="text-5xl text-purple-500" />, 
    title: "Audio & Video Calls",
    description: "EEnjoy crystal-clear audio and video calls anytime, anywhere."
  }
];

const WelcomePage: React.FC = () => {
  const fullText = "Experience next-level real-time communication like never before!";
  const [displayedText, setDisplayedText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => (index < fullText.length ? prev + fullText[index] : prev));
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hoveredFeature !== null) {
      const fullDesc = features[hoveredFeature].description;
      let index = 0;
      setDescriptionText("");
      const interval = setInterval(() => {
        setDescriptionText((prev) => (index < fullDesc.length ? prev + fullDesc[index] : prev));
        index++;
        if (index >= fullDesc.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [hoveredFeature]);

  return (
    <div className="min-h-screen relative flex flex-col items-center lg:justify-center bg-slate-950 text-white pt-4 pb-4 md:pb-3 lg:pb-4 px-3 md:px-4 lg:px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide mb-4 drop-shadow-lg text-sky-400">Welcome to eChat</h1>
        <p className="text-lg h-5 md:h-7 lg:h-8 text-[17px] md:text-[23px] lg:text-[20px] font-serif">{displayedText}</p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="mt-24 md:mt-40 lg:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-8 lg:gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.5 },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
            className="relative flex flex-col items-center bg-white text-black rounded-xl shadow-xl p-6 w-[310px] md:w-[300px] h-[200px] md:h-[300px] lg:w-[200px] lg:h-[200px] cursor-pointer transition-all"
          >
            <div>{feature.icon}</div>
            <h3 className={`transform ${feature?.title === 'Text Messaging'? ' rotate-45 -translate-y-7 md:translate-y-0 lg:trnslate-y-0 -translate-x-7 md:translate-x-0 lg:-translate-x-2 ': feature?.title === 'Voice Notes' ? '-rotate-45 -translate-y-2 md:translate-y-0 lg:translate-y-0' : feature?.title === 'Recorded Videos'? 'rotate-45 -translate-y-5 md:translate-y-0 lg:translate-y-0 -translate-x-5 md:translate-x-0 lg:translate-x-0': feature?.title === 'Audio & Video Calls'? '-rotate-45 -translate-y-7 md:translate-y-0 lg:translate-y-0 translate-x-5 md:translate-0 lg:translate-x-0' :''} mt-4 text-[16px] font-bold top-0`}>{feature.title}</h3>

            {/* Hover Card Description */}
            {hoveredFeature === index && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 -top-[65%] md:-top-[40%] lg:-top-[80%] bg-gray-600 text-sky-400 font-bold px-4 py-2 rounded-md shadow-lg w-52"
              >
                {descriptionText}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="mt-12 flex gap-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <Button variant="contained" color="primary" className="bg-blue-600 px-6 py-2 shadow-lg hover:scale-105 transition-transform">
          <Link to={"/login"}>
            Login
          </Link>
        </Button>
        <Button variant="outlined" color="secondary" className="border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-all">
          <Link to={"/signup"}>
            Sign Up
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;

