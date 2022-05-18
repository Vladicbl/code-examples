import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import BeerGlassMiniIcon from '../svg/icons/beerGlassMiniIcon';
import stylesConfig from './style';
import BeerGlassMiniIconWithNotification from '../svg/icons/beerGlassMiniIconWithNotification';
import { useSelector } from 'react-redux';
import { beerGlassIconSelector } from '../../store/selectors/beerGlass.selectors';
import { isOfflineModeSelector } from '../../store/selectors/app.selectors';
import { useColors, useStyles } from '../../helpers/hooks';

interface IProps {
  /**
   * Компонент иконки с кружкой и количеством мл
   * @param fromMainScreen - если true то компонент находится на главном экране
   * @param onPress - функция нажатия на иконку
   * @param accessibilityLabelTappedToday - тестовая метка если сегодня нажимали на кружку
   * @param accessibilityLabelNotTappedToday - тестовая метка если сегодня на кружку не нажимали
   * @param textStyle - стиль текста
   * @param iconStyle - стиль иконки
   * @param containerStyle - стиль контейнера
   */
  fromMainScreen?: boolean;
  onPress?: () => void;
  accessibilityLabelTappedToday?: string;
  accessibilityLabelNotTappedToday?: string;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const BeerGlassIconWithMilliliters: React.FunctionComponent<IProps> = ({
  fromMainScreen,
  onPress,
  accessibilityLabelTappedToday,
  accessibilityLabelNotTappedToday,
  containerStyle,
  iconStyle,
  textStyle,
}) => {
  // HOOKS
  const colors = useColors();
  const styles = useStyles(stylesConfig);
  // END HOOKS
  const icon = useSelector(beerGlassIconSelector);
  const isOfflineMode = useSelector(isOfflineModeSelector);

  const amount = isOfflineMode ? '–' : icon.amount;
  const content = isOfflineMode ? (
    <BeerGlassMiniIcon color={colors.basicBlack + '30'} />
  ) : icon.alert && fromMainScreen ? (
    <BeerGlassMiniIconWithNotification
      style={[styles.beerGlassIcon, iconStyle || {}]}
    />
  ) : (
    <BeerGlassMiniIcon />
  );

  return (
    <TouchableOpacity
      accessibilityLabel={
        icon.alert
          ? accessibilityLabelNotTappedToday
          : accessibilityLabelTappedToday
      }
      style={[styles.touchableContainer, containerStyle || {}]}
      activeOpacity={fromMainScreen ? 0.7 : 1}
      onPress={onPress}
    >
      {content}
      <Text style={[styles.text, textStyle || {}]}>{amount}</Text>
    </TouchableOpacity>
  );
};

export default BeerGlassIconWithMilliliters;
