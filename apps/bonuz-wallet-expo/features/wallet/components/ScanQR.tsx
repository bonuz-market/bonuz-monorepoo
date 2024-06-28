// import { useFocusEffect, useIsFocused } from '@react-navigation/native';
// import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner';
// import { Text, View } from 'native-base';
// import { useCallback, useEffect, useState } from 'react';
// import { StyleSheet } from 'react-native';

// interface ScanQRProps {
//   visible: boolean;
//   setVisible: () => void;
//   size?: number;
//   width?: number | string;
//   height?: number | string;
//   onScan?: (uri: string) => void;
// }

// export const ScanQR = ({ visible, setVisible, onScan, size = 200, width, height }: ScanQRProps) => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [uri, setUri] = useState<string>('');
//   const isFocused = useIsFocused();
//   const [isScanned, setIsScanned] = useState(false);

//   const onClose = () => {
//     setVisible();
//     setUri('');
//   };

//   const handleScan = (uri: string) => {
//     onScan?.(uri);
//     setIsScanned(true);
//     onClose();
//   };
//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === PermissionStatus.GRANTED);
//     };

//     getBarCodeScannerPermissions();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setUri(data);
//     console.log(`Bar code with type ${type} and data ${data} has been scanned!`);

//     handleScan(data);
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   if (!visible || !isFocused) return <></>;
//   return (
//     <View key={isScanned ? 1 : 2} w={width ?? size} h={height ?? size}>
//       <BarCodeScanner
//         onBarCodeScanned={uri ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />
//     </View>
//   );
// };
export {};
