import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
