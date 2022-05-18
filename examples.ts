/**
 * Сага для загрузки детальной информации продукта
 * После загрузки запускает навигацию
 * @param action - Объект параметров запроса
 */

function* sagaGetProductDetail(action: {
  type: 'catalog/getProductDetail';
  payload: getProductDetailActionPayloadType;
}) {
  try {
    const {
      id,
      navigation,
      forDetailScreen,
      callback,
      from,
      isComboChangeMode,
    } = action.payload;
    yield put(catalogRequest());
    const response: AxiosResponse<IProductDetailResponse> = yield call(
      getProductDetail,
      id
    );
    const { product } = response.data;
    yield put(catalogRequestSuccess());
    // Если запрос был сделан для экрана детальной карточки товара то кладем в стор
    if (forDetailScreen) yield put(setProductDetail(product));
    if (navigation) {
      if (isComboChangeMode) {
        yield navigation.navigate('Catalog', {
          screen: 'ProductDetailScreen',
          params: { name: product.name, from, isComboChangeMode },
        });
      } else {
        yield navigation.navigate({
          name: 'ProductDetailScreen',
          params: { name: product.name, from },
        });
      }
    }
    if (callback) {
      yield callback(product);
    }
  } catch (e) {
    yield call(sagaErrorsProcessing, e);
    yield put(catalogRequestFailure());
  }
}

/**
 * Сага предварительного расчета количества, цены (акции) продукта
 */
function* sagaPreCountProduct(action: {
  type: 'catalog/preCount';
  payload: {
    precountData: IPrecountData;
    precountTareData?: IPreCountTareRequest;
    successCallback: (
      data: IPreCountResponse,
      tareData?: IPreCountTareResponse
    ) => void;
    failCallback: () => void;
  };
}) {
  try {
    let response: AxiosResponse<IPreCountResponse>,
      responseTare: AxiosResponse<IPreCountTareResponse>;
    const { precountData, precountTareData, successCallback } = action.payload;

    if (precountTareData) {
      [response, responseTare] = yield all([
        call(preCountProduct, precountData),
        call(preCountTare, precountTareData),
      ]);
      successCallback(response.data, responseTare.data);
    } else {
      response = yield call(preCountProduct, precountData);
      successCallback(response.data);
    }
  } catch (e) {
    action.payload.failCallback();
    yield call(sagaErrorsProcessing, e);
  }
}
