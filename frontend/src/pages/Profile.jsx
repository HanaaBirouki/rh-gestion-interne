import React from "react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">
          My Profile
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">Email</label>
                <p className="font-body-md text-body-md">{user?.email}</p>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">Role</label>
                <p className="font-body-md text-body-md">{user?.role}</p>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">First Name</label>
                <p className="font-body-md text-body-md">{user?.first_name}</p>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">Last Name</label>
                <p className="font-body-md text-body-md">{user?.last_name}</p>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">Phone</label>
                <p className="font-body-md text-body-md">{user?.phone || "Not set"}</p>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">Position</label>
                <p className="font-body-md text-body-md">{user?.position || "Not set"}</p>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">Department</label>
                <p className="font-body-md text-body-md">{user?.department || "Not set"}</p>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant">Contract Type</label>
                <p className="font-body-md text-body-md">{user?.contract_type || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;