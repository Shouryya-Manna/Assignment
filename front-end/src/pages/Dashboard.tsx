// src/pages/Dashboard.tsx
import {
  TypographyH1,
  TypographySmall,
  TypographyH2,
  TypographyP,
} from "../components/Typography";

function Dashboard() {
  return (
    <div className="min-h-screen w-full  flex flex-col overflow-hidden pt-30">
      {/* Smooth random gradient background */}
      <div className="absolute inset-0 z-0 animated-gradient"></div>

      {/* Glassy overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-start gap-8 p-12 text-center text-white">
        {/* Typewriter heading */}
        <TypographyH1
          className="text-9xl md:text-6xl font-extrabold typewriter"
          style={{ fontFamily: "'Roboto Mono', monospace" }}
        >
          <span className="inline-block">Welcome to Driving School</span>
        </TypographyH1>

        {/* Small description with fade-in */}
        <TypographySmall className="text-lg md:text-xl coder-fadein">
          Your journey to safe and confident driving starts here
        </TypographySmall>

        {/* Paragraph */}
        <TypographyP className="max-w-3xl text-white/90 text-lg coder-fadein text-justify">
          Driving School offers professional driving lessons for beginners
          and experienced drivers alike. With highly trained instructors,
          flexible schedules, and a focus on safety, we ensure every student
          learns to drive with confidence. Explore our programs and accelerate
          your driving journey today!
        </TypographyP>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 coder-fadein">
            <TypographyH2 className="text-white font-poppins">
              Total Students
            </TypographyH2>
            <TypographyP className="text-white/90 text-lg font-roboto-mono">
              120
            </TypographyP>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 coder-fadein">
            <TypographyH2 className="text-white font-poppins">
              Active Classes
            </TypographyH2>
            <TypographyP className="text-white/90 text-lg font-roboto-mono">
              8
            </TypographyP>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 coder-fadein">
            <TypographyH2 className="text-white font-poppins">
              Pending Tasks
            </TypographyH2>
            <TypographyP className="text-white/90 text-lg font-roboto-mono">
              15
            </TypographyP>
          </div>
        </div>
      </div>

      <style>
        {`
          /* Dynamic smooth gradient animation */
          .animated-gradient {
            background: linear-gradient(45deg, #667eea, #764ba2, #6b73ff, #ff758c, #ff7eb3);
            background-size: 400% 400%;
            animation: gradientFlow 60s ease infinite;
          }

          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            25% { background-position: 50% 100%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 50% 0%; }
            100% { background-position: 0% 50%; }
          }

          /* Typewriter effect limited to text width */
          .typewriter span {
            display: inline-block;
            overflow: hidden;
            border-right: 0.15em solid #fff;
            white-space: nowrap;
            animation: typing 1.25s steps(30, end), blink-caret 0.75s step-end infinite;
          }

          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }

          @keyframes blink-caret {
            50% { border-color: transparent; }
          }

          /* Coder fade-in effect */
          .coder-fadein {
            opacity: 0;
            animation: coderFadeIn 2s ease forwards;
          }

          @keyframes coderFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
