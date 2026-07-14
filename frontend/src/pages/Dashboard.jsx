import React from "react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">
          Welcome back, {user?.first_name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display-lg text-display-lg text-primary-container">0</p>
              <p className="text-on-surface-variant font-body-sm">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display-lg text-display-lg text-primary-container">0</p>
              <p className="text-on-surface-variant font-body-sm">Pending requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display-lg text-display-lg text-primary-container">0</p>
              <p className="text-on-surface-variant font-body-sm">Pending documents</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-2xl">request_quote</span>
                  <p className="font-body-sm mt-2">Request Leave</p>
                </button>
                <button className="p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-2xl">description</span>
                  <p className="font-body-sm mt-2">Request Document</p>
                </button>
                <button className="p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-2xl">receipt</span>
                  <p className="font-body-sm mt-2">View Payslips</p>
                </button>
                <button className="p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-2xl">person</span>
                  <p className="font-body-sm mt-2">Edit Profile</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;