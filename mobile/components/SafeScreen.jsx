import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
  const inset = useSafeAreaInsets();
  return <View style={{ paddingTop: inset.top, flex: 1 }}>{children}</View>;
};

export default SafeScreen;
