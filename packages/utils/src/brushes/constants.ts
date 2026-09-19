// types
import { TBrush, TBrushCategory } from './types';

// Brush images live in @xigma/assets: packages/assets/images/brushes/<imageFile> (imageFile includes the category folder).
export const BRUSH_IMAGES_DIRECTORY = 'images/brushes';

const STRETCH_BRUSHES: TBrush[] = [
  {
    id: 'heist',
    imageFile: 'stretch/heist.png',
    labelTranslationKey: 'shared.brushes.names.heist',
  },
  {
    id: 'blockbuster',
    imageFile: 'stretch/blockbuster.png',
    labelTranslationKey: 'shared.brushes.names.blockbuster',
  },
  {
    id: 'grindhouse',
    imageFile: 'stretch/grindhouse.png',
    labelTranslationKey: 'shared.brushes.names.grindhouse',
  },
  {
    id: 'biopic',
    imageFile: 'stretch/biopic.png',
    labelTranslationKey: 'shared.brushes.names.biopic',
  },
  {
    id: 'spaghettiWestern',
    imageFile: 'stretch/spaghetti-western.png',
    labelTranslationKey: 'shared.brushes.names.spaghettiWestern',
  },
  {
    id: 'slasher',
    imageFile: 'stretch/slasher.png',
    labelTranslationKey: 'shared.brushes.names.slasher',
  },
  {
    id: 'hardboiled',
    imageFile: 'stretch/hardboiled.png',
    labelTranslationKey: 'shared.brushes.names.hardboiled',
  },
  {
    id: 'verite',
    imageFile: 'stretch/verite.png',
    labelTranslationKey: 'shared.brushes.names.verite',
  },
  {
    id: 'epic',
    imageFile: 'stretch/epic.png',
    labelTranslationKey: 'shared.brushes.names.epic',
  },
  {
    id: 'screwball',
    imageFile: 'stretch/screwball.png',
    labelTranslationKey: 'shared.brushes.names.screwball',
  },
  {
    id: 'romCom',
    imageFile: 'stretch/rom-com.png',
    labelTranslationKey: 'shared.brushes.names.romCom',
  },
  {
    id: 'noir',
    imageFile: 'stretch/noir.png',
    labelTranslationKey: 'shared.brushes.names.noir',
  },
  {
    id: 'propaganda',
    imageFile: 'stretch/propaganda.png',
    labelTranslationKey: 'shared.brushes.names.propaganda',
  },
  {
    id: 'melodrama',
    imageFile: 'stretch/melodrama.png',
    labelTranslationKey: 'shared.brushes.names.melodrama',
  },
  {
    id: 'newWave',
    imageFile: 'stretch/new-wave.png',
    labelTranslationKey: 'shared.brushes.names.newWave',
  },
];

const SCATTER_BRUSHES: TBrush[] = [
  {
    id: 'bubblegum',
    imageFile: 'scatter/bubblegum.png',
    labelTranslationKey: 'shared.brushes.names.bubblegum',
  },
  {
    id: 'witchHouse',
    imageFile: 'scatter/witch-house.png',
    labelTranslationKey: 'shared.brushes.names.witchHouse',
  },
  {
    id: 'shoegaze',
    imageFile: 'scatter/shoegaze.png',
    labelTranslationKey: 'shared.brushes.names.shoegaze',
  },
  {
    id: 'honkyTonk',
    imageFile: 'scatter/honky-tonk.png',
    labelTranslationKey: 'shared.brushes.names.honkyTonk',
  },
  {
    id: 'screamo',
    imageFile: 'scatter/screamo.png',
    labelTranslationKey: 'shared.brushes.names.screamo',
  },
  {
    id: 'drone',
    imageFile: 'scatter/drone.png',
    labelTranslationKey: 'shared.brushes.names.drone',
  },
  {
    id: 'dooWop',
    imageFile: 'scatter/doo-wop.png',
    labelTranslationKey: 'shared.brushes.names.dooWop',
  },
  {
    id: 'spokenWord',
    imageFile: 'scatter/spoken-word.png',
    labelTranslationKey: 'shared.brushes.names.spokenWord',
  },
  {
    id: 'vaporwave',
    imageFile: 'scatter/vaporwave.png',
    labelTranslationKey: 'shared.brushes.names.vaporwave',
  },
  {
    id: 'oi',
    imageFile: 'scatter/oi.png',
    labelTranslationKey: 'shared.brushes.names.oi',
  },
];

export const BRUSH_CATEGORIES: TBrushCategory[] = [
  { brushes: STRETCH_BRUSHES, id: 'stretch', labelTranslationKey: 'shared.brushes.categories.stretch' },
  { brushes: SCATTER_BRUSHES, id: 'scatter', labelTranslationKey: 'shared.brushes.categories.scatter' },
];
