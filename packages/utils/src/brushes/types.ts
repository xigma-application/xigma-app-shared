export type TBrushCategoryId = 'scatter' | 'stretch';

export type TBrush = {
  id: string;
  imageFile: string;
  labelTranslationKey: string;
};

export type TBrushCategory = {
  brushes: TBrush[];
  id: TBrushCategoryId;
  labelTranslationKey: string;
};
