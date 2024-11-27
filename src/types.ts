export interface ImageData {
  image: File;
  title: string;
  theme?: string;
}

export interface CollageSettings {
  width: number;
  height: number;
  showTitles: boolean;
  showThemes: boolean;
}

export interface PreviewProps {
  images: ImageData[];
  settings: CollageSettings;
  onSettingsChange: (settings: CollageSettings) => void;
  onImagesChange: (images: ImageData[]) => void;
}

export interface ImageProcessorOptions {
  width: number;
  height: number;
  showTitles: boolean;
  showThemes: boolean;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface LoginProps {
  onLogin: (credentials: AuthCredentials) => void;
  error?: string;
}
