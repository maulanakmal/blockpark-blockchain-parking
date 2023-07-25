import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { AuthContext } from "../auth/AuthProvider";
import { get_user_info } from "../../api/get_user_info";
import { updateUserInfo } from "../../api/update_user_info";

const Profile = () => {
  const { user } = React.useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("John Doe");
  const [phoneNumber, setPhoneNumber] = useState("123-456-7890");
  const [editing, setEditing] = useState(false);

  const fetchData = async () => {
    try {
      const userInfo = await get_user_info(user.token);
      setEmail(userInfo.email);
      setName(userInfo.name);
      setPhoneNumber(userInfo.phone_number);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setEditing(false);
    try {
      await updateUserInfo(user.token, name, phoneNumber);
    } catch (error) {
      console.error(error);
      console.error("Failed to update user info");
    } finally {
      fetchData();
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.email}>{email}</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoFocus
          />
        ) : (
          <Text style={styles.info}>{name}</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Phone Number</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
          />
        ) : (
          <Text style={styles.info}>{phoneNumber}</Text>
        )}
      </View>
      {editing ? (
        <PaperButton
          mode="contained"
          style={{ margin: 10 }}
          onPress={handleSave}
        >
          <Text style={styles.textStyle}>Save</Text>
        </PaperButton>
      ) : (
        <PaperButton
          mode="contained"
          style={{ margin: 10 }}
          onPress={handleEdit}
        >
          <Text style={styles.textStyle}>Edit Profile</Text>
        </PaperButton>
      )}
      <PaperButton
        mode="contained"
        style={{ margin: 10 }}
        onPress={handleLogout}
      >
        <Text style={styles.textStyle}>Log Out</Text>
      </PaperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    marginBottom: 24,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "bold",
    opacity: 0.7,
  },
  info: {
    fontSize: 18,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Profile;
