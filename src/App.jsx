import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import "./App.css";

/* =========================================================================
   1. کامپوننت‌های اختصاصی REACT BITS (reactbits.dev)
   ========================================================================= */

// 1. Squares Background (React Bits: Backgrounds)
function Squares({
  direction = "diagonal",
  speed = 0.5,
  borderColor = "rgba(255, 255, 255, 0.05)",
  squareSize = 45,
  hoverFillColor = "rgba(56, 189, 248, 0.12)",
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let gridOffset = { x: 0, y: 0 };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      gridOffset.x = (gridOffset.x + speed) % squareSize;
      gridOffset.y = (gridOffset.y + speed) % squareSize;

      const numCols = Math.ceil(canvas.width / squareSize) + 1;
      const numRows = Math.ceil(canvas.height / squareSize) + 1;

      for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
          const x = i * squareSize - gridOffset.x;
          const y = j * squareSize - gridOffset.y;

          const dist = Math.hypot(
            mouseRef.current.x - (x + squareSize / 2),
            mouseRef.current.y - (y + squareSize / 2)
          );

          if (dist < 120) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, squareSize, borderColor, hoverFillColor]);

  return <canvas ref={canvasRef} className="reactbits-squares-canvas" />;
}

// 2. ClickSpark (React Bits: Animations)
function ClickSpark({
  sparkColor = "#38bdf8",
  sparkSize = 9,
  sparkCount = 8,
  duration = 450,
}) {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const newSparks = Array.from({ length: sparkCount }).map((_, i) => ({
        id: Math.random() + Date.now(),
        x: e.clientX,
        y: e.clientY,
        angle: (i * (360 / sparkCount) * Math.PI) / 180,
      }));

      setSparks((prev) => [...prev, ...newSparks]);
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !newSparks.includes(s)));
      }, duration);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [sparkCount, duration]);

  return (
    <div className="click-spark-container">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="spark-particle"
          style={{
            left: spark.x,
            top: spark.y,
            backgroundColor: sparkColor,
            "--spark-angle": `${spark.angle}rad`,
            width: `${sparkSize}px`,
            height: `${sparkSize}px`,
          }}
        />
      ))}
    </div>
  );
}

// 3. DecryptedText (React Bits: Text Animations)
function DecryptedText({
  text,
  speed = 45,
  maxIterations = 14,
  className = "",
  animateOn = "hover",
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const chars = "01#$*+~XYZ_%&[]{}!@";

  useEffect(() => {
    if (!isHovered && animateOn === "hover") {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / (maxIterations / text.length);
    }, speed);

    return () => clearInterval(interval);
  }, [isHovered, text, speed, maxIterations, animateOn]);

  return (
    <span
      className={`reactbits-decrypted-text ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </span>
  );
}

// 4. ShinyText (React Bits: Text Animations)
function ShinyText({ text, speed = 3, className = "" }) {
  return (
    <span
      className={`reactbits-shiny-text ${className}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}

// 5. SpotlightCard (React Bits: Components)
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(56, 189, 248, 0.18)",
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`reactbits-spotlight-card ${className}`}
      {...props}
    >
      <div
        className="spotlight-overlay"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />
      {children}
    </div>
  );
}

// 6. Magnet (React Bits: Animations)
function Magnet({
  children,
  magnetStrength = 0.25,
  className = "",
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * magnetStrength);
    y.set((e.clientY - centerY) * magnetStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`reactbits-magnet ${className}`}
    >
      {children}
    </motion.div>
  );
}

// 7. StarBorder (React Bits: Animations)
function StarBorder({
  as: Component = "button",
  className = "",
  color = "#38bdf8",
  speed = "4s",
  children,
  ...props
}) {
  return (
    <Component className={`star-border-container ${className}`} {...props}>
      <div
        className="star-border-glow"
        style={{
          background: `radial-gradient(circle, ${color} 15%, transparent 60%)`,
          animationDuration: speed,
        }}
      />
      <div className="star-border-inner">{children}</div>
    </Component>
  );
}

/* =========================================================================
   2. داده‌های پروژه
   ========================================================================= */

