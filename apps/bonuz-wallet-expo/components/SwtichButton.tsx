import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SwitchButton = (props: { value: any; onValueChange: any }) => {
    const defaultStyles = {
        bgGradientColors: ['#0100ff', '#ff00fb'],
        headGradientColors: ['#ffffff', '#E1E4E8'],
    };

    const activeStyles = {
        bgGradientColors: ['#00c4ff', '#fff600'],
        headGradientColors: ['#444D56', '#0E1723'],
    };

    const { value, onValueChange } = props;
    const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));
    const [currentStyles, setCurrnetStyles] = useState({});

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 300, // Adjust the animation duration
            useNativeDriver: false,
        }).start();
        if (value === 1) setCurrnetStyles(activeStyles);
        setCurrnetStyles(defaultStyles);
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 28], // Adjust the distance of the switch head
    });

    const toggleSwitch = () => {
        const newValue = !value;
        onValueChange(newValue);
    };

    return (
        <Pressable onPress={toggleSwitch} style={styles.pressable}>
            <LinearGradient
                colors={currentStyles.bgGradientColors}
                style={styles.backgroundGradient}
                start={{
                    x: 0,
                    y: 0.5,
                }}>
                <View style={styles.innerContainer}>
                    <Animated.View
                        style={{
                            transform: [{ translateX }],
                        }}>
                        <LinearGradient colors={currentStyles.headGradientColors} style={styles.headGradient} />
                    </Animated.View>
                </View>
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        width: 56,
        height: 32,
        borderRadius: 16,
    },
    backgroundGradient: {
        borderRadius: 16,
        flex: 1,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        position: 'relative',
    },
    headGradient: {
        width: 24,
        height: 24,
        borderRadius: 100,
    },
});

export default SwitchButton;
