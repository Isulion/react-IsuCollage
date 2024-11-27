import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  styled
} from '@mui/material';
import { PreviewProps } from '../types';
import { ImageProcessor } from '../utils/imageProcessor';

const PreviewCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  backgroundColor: '#f5f5f5'
}));

const Canvas = styled(Box)({
  width: '100%',
  height: 600,
  backgroundColor: '#333',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover'
  }
});

const Controls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap'
}));

export const PreviewWindow: React.FC<PreviewProps> = ({
  images,
  settings,
  onSettingsChange,
  onImagesChange
}) => {
  const [preview, setPreview] = useState<string>('');
  const [processor] = useState(() => new ImageProcessor());

  useEffect(() => {
    const updatePreview = async () => {
      if (images.length === 0) return;
      
      try {
        const previewUrl = await processor.createCollage(images, {
          width: settings.width,
          height: settings.height,
          showTitles: settings.showTitles,
          showThemes: settings.showThemes
        });
        setPreview(previewUrl);
      } catch (error) {
        console.error('Failed to generate preview:', error);
      }
    };

    updatePreview();
  }, [images, settings, processor]);

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const width = Math.max(1, parseInt(event.target.value) || 0);
    onSettingsChange({ ...settings, width });
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const height = Math.max(1, parseInt(event.target.value) || 0);
    onSettingsChange({ ...settings, height });
  };

  const handleTitlesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, showTitles: event.target.checked });
  };

  const handleThemesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, showThemes: event.target.checked });
  };

  const handleRandomize = () => {
    const shuffled = [...images]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    
    onImagesChange(shuffled);
  };

  return (
    <PreviewCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Collage Preview
        </Typography>
        
        <Canvas>
          {preview ? (
            <img src={preview} alt="Collage preview" />
          ) : (
            <Typography color="text.secondary" onClick={() => document.getElementById('file-input')?.click()}>
              Add images to see preview
            </Typography>
          )}
        </Canvas>

        <Controls>
          <TextField
            label="Width"
            type="number"
            value={settings.width}
            onChange={handleWidthChange}
            inputProps={{ min: 1 }}
          />
          
          <TextField
            label="Height"
            type="number"
            value={settings.height}
            onChange={handleHeightChange}
            inputProps={{ min: 1 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.showTitles}
                onChange={handleTitlesChange}
              />
            }
            label="Show Titles"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showThemes}
                onChange={handleThemesChange}
              />
            }
            label="Show Themes"
          />
          
          <Button
            variant="contained"
            onClick={handleRandomize}
            disabled={images.length < 2}
          >
            Randomize Layout
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            onClick={() => onImagesChange([])}
            disabled={images.length === 0}
          >
            Reset Images
          </Button>
        </Controls>
      </CardContent>
    </PreviewCard>
  );
};
