// File: hooks/useUserLocation.js

import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

/**
 * Custom hook để xin quyền và lấy vị trí (địa chỉ) hiện tại của người dùng.
 * @returns {object} { userAddress: string, location: object, fetchLocation: function }
 */
export const useUserLocation = () => {
  const [userAddress, setUserAddress] = useState("Đang tải...");
  const [location, setLocation] = useState(null); // Lưu trữ tọa độ
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchLocation = async () => {
    setLocationLoading(true);
    try {
      // 1. Yêu cầu quyền truy cập vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setUserAddress("Không có quyền truy cập vị trí");
        Alert.alert(
          "Cần quyền truy cập vị trí",
          "Ứng dụng cần quyền truy cập vị trí để tìm sân bóng gần bạn."
        );
        setLocationLoading(false);
        return;
      }

      // 2. Lấy vị trí hiện tại
      let currentPosition = await Location.getCurrentPositionAsync({});
      setLocation(currentPosition.coords);
      const { latitude, longitude } = currentPosition.coords;

      // 3. Chuyển đổi tọa độ thành địa chỉ (Geocoding)
      let address = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (address && address.length > 0) {
        const { street, name, city, region } = address[0];
        const formattedAddress = `${name || street || ""}, ${
          city || region || "Địa chỉ không xác định"
        }`.trim();
        setUserAddress(formattedAddress);
      } else {
        setUserAddress("Không tìm thấy địa chỉ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy vị trí: ", error);
      setUserAddress("Lỗi khi tải địa chỉ");
    } finally {
      setLocationLoading(false);
    }
  };
  fetchLocation();
  return { userAddress, location, fetchLocation, locationLoading };
};
