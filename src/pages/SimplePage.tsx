import { useState, useEffect, useRef } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Sun, Moon, ArrowLeft, GitBranch, Link2, Mail, ExternalLink,
  Code2, Brain, Cpu, Terminal, Container, Globe, Eye, Zap,
  ChevronRight, Award, Briefcase, GraduationCap, User, Star
} from 'lucide-react';

interface SimplePageProps {
  onBack: () => void;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const roles = ['AI / ML Engineer', 'GenAI & RAG Builder', 'Automation Expert', 'Computer Vision Dev'];

const skills = [
  { icon: Code2,     label: 'Python',         color: 'text-yellow-400' },
  { icon: Brain,     label: 'GenAI / RAG',    color: 'text-purple-400' },
  { icon: Zap,       label: 'LangChain',      color: 'text-teal-400'   },
  { icon: Cpu,       label: 'ChromaDB',       color: 'text-cyan-400'   },
  { icon: Globe,     label: 'n8n Automation', color: 'text-green-400'  },
  { icon: Eye,       label: 'OpenCV / YOLO',  color: 'text-red-400'    },
  { icon: Eye,       label: 'MediaPipe',      color: 'text-pink-400'   },
  { icon: Cpu,       label: 'TensorFlow',     color: 'text-orange-400' },
  { icon: Cpu,       label: 'PyTorch',        color: 'text-orange-300' },
  { icon: Globe,     label: 'FastAPI / Flask', color: 'text-teal-300'  },
  { icon: Container, label: 'Docker',         color: 'text-blue-400'   },
  { icon: Terminal,  label: 'Linux',          color: 'text-gray-300'   },
];

const projects = [
  {
    title: 'Mental Health Chatbot',
    description: 'RAG chatbot powered by WHO & MoHFW trusted sources. Detects sensitive keywords and shares crisis helpline numbers with compassionate, reliable responses.',
    tags: ['RAG', 'LangChain', 'Flask', 'ChromaDB'],
    github: 'https://github.com/DeepShah1406/Mental-Health-Chatbot',
    highlight: true,
  },
  {
    title: 'Company RAG Chatbot',
    description: 'Internal documentation RAG with LangChain & ChromaDB. Streamlit UI + Flask backend. Achieved 30% accuracy improvement with prompt engineering guardrails.',
    tags: ['LangChain', 'ChromaDB', 'Streamlit', 'Flask'],
    github: 'https://github.com/DeepShah1406/Company_RAG_Chatbot',
    highlight: false,
  },
  {
    title: 'Alpha - Social Media Automation',
    description: 'Multi-tenant n8n automation tool with intelligent scheduling from analytics. Automated content generation pipeline for bulk post, reel, and story planning.',
    tags: ['n8n', 'Automation', 'API', 'Webhooks'],
    github: 'https://github.com/DeepShah1406/n8n-backup-demo-by-tags',
    highlight: false,
  },
  {
    title: 'Railway Safety AI',
    description: 'Stereo-camera depth tracking system with 3D Pose Estimation using MediaPipe & MMPose. YOLO-powered hazard detection for real-time industrial safety.',
    tags: ['Computer Vision', 'YOLO', 'MediaPipe', 'MMPose'],
    github: null,
    highlight: true,
  },
  {
    title: 'Autism ML Study',
    description: 'ASD prediction model using XGBoost and SVM. Achieved 86.72% training accuracy and 81.82% validation accuracy on clinical autism screening data.',
    tags: ['XGBoost', 'SVM', 'scikit-learn', 'ML'],
    github: 'https://github.com/DeepShah1406/autism-ml-case-study',
    highlight: false,
  },
  {
    title: 'College RAG Chatbot',
    description: 'Student and faculty enquiry RAG system with hybrid retrieval, negative prompting, and off-topic guardrails. Built with OCR for document ingestion.',
    tags: ['RAG', 'OCR', 'LangChain', 'Guardrails'],
    github: 'https://github.com/DeepShah1406/College_RAG_Chatbot',
    highlight: false,
  },
];

const experiences = [
  {
    role: 'AI/ML, GenAI & Automation Engineer',
    company: 'KERYAR',
    location: 'Anand, Gujarat',
    period: 'Nov 2025 – Dec 2025',
    points: [
      'Architected and deployed two full-stack RAG chatbots (Streamlit + Flask).',
      'Engineered complex automation pipelines using n8n, reducing manual data handling.',
      'Designed scalable endpoints for low-latency GenAI communication.',
    ],
  },
  {
    role: 'Stereo-Vision & Computer Vision Intern',
    company: 'Invisible Fiction',
    location: 'Anand, Gujarat',
    period: 'Sept 2025 – Oct 2025',
    points: [
      'Built calibrated stereo-camera system for real-time human tracking and depth calculation.',
      'Implemented 3D Pose Estimation using MediaPipe, MMPose, and YOLO.',
      'Optimized segmentation for improved depth estimation accuracy.',
    ],
  },
  {
    role: 'AI/ML Intern Engineer',
    company: 'Inexture Solutions',
    location: 'Ahmedabad, Gujarat',
    period: 'Dec 2024 – June 2025',
    points: [
      'Built RAG Chatbot with LangChain & ChromaDB - 30% accuracy improvement.',
      'Created n8n workflows reducing manual work by 25%.',
      'Reduced LLM hallucinations by 20% via prompt engineering.',
      'Improved query time by 20% with ChromaDB optimization.',
    ],
  },
];

const achievements = [
  {
    icon: '🥈',
    title: 'First Runner-Up - The Idea Show 3.0',
    org: 'Aavishkar Club, CMPICA, CHARUSAT',
    date: 'Oct 2024',
    desc: 'Built an innovative AI/Automation solution. Recognized among top participants out of the entire cohort.',
  },
  {
    icon: '🏆',
    title: 'Team Leader - Smart India Hackathon 2024',
    org: 'CMPICA, College Level',
    date: 'Sept 2024',
    desc: 'Led a 6-member team to build a functional prototype. Demonstrated leadership and problem-solving under pressure.',
  },
];

// ── Animation helpers ─────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = (delay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export const SimplePage = ({ onBack }: SimplePageProps) => {
  const [isDark, setIsDark] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  // Cycle roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const dark = isDark;

