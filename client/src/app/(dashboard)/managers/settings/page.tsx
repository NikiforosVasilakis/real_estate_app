"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from "@/state/api";
import React from "react";

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateManagerSettingsMutation();

  if (isLoading) return <>Loading...</>;

  // Show a friendly fallback instead of crashing
  if (!authUser || !authUser.userInfo) {
    console.warn("authUser or authUser.userInfo is missing", authUser);
    return <>Error: Could not load user info</>;
  }

  // Now safe to destructure
  const { name = "", email = "", phoneNumber = "" } = authUser.userInfo;

  const initialData = { name, email, phoneNumber };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
};

export default ManagerSettings;