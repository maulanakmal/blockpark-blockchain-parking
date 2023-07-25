import React, { useState, useEffect } from "react";
import axios from "axios";
import { get_my_info, update_provider_info } from "./api";
import ErrorMessage from "./ErrorMessage";
import { Bars } from "react-loader-spinner";

const ProfilesPage = () => {
  const [providerName, setProviderName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Fetch profile info from API
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const info = await get_my_info();
      console.log(info);
      showSuccess(`Success feching profile info`);
      setProviderName(info.provider_name);
      setAddress(info.address);
    } catch (error) {
      showError(`Error fetching profile info`);
      console.error("Error fetching profile info:", error);
    }
  };

  const updateProfileInfo = async () => {
    setIsLoading(true);
    try {
      console.log(`name ${providerName}, address ${address}`);
      await update_provider_info(providerName, address);
      showSuccess(`Success updating profile info`);
    } catch (error) {
      showError(`Error updating profile info`);
      console.error("Error updating profile info:", error);
    } finally {
      setIsLoading(false);
      fetchProfileInfo();
    }
  };

  const [messageType, setMessageType] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorRendererKey, setErrorRendererKey] = useState(0);

  const showSuccess = (successString) => {
    setMessageType(1);
    setErrorMessage(successString); // Set the error message
    setErrorRendererKey(errorRendererKey + 1);
  };

  const showError = (errorString) => {
    setMessageType(0);
    setErrorMessage(errorString); // Set the error message
    setErrorRendererKey(errorRendererKey + 1);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div>
        <label>Provider Name:</label>
        <input
          type="text"
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {!isLoading ? (
        <button onClick={updateProfileInfo}>Update</button>
      ) : (
        <Bars
          height="40"
          width="40"
          color="#4fa94d"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      )}

      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          r={errorRendererKey}
          type={messageType}
        />
      )}
    </div>
  );
};

export default ProfilesPage;