  const bg = dark
    ? 'bg-gradient-to-br from-[#030d14] via-[#0a1628] to-[#041a1a]'
    : 'bg-gradient-to-br from-[#f0fafa] via-[#e6f7f7] to-[#f5ffff]';

  const textPrimary = dark ? 'text-[#e0f7f7]' : 'text-[#0a2a2a]';
  const textMuted   = dark ? 'text-[#7fb3b3]' : 'text-[#2a6060]';
  const cardBg      = dark ? 'bg-[#008B8B]/[0.05] border-[#00CED1]/15 hover:border-[#00CED1]/40 hover:bg-[#008B8B]/[0.09]'
                           : 'bg-white/60 border-[#008B8B]/20 hover:border-[#008B8B]/50 hover:bg-white/80';
  const navBg       = dark ? 'bg-[#030d14]/80 border-b border-[#00CED1]/10' : 'bg-white/70 border-b border-[#008B8B]/15';
  const tagBg       = dark ? 'bg-[#008B8B]/15 text-[#00CED1] border border-[#00CED1]/20' : 'bg-[#008B8B]/10 text-[#006666] border border-[#008B8B]/25';

  const navLinks = [
    { id: 'about',      label: 'About'      },
    { id: 'skills',     label: 'Skills'     },
    { id: 'projects',   label: 'Projects'   },
    { id: 'experience', label: 'Experience' },
    { id: 'contact',    label: 'Contact'    },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen w-full ${bg} ${textPrimary} transition-colors duration-500 font-sans relative`}>

      {/* Ambient glows (dark only) */}
      {dark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#008B8B]/8 blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#00CED1]/6 blur-[100px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#008B8B] hover:text-[#00CED1] transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Portal</span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                  activeSection === link.id
                    ? 'text-[#00CED1]'
                    : dark ? 'text-[#7fb3b3] hover:text-[#00CED1]' : 'text-[#2a6060] hover:text-[#008B8B]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg border transition-all duration-300 ${
              dark
                ? 'border-[#00CED1]/20 bg-[#008B8B]/10 text-[#00CED1] hover:bg-[#008B8B]/20'
                : 'border-[#008B8B]/25 bg-[#008B8B]/10 text-[#006666] hover:bg-[#008B8B]/15'
            }`}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-14">