const PROJECTS_DATA = [
  {
    id: 1,
    category: "شبکه",
    title: "طراحی و راه‌اندازی شبکه چندشعبه‌ای امن",
    desc: "پیاده‌سازی ارتباط پایدار بین شعب با تانل‌های WireGuard، روتینگ BGP و فایروالینگ لایه ۷.",
    details: "کاهش تاخیر بین شعب تا ۳۵٪ و تضمین پایداری ۳۶۵ روزه بدون قطعی در زیرساخت اداری دانشگاه.",
    tech: ["MikroTik", "WireGuard", "BGP", "VLANs"],
    icon: "🌐",
  },
  {
    id: 2,
    category: "مجازی‌سازی",
    title: "خوشه‌بندی Proxmox و ذخیره‌ساز Ceph",
    desc: "ایجاد کلاستر سرور High-Availability با قابلیت خودکار Failover بدون قطعی در سرویس‌های حیاتی.",
    details: "استوریج کلاستر ۳ گره‌ای تمام NVMe با سیستم مانیتورینگ خودکار سلامت دیسک‌ها و بکاپ‌گیری دوره‌ای ZFS.",
    tech: ["Proxmox VE", "Ceph Storage", "SAN Fabric", "ZFS"],
    icon: "⚡",
  },
  {
    id: 3,
    category: "مانیتورینگ",
    title: "سامانه یکپارچه پایش دیتاسنتر",
    desc: "داشبوردهای بلادرنگ برای پایش مصرف ترافیک، بار سوئیچ‌ها و ارسال آلارم خودکار تلگرامی/پیامکی.",
    details: "جمع‌آوری متریک‌ها با دقت ثانیه‌ای از بیش از ۱۲۰ سرور فیزیکی و مجازی به همراه لاگ‌گیری متمرکز ELK.",
    tech: ["Prometheus", "Grafana", "Zabbix", "Python Bot"],
    icon: "📊",
  },
  {
    id: 4,
    category: "دواپس",
    title: "پایپ‌لاین استقرار خودکار و K8s",
    desc: "خط استقرار خودکار کانتینرها به همراه اتوماسیون وظایف مدیریت شبکه با Ansible.",
    details: "کاهش زمان دیپلوی سرویس‌ها از ۴ ساعت به زیر ۳ دقیقه با قابلیت رول‌بک فوری بدون اختلال.",
    tech: ["Docker", "Kubernetes", "Ansible", "GitLab CI"],
    icon: "☁️",
  },
];

