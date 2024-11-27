import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  styled,
  ThemeProvider,
  createTheme,
  Switch,
  FormControlLabel,
  CssBaseline
} from '@mui/material';
import { PreviewWindow } from './components/PreviewWindow';
import { ImageData, CollageSettings } from './types';
import { extractTheme } from './utils/themeExtractor';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    }
  }
});

const DropZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const ImageList = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2)
}));

const ImageThumbnail = styled(Box)({
  position: 'relative',
  paddingTop: '100%',
  '& img': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [settings, setSettings] = useState<CollageSettings>({
    width: 1024,
    height: 1024,
    showTitles: false,
    showThemes: false
  });
  const [themes, setThemes] = useState<string[][]>([]);

  useEffect(() => {
    if (settings.showThemes) {
      const fetchThemes = async () => {
        const themesPromises = images.map((img) => extractTheme(img.image));
        const themesResults = await Promise.all(themesPromises);
        setThemes(themesResults);
        
        // Update images with themes
        const updatedImages = images.map((img, index) => ({
          ...img,
          theme: themesResults[index]?.[0] || ''
        }));
        setImages(updatedImages);
      };
      fetchThemes();
    } else {
      setThemes([]);
      // Remove themes when showThemes is disabled
      const updatedImages = images.map(img => ({
        ...img,
        theme: ''
      }));
      setImages(updatedImages);
    }
  }, [images, settings.showThemes]);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    const files = Array.from(event.dataTransfer.files)
      .filter(file => file.type.startsWith('image/'));
      
    const newImages: ImageData[] = files.map(file => ({
      image: file,
      title: file.name
    }));
    
    setImages([...images, ...newImages]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    const files = Array.from(event.target.files)
      .filter(file => file.type.startsWith('image/'));
      
    const newImages: ImageData[] = files.map(file => ({
      image: file,
      title: file.name
    }));
    
    setImages([...images, ...newImages]);
  };

  const preventDefault = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleTitlesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, showTitles: event.target.checked });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Isulion Collage Creator
        </Typography>

        <PreviewWindow
          images={images}
          settings={settings}
          onSettingsChange={setSettings}
          onImagesChange={setImages}
        />

        <Box sx={{ mt: 4 }}>
          <DropZone
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="contained" component="span">
                Choose Images
              </Button>
            </label>
            <Typography sx={{ mt: 2 }}>
              or drag and drop images here
            </Typography>
          </DropZone>

          <ImageList>
            {images.map((img, index) => (
              <ImageThumbnail key={index}>
                <img
                  src={URL.createObjectURL(img.image)}
                  alt={img.title}
                />
                {settings.showThemes && themes[index] && themes[index].length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {themes[index].join(', ')}
                  </Typography>
                )}
              </ImageThumbnail>
            ))}
          </ImageList>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
