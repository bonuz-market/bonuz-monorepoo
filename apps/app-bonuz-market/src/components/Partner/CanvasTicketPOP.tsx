import React, { useEffect, useState } from 'react';
import { Image, Layer, Rect, Stage, Text } from 'react-konva';
import useImage from 'use-image';

interface CanvasTicketProps {
  width: number;
  height: number;
  backgroundColor: string;
  overlayImage: string;
  title: string;
  name: string;
  logoUrl: string;
  stageRef: any;
}

const CanvasTicketPOP: React.FC<CanvasTicketProps> = ({
  width,
  height,
  backgroundColor,
  overlayImage,
  title,
  name,
  logoUrl,
  stageRef
}) => {
  const [overlay, overlayStatus] = useImage(overlayImage, 'anonymous');
  const [logo, logoStatus] = useImage(logoUrl, 'anonymous');
  const [overlayDimensions, setOverlayDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [logoDimensions, setLogoDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (overlay && overlayStatus === 'loaded') {
      const overlayMargin = 20;
      const scale = Math.min(
        (width - overlayMargin * 2) / overlay.width,
        (height - overlayMargin * 2) / overlay.height
      );
      const scaledWidth = overlay.width * scale;
      const scaledHeight = overlay.height * scale;
      const x = (width - scaledWidth) / 2;
      const y = (height - scaledHeight) / 2;

      setOverlayDimensions({ x, y, width: scaledWidth, height: scaledHeight });
    }
  }, [overlayStatus, overlay, width, height]);

  useEffect(() => {
    if (overlay && logo && logoStatus === 'loaded' && overlayStatus === 'loaded') {
      const maxLogoWidth = overlayDimensions.width / 2;
      const maxLogoHeight = overlayDimensions.height / 2;
      const logoScale = Math.min(maxLogoWidth / logo.width, maxLogoHeight / logo.height);
      const scaledWidth = logo.width * logoScale;
      const scaledHeight = logo.height * logoScale;

      const x = overlayDimensions.x + (overlayDimensions.width / 2) - (scaledWidth / 2);
      const y = overlayDimensions.y + (overlayDimensions.height / 2) - (scaledHeight / 2) - 50;

      setLogoDimensions({ x, y, width: scaledWidth, height: scaledHeight });
    }
  }, [logoStatus, logo, overlayStatus, overlayDimensions, overlay]);

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        <Rect x={0} y={0} width={width} height={height} fill={backgroundColor} />
        {overlay && (
          <Image
            image={overlay}
            x={overlayDimensions.x}
            y={overlayDimensions.y}
            width={overlayDimensions.width}
            height={overlayDimensions.height}
          />
        )}
        <Text
          x={overlayDimensions.x + 80}
          y={overlayDimensions.y + 50}
          text={title}
          fontSize={24}
          fontFamily="Calibri"
          fontStyle="bold"
          fill="white"
        />
        <Text
          x={overlayDimensions.x + 80}
          y={overlayDimensions.y + 80}
          text={name}
          fontSize={18}
          fontFamily="Calibri"
          fontStyle="bold"
          fill="white"
        />
        {logo && (
          <Image
            image={logo}
            x={logoDimensions.x}
            y={logoDimensions.y}
            width={logoDimensions.width}
            height={logoDimensions.height}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default CanvasTicketPOP;
