import React from "react";
import F1Image from "../assets/2019-F1-car-1.jpeg";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      {/* Hero Section */}
      <header className="text-center max-w-3xl mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 mb-4">
          Driving School Dashboard
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Welcome to the <span className="font-semibold text-gray-800">Driving School Management System</span>. 
          This is your one-stop solution to manage students, track courses, monitor instructors, 
          and keep your driving academy running smoothly. 
        </p>
      </header>

      {/* Hero Image */}
      <img
        src={F1Image}
        alt="Formula 1 Car"
        className="w-full max-w-5xl rounded-2xl shadow-xl mb-12"
      />

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition">
          <h2 className="text-3xl font-bold text-gray-800">120+</h2>
          <p className="text-gray-500 mt-2">Active Students</p>
          <p className="text-sm text-gray-400 mt-1">
            Enrolled across different driving programs.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition">
          <h2 className="text-3xl font-bold text-gray-800">8</h2>
          <p className="text-gray-500 mt-2">Courses Offered</p>
          <p className="text-sm text-gray-400 mt-1">
            Covering beginner to advanced driving levels.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition">
          <h2 className="text-3xl font-bold text-gray-800">5</h2>
          <p className="text-gray-500 mt-2">Professional Instructors</p>
          <p className="text-sm text-gray-400 mt-1">
            Certified and experienced driving trainers.
          </p>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="max-w-4xl text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Learn with the Best
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Our driving school provides the latest training curriculum with highly experienced instructors, 
          well-maintained vehicles, and flexible schedules. Whether you're a beginner or looking 
          to improve your driving skills, we have a tailored program just for you.
        </p>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Stay updated with your course progress, access important resources, and track your practice 
          sessions directly from this dashboard.
        </p>
      </section>
    </div>
  );
}

export default Dashboard;
