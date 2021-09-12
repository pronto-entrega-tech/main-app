import { STATIC } from '~/services/requests';
import { marketModel } from '~/components/MarketItem';
import { prodModel } from '~/components/ProdItem';
import { businessHours, weekDayArray } from '~/core/models';

function money(money?: string) {
  return new Money(money);
}

class Money {
  value: number = 0;

  constructor(money?: string) {
    if (!money) return;
    this.value = parseInt(money.replace(/\D/g, ''));
  }

  add(money: number | Money) {
    this.value = this.value + (typeof money === 'number' ? money : money.value);
    return this;
  }

  sub(money: number | Money) {
    this.value = this.value - (typeof money === 'number' ? money : money.value);
    return this;
  }

  multiply(money: number | Money) {
    this.value = this.value * (typeof money === 'number' ? money : money.value);
    return this;
  }

  divide(money: number | Money) {
    this.value = this.value / (typeof money === 'number' ? money : money.value);
    return this;
  }

  toString() {
    const v = this.value.toString().padStart(3, '0');
    return (
      v.substring(0, v.length - 2) + ',' + v.substring(v.length - 2, v.length)
    );
  }
}

function moneyToString(money?: Money | { value: number } | number) {
  if (!money) return '';
  let v;
  if (typeof money == 'number') {
    v = money.toString();
  } else {
    v = money.value.toString().padStart(3, '0');
  }
  return (
    v.substring(0, v.length - 2) + ',' + v.substring(v.length - 2, v.length)
  );
}

function createProdList(json: any[]) {
  const prodList = [] as prodModel[];
  for (const i in json) {
    prodList.push(createProdItem(json[i]));
  }
  return prodList;
}

function createProdItem(item: any): prodModel {
  return {
    prod_id: item.prod_id,
    market_id: item.market_id,
    prod_name_id: item.prod_name_id,
    market_name_id: item.market_name_id,
    name: item.name,
    brand: item.brand,
    quantity: item.quantity,
    price: money(item.price),
    previous_price: item.previous_price
      ? money(item.previous_price)
      : undefined,
    unit_weight: item.unit_weight,
    discount: item.discount,
    images_names: item.images_names,
  };
}

function createMarketList(json: any[]) {
  const mercList = [] as marketModel[];
  for (const i in json) {
    const item = json[i];
    mercList.push(createMarketItem(item));
  }
  return mercList;
}

function createMarketItem(item: any): marketModel {
  item.address.coords = (item.address.coords as string)
    .replace(/\(/, '')
    .replace(/\)/, '');
  return {
    market_id: item.market_id,
    market_name_id: item.market_name_id,
    name: item.name,
    city: item.city,
    type: item.type,
    address: item.address,
    business_hours: item.business_hours,
    special_hours: item.special_hours,
    min_time: parseInt(item.min_time),
    max_time: parseInt(item.max_time),
    fee: money(item.fee),
    order_min: money(item.order_min),
    rating: parseInt(item.rating),
    info: item.info,
    document: item.document,
    payments_accepted: item.payments_accepted,
  };
}

function documentMask(doc: string) {
  let last = 0;
  function a(quant: number) {
    last += quant;
    return doc.slice(last - quant, last);
  }
  return `${a(2)}.${a(3)}.${a(3)}/${a(4)}-${a(2)}`;
}

function computeDistance(
  [prevLat, prevLong]: [prevLat: number, prevLong: number],
  [lat, long]: string[]
) {
  const prevLatInRad = toRad(prevLat);
  const prevLongInRad = toRad(prevLong);
  const latInRad = toRad(+lat);
  const longInRad = toRad(+long);

  return (
    6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) *
          Math.cos(latInRad) *
          Math.cos(longInRad - prevLongInRad)
    )
  )
    .toFixed(1)
    .replace('.', ',');
}

function toRad(angle: number) {
  return (angle * Math.PI) / 180;
}

function isMarketOpen(business_hours: businessHours) {
  const date = new Date();
  const min = date.getMinutes();
  const hour = date.getHours();
  const weekday = date.getDay();
  const [r1] = business_hours.filter(({ days }) =>
    days.includes(weekDayArray[weekday])
  );
  if (r1) {
    const { hours } = r1;
    const [interval0, interval1] = hours.filter(({ close_time }) => {
      const [c_h, c_m] = close_time.split(':');
      const close = +c_h * 60 + +c_m;
      const time = hour * 60 + min;
      return time < close;
    });
    if (interval0) {
      const { open_time, close_time } = interval0;
      const openHour = +open_time.split(':')[0];

      const isOpen = hour >= openHour;
      const nextHour = removeZero(isOpen ? close_time : open_time);

      return { isOpen, nextHour, open_time, close_time };
    }
    if (interval1) {
      const { open_time, close_time } = interval1;

      return {
        isOpen: false,
        nextHour: removeZero(open_time),
        open_time,
        close_time,
      };
    }
  }

  const [r2] = business_hours.filter(({ days }) =>
    days.includes(weekDayArray[weekday === 6 ? 0 : weekday + 1])
  );
  if (r2) {
    const { hours } = r2;
    const [{ open_time }] = hours;

    return { isOpen: false, tomorrow: true, nextHour: removeZero(open_time) };
  }

  return { isOpen: false };
}

function removeZero(text: string) {
  return text.replace(/^.{0}0/, '');
}

function removeAccents(text: string) {
  return text
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getStateCode(region: string) {
  switch (removeAccents(region)) {
    case 'acre':
      return 'AC';
    case 'alagoas':
      return 'AL';
    case 'amapa':
      return 'AP';
    case 'amazonas':
      return 'AM';
    case 'bahia':
      return 'BA';
    case 'ceara':
      return 'CE';
    case 'distrito federal':
      return 'DF';
    case 'espirito santo':
      return 'ES';
    case 'goias':
      return 'GO';
    case 'maranhao':
      return 'MA';
    case 'mato grosso':
      return 'MT';
    case 'mato grosso do sul':
      return 'MS';
    case 'minas gerais':
      return 'MG';
    case 'para':
      return 'PA';
    case 'paraiba':
      return 'PB';
    case 'parana':
      return 'PR';
    case 'pernambuco':
      return 'PE';
    case 'piaui':
      return 'PI';
    case 'rio de janeiro':
      return 'RJ';
    case 'rio grande do norte':
      return 'RN';
    case 'rio grande do sul':
      return 'RS';
    case 'rondonia':
      return 'RO';
    case 'roraima':
      return 'RR';
    case 'santa catarina':
      return 'SC';
    case 'sao paulo':
      return 'SP';
    case 'sergipe':
      return 'SE';
    case 'tocantins':
      return 'TO';

    default:
      return region;
  }
}

type imageDirs = 'main' | 'market' | 'product' | 'slide';
function getImageUrl(dir: imageDirs, image: string) {
  return `${STATIC}${dir}/${image}.webp`;
}

export {
  money,
  Money,
  moneyToString,
  createProdList,
  createProdItem,
  createMarketList as createMercList,
  createMarketItem as createMercItem,
  documentMask,
  computeDistance,
  isMarketOpen,
  removeZero,
  removeAccents,
  getStateCode,
  getImageUrl,
};
