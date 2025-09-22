import { StyleSheet } from "react-native";
import colors from "../../constants/colors.js";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.4,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    marginBottom: 40,
    backgroundColor: "#384DAA",
    width: 295,
    height: 54,
    padding: 4,
  },
  tab: {
    height: 46,
    borderBottomColor: "transparent",
    width: "50%",
    textAlign: "center",
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: "white",
  },
  tabText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 46,
    fontWeight: 500,
    color: colors.subtleText,
  },
  tabTextActive: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 46,
    fontWeight: 500,
    color: colors.text,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    minHeight: 500,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  formTitle: {
    fontSize: 20,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.subtleText,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 2,
    borderColor: "#F3F4F9",
    borderRadius: 999,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  buttonContainer: {
    marginTop: 100,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
