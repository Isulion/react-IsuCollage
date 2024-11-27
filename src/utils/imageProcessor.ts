import { ImageData, ImageProcessorOptions, CollageSettings } from '../types';

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async drawImageWithText(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    title?: string,
    theme?: string
  ) {
    // Draw image
    ctx.drawImage(image, x, y, width, height);

    if (title || theme) {
      ctx.save();
      
      const textHeight = 24;
      const padding = 8;
      const totalTexts = (title ? 1 : 0) + (theme ? 1 : 0);
      const totalHeight = totalTexts * textHeight + (totalTexts - 1) * padding;
      
      // Draw background for text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(x, y + height - totalHeight - padding * 2, width, totalHeight + padding * 2);
      
      // Text settings
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      
      // Shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      let currentY = y + height - padding;

      // Draw theme if exists
      if (theme) {
        ctx.fillText(theme, x + width / 2, currentY - textHeight / 2, width - padding * 2);
        currentY -= textHeight + padding;
      }

      // Draw title if exists
      if (title) {
        ctx.fillText(title, x + width / 2, currentY - textHeight / 2, width - padding * 2);
      }

      ctx.restore();
    }
  }

  private calculateLayout(images: HTMLImageElement[], width: number, height: number): { x: number; y: number; w: number; h: number; }[] {
    const numImages = images.length;
    if (numImages === 0) return [];

    const layout: { x: number; y: number; w: number; h: number; }[] = [];
    let currentRow: { img: HTMLImageElement; aspectRatio: number; }[] = [];
    let currentRowWidth = 0;
    let y = 0;
    const targetRowHeight = 150; // Target height for each row

    // Determine the number of rows
    const numRows = Math.ceil(Math.sqrt(numImages));
    const maxImagesPerRow = Math.ceil(numImages / numRows);

    images.forEach((img, index) => {
      const aspectRatio = img.width / img.height;
      const imgWidth = targetRowHeight * aspectRatio;
      currentRow.push({ img, aspectRatio });
      currentRowWidth += imgWidth;

      // If the current row width exceeds the container width or it's the last image
      // or if the current row has reached the max images per row, finalize this row
      if (currentRowWidth >= width || index === numImages - 1 || currentRow.length === maxImagesPerRow) {
        // Calculate scaling factor for the current row
        const scalingFactor = width / currentRowWidth;
        let x = 0;

        currentRow.forEach(({ img, aspectRatio }) => {
          const imgWidth = targetRowHeight * aspectRatio * scalingFactor;
          const imgHeight = targetRowHeight * scalingFactor;
          layout.push({ x, y, w: imgWidth, h: imgHeight });
          x += imgWidth;
        });

        y += targetRowHeight * scalingFactor;
        currentRow = [];
        currentRowWidth = 0;
      }
    });

    return layout;
  }

  public async createCollage(imageDataList: ImageData[], options: ImageProcessorOptions): Promise<string> {
    const { width, showTitles, showThemes } = options;
    this.canvas.width = width;
    
    // Load all images
    const images = await Promise.all(
      imageDataList.map(data => this.loadImage(data.image))
    );
    
    // Calculate layout
    const layout = this.calculateLayout(images, width, 1000);
    
    // Determine total height required by the layout
    const totalHeight = layout.reduce((max, { y, h }) => Math.max(max, y + h), 0);
    this.canvas.height = totalHeight;
    
    // Clear canvas with a background color
    this.ctx.fillStyle = '#f5f5f5';
    this.ctx.fillRect(0, 0, width, totalHeight);
    
    // Draw images with titles and themes
    images.forEach((img, index) => {
      const { x, y, w, h } = layout[index];
      this.drawImageWithText(
        this.ctx,
        img,
        x,
        y,
        w,
        h,
        showTitles ? imageDataList[index].title : undefined,
        showThemes ? imageDataList[index].theme : undefined
      );
    });
    
    return this.canvas.toDataURL('image/jpeg', 0.95);
  }
}
