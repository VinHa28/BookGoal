import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import COLORS from "../constants/colors";

const TAB_BAR_HEIGHT = 74;
const ACTIVE_CIRCLE_RADIUS = 25;
const ACTIVE_TAB_SIZE = ACTIVE_CIRCLE_RADIUS * 2;
const ACTIVE_COLOR = "white";
const INACTIVE_COLOR = "white";
const BACKGROUND_COLOR = COLORS.primary;

export default function CustomTabBar({ state, descriptors, navigation }) {
  // Chỉ lấy 3 tab đầu tiên
  const routes = state.routes.slice(0, 3);

  return (
    // mainContainer hiện tại là thanh tab nền màu đặc
    <View style={styles.mainContainer}>
      <View style={styles.tabItemsContainer}>
        {routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Lấy icon từ options.tabBarIcon
          const icon =
            options.tabBarIcon &&
            options.tabBarIcon({
              // Icon active có màu của nền tab bar (Nền Vòng tròn Trắng -> Icon Màu Tím)
              color: isFocused ? BACKGROUND_COLOR : INACTIVE_COLOR,
              size: 24,
            });

          // Tab Active (Vòng tròn trắng, căn giữa)
          if (isFocused) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                // Wrapper căn chỉnh vòng tròn active ở giữa
                style={styles.tabItemActiveWrapper}
              >
                <View style={styles.activeCircle}>{icon}</View>
              </TouchableOpacity>
            );
          }

          // Tab Inactive (Chỉ icon trắng, căn giữa)
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItemInactive}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: TAB_BAR_HEIGHT,
    // Đã đổi thành màu nền đặc
    backgroundColor: BACKGROUND_COLOR,
    position: "relative",
  },
  tabItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // Căn chỉnh các icon/vòng tròn ở giữa theo chiều dọc
    alignItems: "center",
    height: "100%",
  },
  // Tab Active và Inactive đều được căn giữa bình thường
  tabItemActiveWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemInactive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Vòng tròn trắng nổi bật cho tab active
  activeCircle: {
    width: ACTIVE_TAB_SIZE,
    height: ACTIVE_TAB_SIZE,
    borderRadius: ACTIVE_CIRCLE_RADIUS,
    backgroundColor: ACTIVE_COLOR,
    justifyContent: "center",
    alignItems: "center",
    // Điều chỉnh bóng nhẹ cho hiệu ứng nổi
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
