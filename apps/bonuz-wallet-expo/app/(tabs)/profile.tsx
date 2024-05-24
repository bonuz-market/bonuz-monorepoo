import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StatusBarHeight } from "@/components/StatusbarHeight";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useAuth } from "@/hooks/Auth.hooks";

export default function Profile() {
  const { user, login, logout } = useAuth();
  let list = [
    {
      background: "#117EFF",
      icon: require("@/assets/images/profile/globe.png"),
      title: "Social media accounts",
    },
    {
      background: "#E2A612",
      icon: require("@/assets/images/profile/message.png"),
      title: "Messaging apps",
    },
    {
      background: "#8247E5",
      icon: require("@/assets/images/profile/crypto.png"),
      title: "Blockchain & Wallets",
    },
    {
      background: "#3BAF7E",
      icon: require("@/assets/images/profile/decentralized.png"),
      title: "Decentralized identifiers",
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listContainer}>
        <View style={styles.listRow}>
          <View
            style={[styles.listIconWrap, { backgroundColor: item.background }]}
          >
            <Image
              source={item.icon}
              style={styles.listIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.listTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <Image
          source={require("@/assets/images/profile/down.png")}
          style={styles.listDown}
          resizeMode="contain"
        />
      </View>
    );
  };
  const handleGuestLogin = async (provider: any) => {
    let loginState = {
      jwt:'dsgfhddfghdfg',
      socialProvider:provider,
      guest:false,
      isLoggedIn:true
    }
    login(loginState)
    try {
      await SecureStore.setItemAsync('loggedIn', JSON.stringify(loginState))
    } catch (error) {
      console.error('Error storing token:', error);
    }

  };

  const handleLogout = async () => {
    logout()
    await SecureStore.deleteItemAsync('loggedIn');
    router.push('/')
  }

  return user?.guest && !user.jwt ? (
    <LinearGradient
      colors={["#4B2EA2", "#0E2875"]}
      style={[styles.container, styles.guestContainer]}
    >
      <Text style={styles.guestText}>
        You are guest please login to continue
      </Text>
      <TouchableOpacity
        onPress={() => handleGuestLogin("Google")}
        style={[styles.button, styles.buttonSocial]}
      >
        <Image
          source={require("@/assets/images/google.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleGuestLogin("Apple")}
        style={styles.button}
      >
        <Image
          source={require("@/assets/images/apple.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>Sign Up with Apple</Text>
      </TouchableOpacity>
    </LinearGradient>
  ) : (
    <LinearGradient colors={["#4B2EA2", "#0E2875"]} style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/profile/profile.png")}
        style={styles.profile}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop:
                Platform.OS == "android"
                  ? StatusBarHeight() + hp(2)
                  : StatusBarHeight(),
            },
          ]}
        >
          <Pressable
            onPress={handleLogout}
            style={styles.headerImageWrap}
          >
            <Image
              style={styles.headerImage}
              source={require("@/assets/images/profile/settings.png")}
            />
          </Pressable>
          <View style={styles.headerImageWrap}>
            <Image
              style={styles.headerImage}
              source={require("@/assets/images/profile/share.png")}
            />
          </View>
        </View>
      </ImageBackground>
      <View style={styles.listHeader}>
        <BlurView
          intensity={Platform.OS == "ios" ? 25 : 10}
          tint={Platform.OS == "ios" ? "light" : "dark"}
          experimentalBlurMethod="dimezisBlurView"
          style={styles.absolute}
        >
          <View style={styles.blur}>
            <Text style={styles.socialId}>You are logged in with {user?.socialProvider}</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={{ backgroundColor: "transparent" }}>
              <Text style={styles.name}>Santiago Welch</Text>
              <Text style={styles.userName}>@Art_Kulas62</Text>
            </View>
            <View style={styles.editImageWrap}>
              <Image
                style={styles.editImage}
                source={require("@/assets/images/profile/edit.png")}
              />
            </View>
          </View>
          <FlatList
            data={list}
            renderItem={renderItem}
            initialNumToRender={5}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </BlurView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  guestContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  guestText: {
    fontSize: RFPercentage(2),
    color: "white",
    fontWeight: "500",
    marginBottom: hp(5),
  },
  buttonText: {
    color: "#000",
    fontSize: RFPercentage(2),
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    height: hp(6),
    width: wp(90),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  icon: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(3),
  },
  buttonSocial: {
    marginBottom: hp(1),
  },
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: wp(4),
    height: hp(7.4),
    marginBottom: hp(1),
    marginHorizontal: wp(5),
    borderRadius: wp(5),
    backgroundColor: "#117EFF50",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listIconWrap: {
    height: hp(4.5),
    width: hp(4.5),
    borderRadius: hp(1),
    justifyContent: "center",
    alignItems: "center",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  listTitle: {
    fontSize: RFPercentage(2),
    color: "white",
    fontWeight: "500",
    marginLeft: wp(4),
    width: wp(55),
  },
  listIcon: {
    height: hp(3),
    width: hp(3),
  },
  listDown: {
    height: hp(3.5),
    width: hp(3.5),
  },
  listHeader: {
    height: hp(62),
    top: hp(-7),
    zIndex: 1,
    flexWrap: "wrap",
    backgroundColor: "transparent",
  },
  blur: {
    backgroundColor: "transparent",
    height: hp(7),
    justifyContent: "center",
    width: wp(100),
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    padding: wp(5),
  },
  name: {
    fontSize: RFPercentage(3),
    color: "white",
    fontWeight: "700",
  },
  userName: {
    fontSize: RFPercentage(1.8),
    color: "#D5D7E6",
    marginTop: hp(0.6),
  },
  editImageWrap: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#684FCD",
  },
  editImage: {
    width: wp(5),
    height: wp(5),
  },
  absolute: {
    overflow: "hidden",
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // zIndex:-1
  },
  socialId: {
    fontSize: RFPercentage(2),
    color: "white",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  profile: {
    width: wp(100),
    height: hp(45),
    zIndex: 0,
  },
  headerImage: {
    width: wp(6),
    height: wp(5),
  },
  headerImageWrap: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9A08F",
  },
});