/* =========================================================================
   3. صفحه اصلی (APP)
   ========================================================================= */

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const [activeFilter, setActiveFilter] = useState("همه");
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);

  // ترمینال لینوکس
  const [terminalOutput, setTerminalOutput] = useState([
    { text: "sara@sys:~$ init-datacenter --full-check", type: "cmd" },
    { text: "[OK] Core BGP Sessions: Established", type: "success" },
    { text: "[OK] Ceph Cluster: HEALTH_OK (45 TB available)", type: "info" },
  ]);
  const [cmdInput, setCmdInput] = useState("");

  const handleCommand = (e) => {
    if (e.key === "Enter" && cmdInput.trim()) {
      const cmd = cmdInput.trim().toLowerCase();
      let res = { text: `bash: ${cmd}: command not found (try: help, ping, status, whoami)`, type: "error" };

      if (cmd === "help") res = { text: "دستورات مجاز: status, ping, uptime, whoami, clear", type: "info" };
      else if (cmd === "ping") res = { text: "64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=0.82 ms", type: "success" };
      else if (cmd === "status") res = { text: "وضعیت: کلیه سوئیچ‌ها، فایروال و هاست‌ها با پایداری ۱۰۰٪ فعال هستند.", type: "success" };
      else if (cmd === "uptime") res = { text: "up 540 days, load average: 0.10, 0.08, 0.04", type: "info" };
      else if (cmd === "whoami") res = { text: "سارا هاشمی | مدیر و سرپرست ارشد زیرساخت شبکه و دواپس", type: "success" };
      else if (cmd === "clear") {
        setTerminalOutput([]);
        setCmdInput("");
        return;
      }

      setTerminalOutput((prev) => [...prev, { text: `sara@sys:~$ ${cmdInput}`, type: "cmd" }, res]);
      setCmdInput("");
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("sarahashemi.f@email.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredProjects =
    activeFilter === "همه"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  // افکت ۳ بعدی کارت هیرو
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-100, 100], [14, -14]);
  const rotateY = useTransform(cardX, [-100, 100], [-14, 14]);

  return (
    <div className="website">
      {/* کامپوننت ۱: پس‌زمینه تعاملی شبکه REACT BITS */}
      <Squares speed={0.4} squareSize={48} />

      {/* کامپوننت ۲: جرقه‌های انفجاری کلیک REACT BITS */}
      <ClickSpark sparkColor="#38bdf8" sparkCount={9} />

      {/* نوار پیشرفت مطالعه */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* هاله‌های نوری */}
      <div className="glow-bg glow-1"></div>
      <div className="glow-bg glow-2"></div>

      {/* منوی ناوبری */}
      <nav>
        <div className="menu">
          <a href="#home">خانه</a>
          <a href="#about">درباره</a>
          <a href="#skills">مهارت‌ها</a>
          <a href="#projects">پروژه‌ها</a>
          <a href="#terminal">ترمینال زنده</a>
          <a href="#contact">ارتباط</a>
        </div>

        {/* کامپوننت ۳: مگنت روی دکمه همکاری REACT BITS */}
        <Magnet magnetStrength={0.3}>
          <a href="#contact" className="nav-btn">
            همکاری با من
          </a>
        </Magnet>
      </nav>

      {/* بخش هیرو */}
      <section id="home" className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="status-badge">
            <span className="pulse-dot"></span>
            {/* کامپوننت ۴: متن درخشان REACT BITS */}
            <ShinyText text="آماده برای فرصت‌های شغلی و پروژه‌های زیرساخت ابری" speed={3} />
          </div>

          <p className="hello">سلام، من</p>
          <h1>
            سارا <span className="gradient-text">هاشمی</span> هستم
          </h1>

          <h2 className="role">
            {/* کامپوننت ۵: دیکریپت متن روی عنوان REACT BITS */}
            <DecryptedText
              text="سرپرست ارشد شبکه و زیرساخت IT"
              speed={40}
              className="highlight-role"
            />
          </h2>

          <p className="hero-description">
            بیش از ۱۵ سال سابقه در طراحی معماری شبکه‌های گسترده، پیاده‌سازی کلاسترهای مجازی‌سازی، ذخیره‌سازهای SAN و اتوماسیون سرویس‌ها. متعهد به آپ‌تایم حداکثری و امنیت لایه‌بندی‌شده.
          </p>

          <div className="hero-actions">
            {/* کامپوننت ۶: دکمه استاربوردر REACT BITS */}
            <StarBorder
              as="a"
              href="#projects"
              color="#6366f1"
              speed="3.5s"
              className="primary-star-btn"
            >
              مشاهده پروژه‌ها
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </StarBorder>

            <Magnet magnetStrength={0.25}>
              <a href="#contact" className="secondary-btn">
                دریافت رزومه
              </a>
            </Magnet>
          </div>

          {/* آمار هیرو */}
          <div className="hero-stats">
            {[
              { num: "+۱۵", label: "سال سابقه تخصصی" },
              { num: "+۵۰", label: "پروژه و سرور فعال" },
              { num: "۹۹.۹۹٪", label: "تضمین پایداری شبکه" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="stat-item"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="stat-num">{stat.num}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* گرافیک هیرو */}
        <div className="hero-image-wrapper">
          <div className="orbit-ring"></div>
          <div className="orbit-ring ring-2"></div>

          <motion.div
            className="avatar-card"
            style={{ rotateX, rotateY }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              cardX.set(e.clientX - rect.left - rect.width / 2);
              cardY.set(e.clientY - rect.top - rect.height / 2);
            }}
            onMouseLeave={() => {
              cardX.set(0);
              cardY.set(0);
            }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="terminal-badge">NetOps & DevOps Lead</div>

            <div className="avatar-circle">
              <span className="avatar-initials">SH</span>
            </div>

            <motion.div
              className="tech-badge badge-1"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ☁️ Cloud / Kubernetes
            </motion.div>

            <motion.div
              className="tech-badge badge-2"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            >
              🔒 Cisco / MikroTik
            </motion.div>

            <div className="live-ping-box">
              <span className="live-status-dot"></span>
              سیستم: آنلاین (Latency: 0.9ms)
            </div>
          </motion.div>
        </div>
      </section>

      {/* بخش درباره من */}
      <section id="about" className="section">
        <div className="section-header">
          <ShinyText text="بیوگرافی" className="section-subtitle" />
          <h2>سوابق حرفه‌ای و رهبری تیم</h2>
        </div>

        <div className="about-grid">
          {/* کامپوننت ۷: اسپات‌لایت کارت روی درباره من REACT BITS */}
          <SpotlightCard className="about-text-card">
            <p>
              بیش از <strong>۱۵ سال</strong> سابقه فعالیت و دانش عمیق در زمینه زیرساخت فناوری اطلاعات و مدیریت شبکه دارم و در حوزه‌هایی همچون مجازی‌سازی، ذخیره‌سازی SAN، تجهیزات سوئیچینگ لایه ۳، فایروال‌ها و سرویس‌های مایکروسافت تخصص دارم.
            </p>
            <p>
              بیش از <strong>۱۲ سال</strong> است که در واحد فناوری اطلاعات دانشگاه صنعتی همدان مسئولیت هدایت و سرپرستی تیم را بر عهده دارم.
            </p>
            <p>
              روحیه کار تیمی، مسئولیت‌پذیری در حوادث اضطراری دیتاسنتر (Disaster Recovery) و اشتیاق همیشگی به یادگیری آخرین استانداردهای لینوکس و دواپس از ارکان رویکرد مهندسی من است.
            </p>
          </SpotlightCard>

          <div className="about-highlights">
            {[
              { icon: "⚡", title: "عملکرد و پایداری", desc: "حداکثر کارایی با حداقل لیتنسی در لایه‌های شبکه و دیتاسنتر" },
              { icon: "🛡️", title: "امنیت داده و شبکه", desc: "پیاده‌سازی زون‌بندی امنیتی فایروال و استانداردهای لایه‌بندی شده" },
              { icon: "🔄", title: "کلاسترینگ و HA", desc: "طراحی زیرساخت بدون نقطه شکست منفرد (No SPOF)" },
            ].map((box, i) => (
              <SpotlightCard key={i} className="highlight-box">
                <div className="icon">{box.icon}</div>
                <div>
                  <h4>{box.title}</h4>
                  <p>{box.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* بخش مهارت‌ها با SpotlightCard های REACT BITS */}
      <section id="skills" className="section">
        <div className="section-header">
          <ShinyText text="جعبه‌ابزار تخصصی" className="section-subtitle" />
          <h2>مهارت‌های فنی</h2>
        </div>

        <div className="skills-container">
          {[
            { icon: "🌐", title: "شبکه و روتینگ", tags: ["Cisco CCNA/CCNP", "MikroTik", "BGP / OSPF", "VLANs", "WireGuard"], level: 95 },
            { icon: "🖥️", title: "سرور و مجازی‌سازی", tags: ["Proxmox VE", "VMware ESXi", "SAN Storage", "Linux RHEL/Ubuntu"], level: 92 },
            { icon: "🛡️", title: "امنیت و فایروال", tags: ["Fortinet", "pfSense", "WAF", "Hardening", "ACLs"], level: 90 },
            { icon: "☁️", title: "دواپس و کلاود", tags: ["Docker", "Kubernetes", "Ansible", "CI/CD", "Git"], level: 82 },
            { icon: "📊", title: "مانیتورینگ و لاگ", tags: ["Zabbix", "Grafana", "Prometheus", "SNMP", "ELK Stack"], level: 94 },
            { icon: "🐍", title: "اسکریپت و اتوماسیون", tags: ["Python Scripting", "Bash", "REST APIs", "PowerShell"], level: 85 },
          ].map((skill, index) => (
            <SpotlightCard key={index} className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">{skill.icon}</span>
                <h3>{skill.title}</h3>
              </div>

              <div className="skill-progress-wrap">
                <div className="skill-progress-meta">
                  <span>میزان تسلط</span>
                  <span>%{skill.level}</span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="tags-cloud">
                {skill.tags.map((t, ti) => (
                  <span key={ti} className="pill-tag">{t}</span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* بخش پروژه‌ها با فیلتر تب‌ها و مودال */}
      <section id="projects" className="section">
        <div className="section-header">
          <ShinyText text="دستاوردهای اخیر" className="section-subtitle" />
          <h2>پروژه‌های شاخص</h2>
        </div>

        {/* فیلترها با افکت آهنربایی مگنت */}
        <div className="filter-tabs">
          {["همه", "شبکه", "مجازی‌سازی", "مانیتورینگ", "دواپس"].map((tab) => (
            <Magnet key={tab} magnetStrength={0.2}>
              <button
                onClick={() => setActiveFilter(tab)}
                className={`filter-btn ${activeFilter === tab ? "active" : ""}`}
              >
                {tab}
                {activeFilter === tab && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="active-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </Magnet>
          ))}
        </div>

        {/* کارت‌های پروژه با اسپات‌لایت */}
        <motion.div layout className="projects-grid">
          <AnimatePresence>
            {filteredProjects.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
              >
                <SpotlightCard className="project-card">
                  <div className="project-top">
                    <span className="project-tag">{item.category}</span>
                    <span className="project-icon">{item.icon}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>

                  <div className="tech-stack">
                    {item.tech.map((t, idx) => (
                      <span key={idx}>{t}</span>
                    ))}
                  </div>

                  <button
                    className="view-project-btn"
                    onClick={() => setSelectedProject(item)}
                  >
                    مشاهده معماری و جزئیات ←
                  </button>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* مودال پروژه */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.88, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <span className="project-tag">{selectedProject.category}</span>
                <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
              </div>
              <h2>{selectedProject.title}</h2>
              <p className="modal-desc">{selectedProject.desc}</p>
              
              <div className="architecture-note">
                <strong>نتایج پیاده‌سازی و جزئیات معماری:</strong>
                <p>{selectedProject.details}</p>
              </div>

              <div className="tech-stack" style={{ marginTop: "18px" }}>
                {selectedProject.tech.map((t, idx) => (
                  <span key={idx} className="pill-tag">{t}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* کنسول زنده شبکه */}
      <section id="terminal" className="section">
        <div className="section-header">
          <ShinyText text="ترمینال زنده" className="section-subtitle" />
          <h2>کنسول دیتاسنتر</h2>
          <p style={{ color: "var(--text-dim)", marginTop: "6px" }}>
            دستوراتی چون <code>status</code>، <code>ping</code>، <code>uptime</code> یا <code>help</code> را امتحان کنید:
          </p>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="terminal-title">admin@sara-datacenter:~ (bash)</div>
          </div>

          <div className="terminal-body">
            {terminalOutput.map((line, idx) => (
              <div key={idx} className={`term-line ${line.type}`}>
                {line.text}
              </div>
            ))}
            <div className="term-input-row">
              <span className="term-prompt">sara@sys:~$</span>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                onKeyDown={handleCommand}
                placeholder="دستور را وارد کنید و اینتر بزنید..."
                className="term-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* بخش تماس */}
      <section id="contact" className="section">
        <div className="contact-box">
          <div className="section-header">
            <ShinyText text="شروع گفتگو" className="section-subtitle" />
            <h2>ارتباط با من</h2>
            <p>آماده همکاری در پروژه‌های بهینه‌سازی زیرساخت، مشاوره امنیت شبکه و موقعیت‌های سرپرستی تیم.</p>
          </div>

          <div className="contact-cards">
            {/* کارت مگنتی کپی ایمیل */}
            <Magnet magnetStrength={0.3}>
              <div className="contact-card interactive" onClick={copyEmail}>
                <span className="c-icon">✉️</span>
                <span className="c-title">ایمیل (کلیک برای کپی سریع)</span>
                <span className="c-value">sarahashemi.f@email.com</span>
                {copied && <span className="copy-toast">کپی شد! ✓</span>}
              </div>
            </Magnet>

            <Magnet magnetStrength={0.3}>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-card">
                <span className="c-icon">💼</span>
                <span className="c-title">لینکدین</span>
                <span className="c-value">sarahashemifarhoud/</span>
              </a>
            </Magnet>

            <Magnet magnetStrength={0.3}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-card">
                <span className="c-icon">🐙</span>
                <span className="c-title">گیت‌هاب</span>
                <span className="c-value">github.com/sara</span>
              </a>
            </Magnet>
          </div>
        </div>
      </section>

      {/* فوتر */}
      <footer>
        <p>طراحی و توسعه: سارا هاشمی • سرپرست ارشد شبکه و فناوری اطلاعات</p>
      </footer>
    </div>
  );
}