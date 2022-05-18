// libs
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// components
import { FlatList } from '../FlatList';
import ProductCard from '../../productCard';
import { NProductDetail } from '../../productDatail';
import { relatedBlock as relatedBlockConfig } from './styles';
import { useStyles } from '../../../helpers/hooks';

// store
import { dispatch } from '../../../store';
import { actionGetProductDetail } from '../../../store/slices/catalog.slice';

// styles
import { lng } from '../../../i18n';
import { PRODUCT_TYPE } from '../../../interfaces/cart';
import { s } from 'react-native-size-matters/extend';

interface IProps {
  /**
   * Компонент блока обязательно попробуйте
   *  @param {NProductDetail.RelatedProdcutsList} relatedProducts - id товара
   *  @param {function} onAddToCartCallback - функция установки стейта для добавления related в корзину
   *  @param {function} callback - функция установки стейта для добавления related в корзину
   *  @param {any} containerStyle - кастомный стиль контейнера
   */
  relatedProducts: NProductDetail.RelatedProdcutsList;
  onAddToCartCallback?: (id: number, type: keyof typeof PRODUCT_TYPE) => void;
  callback?: () => void;
  containerStyle?: any;
}

interface IRenderItem {
  item: NProductDetail.RelatedProduct;
  onAddToCartCallback: (id: number, type: keyof typeof PRODUCT_TYPE) => void;
  callback?: () => void;
  index: number;
  navigation: any;
}

const _renderItem: (obj: IRenderItem) => any = ({
  item,
  onAddToCartCallback,
  callback = () => void 0,
  index,
  navigation,
}) => {
  const goToProductDetail = () => {
    // TODO(vlad): add "from" probably
    dispatch(
      actionGetProductDetail({ id: item.id, forDetailScreen: true, navigation })
    );
  };

  return (
    <ProductCard
      key={index}
      name={item.name}
      price={item.price}
      old_price={item.old_price}
      thumbnail={item.thumb}
      feedback={item.feedback}
      badges={item.badges}
      hint={item.hint}
      inBasket={item.in_cart}
      onPress={() => {
        callback();
        goToProductDetail();
      }}
      onAddBasket={() => {
        if (item.type === PRODUCT_TYPE.combo) goToProductDetail();
        onAddToCartCallback(item.id, item.type);
      }}
      onLike={() => void 0}
      onFavorite={() => void 0}
      containerStyle={{
        width: s(104)
      }}
    />
  );
};

const RelatedBlock: React.FunctionComponent<IProps> = ({
  onAddToCartCallback = () => void 0,
  relatedProducts,
  callback,
  containerStyle,
}) => {
  const navigation = useNavigation();

  const PFX = 'relatedBlock';
  // HOOKS
  const relatedBlock = useStyles(relatedBlockConfig);
  // END HOOKS
  return (
    <View style={[relatedBlock.container, containerStyle || {}]}>
      <View style={relatedBlock.titleContainer}>
        <Text style={relatedBlock.title}>{lng(`${PFX}.title`)}</Text>
      </View>

      <FlatList
        horizontal
        data={relatedProducts}
        renderItem={({ item, index }) =>
          _renderItem({
            item,
            onAddToCartCallback,
            callback,
            index,
            navigation,
          })
        }
      />
    </View>
  );
};

export default RelatedBlock;