        {/* ── Hero ── */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 text-center">
          <motion.div
            className="flex flex-col items-center gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div variants={fadeUp} className="w-20 h-20 rounded-2xl border border-[#00CED1]/30 bg-[#008B8B]/10 backdrop-blur-sm flex items-center justify-center text-3xl font-black text-[#00CED1] shadow-[0_0_40px_rgba(0,206,209,0.2)]">
              DS
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              Deep{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00CED1, #008B8B, #20B2AA)' }}>
                Shah
              </span>
            </motion.h1>

            {/* Animated role */}
            <motion.div variants={fadeUp} className="h-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="text-lg sm:text-xl font-semibold text-[#00CED1]"
                >
                  {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p variants={fadeUp} className={`max-w-lg text-sm sm:text-base leading-relaxed ${textMuted}`}>
              Results-oriented AI/ML Engineer with an M.Sc. in Information Technology. Specialised in GenAI (RAG), n8n Automation, and Computer Vision. Building scalable solutions that bridge complex AI with real-world business impact.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center mt-2">
              <a
                href="https://github.com/DeepShah1406"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#008B8B] text-white hover:bg-[#00CED1] transition-colors shadow-[0_0_20px_rgba(0,139,139,0.3)]"
              >
                <GitBranch size={15} /> GitHub
              </a>
              <button
                onClick={() => scrollTo('projects')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${
                  dark
                    ? 'border-[#00CED1]/30 text-[#00CED1] hover:bg-[#008B8B]/15'
                    : 'border-[#008B8B]/40 text-[#006666] hover:bg-[#008B8B]/10'
                }`}
              >
                View Projects <ChevronRight size={14} />
              </button>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className={`absolute bottom-10 flex flex-col items-center gap-2 ${textMuted} opacity-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2 }}
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <motion.div
              className="w-[1px] h-8 bg-current"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </section>

        {/* ── About ── */}
        <section id="about" className="py-24 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <SectionLabel icon={User} label="About Me" />
            </AnimatedSection>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <AnimatedSection>
                <div className="space-y-4">
                  <p className={`text-base leading-relaxed ${textMuted}`}>
                    I'm an AI/ML engineer who crossed over from a <strong className="text-[#00CED1] font-semibold">B.Sc. Chemistry</strong> background into the world of intelligent systems - and never looked back. Completed my <strong className="text-[#00CED1] font-semibold">M.Sc. Information Technology</strong> at CHARUSAT with a CGPA of <strong className="text-[#00CED1] font-semibold">8.98/10</strong>.
                  </p>
                  <p className={`text-base leading-relaxed ${textMuted}`}>
                    I specialise in building <strong className="text-[#00CED1] font-semibold">RAG pipelines</strong>, deploying <strong className="text-[#00CED1] font-semibold">Computer Vision systems</strong>, and automating workflows with <strong className="text-[#00CED1] font-semibold">n8n</strong>. My goal is always the same: turn complex AI into practical, business-driven tools that actually work in the real world.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {[
                      { icon: GraduationCap, text: 'M.Sc. IT · CGPA 8.98' },
                      { icon: Briefcase,    text: '3 Industry Roles'     },
                      { icon: Star,         text: '6+ AI/ML Projects'    },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${tagBg}`}>
                        <Icon size={12} />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className={`rounded-2xl border p-6 backdrop-blur-sm ${cardBg} transition-all duration-300`}
                  style={{ backdropFilter: 'blur(12px)' }}>
                  <div className="space-y-3">
                    {[
                      { label: 'Location',  value: 'Gujarat, India'         },
                      { label: 'Email',     value: 'shahdeep1406@gmail.com' },
                      { label: 'Degree',    value: 'M.Sc. Information Technology' },
                      { label: 'Languages', value: 'Python · C++ · SQL · JavaScript' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start text-sm gap-4">
                        <span className={`font-bold uppercase text-[10px] tracking-widest shrink-0 ${textMuted}`}>{label}</span>
                        <span className={`text-right ${textPrimary}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills" className="py-24 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <SectionLabel icon={Cpu} label="Skills" />
            </AnimatedSection>
            <motion.div
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger(0.07)}
            >
              {skills.map(({ icon: Icon, label, color }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-default transition-all duration-300 ${cardBg}`}
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <Icon size={18} className={`shrink-0 ${color}`} />
                  <span className={`text-sm font-semibold ${textPrimary}`}>{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="py-24 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <SectionLabel icon={Code2} label="Projects" />
            </AnimatedSection>
            <motion.div
              className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger(0.1)}
            >
              {projects.map((project) => (
                <motion.div
                  key={project.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`relative flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300 ${cardBg} ${
                    project.highlight ? (dark ? 'border-[#00CED1]/30' : 'border-[#008B8B]/30') : ''
                  }`}
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  {project.highlight && (
                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#008B8B] rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
                      Featured
                    </div>
                  )}
                  <h3 className={`text-base font-bold ${textPrimary}`}>{project.title}</h3>
                  <p className={`text-sm leading-relaxed flex-1 ${textMuted}`}>{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagBg}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#008B8B] hover:text-[#00CED1] transition-colors"
                    >
                      <GitBranch size={13} /> View on GitHub <ExternalLink size={10} />
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section id="experience" className="py-24 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <SectionLabel icon={Briefcase} label="Experience" />
            </AnimatedSection>
            <div className="mt-10 relative">
              {/* Timeline line */}
              <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#00CED1]/40 via-[#008B8B]/20 to-transparent" />

              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <AnimatedSection key={i}>
                    <div className="relative flex gap-6 sm:gap-10">
                      {/* Dot */}
                      <div className="relative shrink-0">
                        <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-full border border-[#00CED1]/30 bg-[#008B8B]/10 flex items-center justify-center">
                          <Briefcase size={14} className="text-[#00CED1]" />
                        </div>
                      </div>

                      <div className={`flex-1 pb-2 rounded-2xl border p-5 transition-all duration-300 ${cardBg}`} style={{ backdropFilter: 'blur(12px)' }}>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className={`text-base font-bold ${textPrimary}`}>{exp.role}</h3>
                            <p className="text-[#00CED1] font-semibold text-sm">{exp.company} · {exp.location}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${tagBg} whitespace-nowrap`}>
                            {exp.period}
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {exp.points.map((point, j) => (
                            <li key={j} className={`text-sm leading-relaxed flex gap-2 ${textMuted}`}>
                              <span className="text-[#008B8B] mt-1 shrink-0">▸</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <AnimatedSection className="mt-16">
              <SectionLabel icon={Award} label="Achievements" />
            </AnimatedSection>
            <motion.div
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger()}
            >
              {achievements.map((a) => (
                <motion.div
                  key={a.title}
                  variants={fadeUp}
                  className={`flex gap-4 p-6 rounded-2xl border transition-all duration-300 ${cardBg}`}
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  <div className="text-3xl shrink-0">{a.icon}</div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimary}`}>{a.title}</h4>
                    <p className="text-[#008B8B] text-xs font-semibold mt-0.5">{a.org} · {a.date}</p>
                    <p className={`text-xs leading-relaxed mt-2 ${textMuted}`}>{a.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="py-24 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <AnimatedSection>
              <SectionLabel icon={Mail} label="Contact" center />
            </AnimatedSection>
            <AnimatedSection className="mt-6">
              <p className={`max-w-md mx-auto text-sm leading-relaxed ${textMuted}`}>
                Open to AI/ML engineering roles, freelance automation projects, and interesting collaborations. Let's build something impactful.
              </p>
            </AnimatedSection>
            <AnimatedSection className="mt-10 flex flex-wrap gap-4 justify-center">
              {[
                { icon: Mail,     label: 'shahdeep1406@gmail.com',         href: 'mailto:shahdeep1406@gmail.com'                  },
                { icon: GitBranch, label: 'DeepShah1406',                   href: 'https://github.com/DeepShah1406'                },
                { icon: Link2,     label: 'deepshah1406',                    href: 'https://www.linkedin.com/in/deepshah1406/'     },
              ].map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, boxShadow: '0 0 30px rgba(0,139,139,0.25)' }}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                    dark
                      ? 'border-[#00CED1]/20 bg-[#008B8B]/08 text-[#e0f7f7] hover:border-[#00CED1]/50 hover:bg-[#008B8B]/15'
                      : 'border-[#008B8B]/25 bg-white/60 text-[#0a2a2a] hover:border-[#008B8B]/50 hover:bg-white/80'
                  }`}
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <Icon size={15} className="text-[#008B8B]" />
                  {label}
                  <ExternalLink size={11} className="opacity-40" />
                </motion.a>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className={`py-8 text-center border-t ${dark ? 'border-[#00CED1]/10' : 'border-[#008B8B]/10'}`}>
          <p className={`text-xs ${textMuted} tracking-widest`}>
            Built by <span className="text-[#008B8B] font-bold">Deep Shah</span> · 2026
          </p>
        </footer>
      </div>
    </div>
  );
};

// ── Helper: Section Label ─────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label, center = false }: { icon: any; label: string; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <Icon size={16} className="text-[#00CED1] shrink-0" />
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#008B8B]">{label}</h2>
      {!center && <div className="flex-1 h-[1px] bg-gradient-to-r from-[#008B8B]/30 to-transparent" />}
    </div>
  );
}
