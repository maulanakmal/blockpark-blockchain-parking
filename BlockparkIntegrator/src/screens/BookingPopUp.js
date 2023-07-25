import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { AuthContext } from "../auth/AuthProvider";
import { assign_parking_slot } from "../../api/assign_parking_slot";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import FloatingMessage from "../components/FloatingMessage";

const BookingPopUp = ({
  visibility,
  close,
  parkingSlot,
  provider,
  showError,
  showSuccess,
}) => {
  const { user } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const assign = async () => {
    setIsLoading(true);
    try {
      await assign_parking_slot(
        user.token,
        provider.provider_id,
        parkingSlot.slot_number,
        user.email
      );
      showSuccess("Succes assigning parking slot");
    } catch (error) {
      showError("Failed assigning parking slot");
    } finally {
      close();
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibility}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure to book this this parking slot?
            </Text>
            <Text style={styles.modalText}>
              Parking provider: {provider?.provider_name}
            </Text>
            <Text style={styles.modalText}>
              Parking facility address: {provider?.address}
            </Text>
            <Text style={styles.modalText}>
              Parking slot number: {parkingSlot?.slot_number}
            </Text>

            {!isLoading ? (
              <View style={styles.verticalButtonContainer}>
                <PaperButton
                  mode="contained"
                  style={{ margin: 10 }}
                  onPress={() => assign()}
                >
                  <Text style={styles.textStyle}>YES</Text>
                </PaperButton>
                <PaperButton
                  mode="contained"
                  style={{ margin: 10 }}
                  onPress={() => close()}
                >
                  <Text style={styles.textStyle}>NO</Text>
                </PaperButton>
              </View>
            ) : (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  verticalButtonContainer: {
    flexDirection: "row",
    // justifyContent: "space-around",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
  },
});

export default BookingPopUp;
