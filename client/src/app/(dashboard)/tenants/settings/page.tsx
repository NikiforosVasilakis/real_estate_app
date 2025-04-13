"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from "@/state/api";
import React from "react";

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateTenantSettingsMutation();

  if (isLoading) return <>Loading...</>;

  //Show a friendly fallback instead of crashing
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
      userType="tenant"
    />
  );
};

export default TenantSettings;