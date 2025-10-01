import { View, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

const TAB_BAR_HEIGHT = 74;
const ACTIVE_CIRCLE_RADIUS = 25;
const ACTIVE_TAB_SIZE = ACTIVE_CIRCLE_RADIUS * 2;
const ACTIVE_COLOR = "white";
const INACTIVE_COLOR = "white";
const BACKGROUND_COLOR = COLORS.primary;

export default function CustomTabBar({ state, descriptors, navigation }) {
  const visibleRoutes = state.routes.filter(
    (route) => descriptors[route.key].options.tabBarIcon
  );
  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabItemsContainer}>
        {visibleRoutes.map((route, index) => {
          const { options } = descriptors[route.key];

          if (
            route.name.startsWith("_") ||
            options.tabBarButton === (() => null)
          ) {
            return null;
          }

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

          // Get icon from options.tabBarIcon
          const icon =
            options.tabBarIcon &&
            options.tabBarIcon({
              color: isFocused ? BACKGROUND_COLOR : INACTIVE_COLOR,
              size: 24,
            });

          if (isFocused) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItemActiveWrapper}
              >
                <View style={styles.activeCircle}>{icon}</View>
              </TouchableOpacity>
            );
          }

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
    backgroundColor: BACKGROUND_COLOR,
    position: "relative",
  },
  tabItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
  },
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
  activeCircle: {
    width: ACTIVE_TAB_SIZE,
    height: ACTIVE_TAB_SIZE,
    borderRadius: ACTIVE_CIRCLE_RADIUS,
    backgroundColor: ACTIVE_COLOR,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
