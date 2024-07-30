import React, { useEffect, useState } from 'react';
import { Image, Layer, Stage, Text } from 'react-konva';
import useImage from 'use-image';

interface CanvasTicketProps {
  backgroundColor: string;
  overlayImage: string;
  title: string;
  name: string;
  logoUrl: string;
  stageRef: any;
}

const CanvasTicketVoucher = ({
  backgroundColor,
  overlayImage,
  title,
  name,
  logoUrl,
  stageRef,
}: CanvasTicketProps) => {
  const stageWidth = 500;
  const stageHeight = 500;

  const [overlay] = useImage(overlayImage, 'anonymous');
  const [powerBy] = useImage('/assets/powered-by.png', 'anonymous');

  const [imageDimensions, setImageDimensions] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  const [powerByDimensions, setPowerByDimensions] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1 });

  useEffect(() => {
    if (overlay) {
      // Calculate the best fit scale for the image
      const scaleWidth = stageWidth / overlay.width;
      const scaleHeight = stageHeight / overlay.height;
      const scale = Math.min(scaleWidth, scaleHeight);

      // Calculate the scaled dimensions
      const scaledWidth = overlay.width * scale;
      const scaledHeight = overlay.height * scale;

      // Center the image
      const x = (stageWidth - scaledWidth) / 2; // Center horizontally
      const y = (stageHeight - scaledHeight) / 2; // Center vertically

      setImageDimensions({ x, y, scaleX: scale, scaleY: scale });
    }
  }, [overlay]);



  // useEffect(() => {
  //   if (powerBy && overlay) {
  //     // Calculate the best fit scale for the image
  //     const scaleWidth = 200 / powerBy.width;
  //     const scaleHeight = 200 / powerBy.height;
  //     const scale = Math.min(scaleWidth, scaleHeight);

  //     // Calculate the scaled dimensions
  //     const scaledWidth = powerBy.width * scale;
  //     const scaledHeight = powerBy.height * scale;

  //     // Position the "powered by" image at the bottom right corner
  //     const marginRight = 0; // Right margin in pixels
  //     const marginBottom = 0; // Bottom margin in pixels
  //     const x = stageWidth - scaledWidth - marginRight; // Calculate the x position
  //     const y = stageHeight - scaledHeight - marginBottom; // Calculate the y position

  //     setPowerByDimensions({ x, y, scaleX: scale, scaleY: scale });
  //   }
  // }, [overlay, powerBy]);

  useEffect(() => {
    if (powerBy && overlay) {
      // Calculate the best fit scale for the "powered by" image
      const scaleWidth = 200 / powerBy.width;
      const scaleHeight = 200 / powerBy.height;
      const scale = Math.min(scaleWidth, scaleHeight);

      // Calculate the scaled dimensions of the "powered by" image
      const scaledWidth = powerBy.width * scale;
      const scaledHeight = powerBy.height * scale;

      // Calculate the bottom right position of the overlay image
      const overlayBottomRightX = imageDimensions.x + (overlay.width * imageDimensions.scaleX);
      const overlayBottomRightY = imageDimensions.y + (overlay.height * imageDimensions.scaleY);

      const marginRight = 0; // Right margin in pixels
      const marginBottom = 0; // Bottom margin in pixels
      const x = overlayBottomRightX - scaledWidth - marginRight;
      const y = overlayBottomRightY - scaledHeight - marginBottom;

      setPowerByDimensions({ x, y, scaleX: scale, scaleY: scale });
    }
  }, [overlay, powerBy, imageDimensions]);


  return (
    <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
      <Layer>
        {overlay && (
          <Image
            image={overlay}
            x={imageDimensions.x}
            y={imageDimensions.y}
            scaleX={imageDimensions.scaleX}
            scaleY={imageDimensions.scaleY}
          />
        )}
        <Text
          x={imageDimensions.x + 10}
          y={imageDimensions.y + 10}
          text={title}
          fontSize={32}
          fontFamily="Calibri"
          fontStyle="bold"
          fill="white"
          stroke="#000000"
          strokeWidth={1}
        />
        <Text
          x={imageDimensions.x + 20}
          y={imageDimensions.y + 50}
          text={name}
          fontSize={28}
          fontFamily="Calibri"
          fontStyle="bold"
          fill="white"
          stroke="#000000"
          strokeWidth={1}
        />
        <Image image={powerBy}
          x={powerByDimensions.x}
          y={powerByDimensions.y}
          scaleX={powerByDimensions.scaleX}
          scaleY={powerByDimensions.scaleY}
        />

      </Layer>
    </Stage>
  );
};

export default CanvasTicketVoucher;
