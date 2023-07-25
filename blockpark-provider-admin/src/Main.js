import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import {
  add_parking_slot,
  get_my_parking_slots,
  release_parking_slot,
} from "./api";
import ErrorMessage from "./ErrorMessage";
import { Bars } from "react-loader-spinner";

const MainPage = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [newSlot, setNewSlot] = useState("");

  const [messageType, setMessageType] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorRendererKey, setErrorRendererKey] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch parking slots data from API
    fetchParkingSlots();
  }, []);

  const fetchParkingSlots = async () => {
    try {
      const parkingSlots = await get_my_parking_slots();
      console.log(parkingSlots);
      setParkingSlots(parkingSlots);
    } catch (error) {
      showError(error);
      console.error("Error fetching parking slots:", error);
    }
  };

  const releaseParkingSlot = async (slotNumber) => {
    console.log("releasing parking slot ");
    console.log(slotNumber);
    try {
      await release_parking_slot(slotNumber);
      fetchParkingSlots();
      showSuccess(`Success releasing parking slot ${slotNumber}`);
    } catch (error) {
      showError(error);
      console.error("Error releasing parking slot:", error);
    }
  };

  const handleSlotClick = (slot) => {
    // Set the data for the popup
    if (slot.status === 1) {
      setPopupData(slot);
    }
  };

  const closePopup = () => {
    // Clear the popup data
    setPopupData(null);
  };

  const handleAddSlot = async () => {
    setIsLoading(true);
    try {
      if (!newSlot) {
        return;
      }
      await add_parking_slot(newSlot);
      showSuccess(`Success adding new parking slot ${newSlot}`);
      setNewSlot("");
      fetchParkingSlots();
    } catch (error) {
      showError(`Error adding parking slot ${newSlot}`);
      console.error("Error adding parking slot:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="home-page">
      <h1>Parking Slots</h1>
      <div className="add-slot">
        <input
          type="text"
          placeholder="Enter parking slot number"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
        />
        {!isLoading ? (
          <button onClick={handleAddSlot}>Add Slot</button>
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
      </div>
      <div className="parking-slots-legend">
        <div className="legend-item">
          <div className="legend-color green"></div>
          <span>Free</span>
        </div>
        <div className="legend-item">
          <div className="legend-color red"></div>
          <span>Occupied</span>
        </div>
      </div>

      <div className="parking-slots-grid">
        {parkingSlots.map((slot) => (
          <div
            key={slot.slot_id}
            className={`parking-slot-item ${
              slot.status === 1 ? "red" : "green"
            }`}
            onClick={() => handleSlotClick(slot)}
          >
            {slot.slot_number}
          </div>
        ))}
      </div>

      {popupData && (
        <div className="popup">
          <h2>Slot Information</h2>
          <p>Occupier: {popupData.occupier_id}</p>
          <p>Integrator: {popupData.integrator_id}</p>
          <button onClick={() => releaseParkingSlot(popupData.slot_number)}>
            Release
          </button>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
      <div>
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            r={errorRendererKey}
            type={messageType}
          />
        )}
      </div>
    </div>
  );
};

export default MainPage;
