export interface ImageData {
  image: File;
  title: string;
}

export interface CollageSettings {
  width: number;
  height: number;
  showTitles: boolean;
}

export interface PreviewProps {
  images: ImageData[];
  settings: CollageSettings;
  onSettingsChange: (settings: CollageSettings) => void;
}

export interface ImageProcessorOptions {
  width: number;
  height: number;
  showTitles: boolean;
}
