import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const [baseWidth, baseHeight] = [426, 881];

const getWidth = (unit: number = baseWidth): number => (unit / baseWidth) * width;
const getHeight = (unit: number = baseHeight): number => (unit / baseHeight) * height;

export { getWidth, getHeight };