import { mercModel } from "../components/MercItem";
import { prodModel } from "../components/ProdItem";

function money(money?: string) {
  return new Money(money)
}

class Money {
  value: number = 0;

  constructor(money?: string) {
    if (!money) return;
    this.value = parseInt(money.replace(/\D/g, ''));
  }

  add(money: number | Money) {
    this.value = this.value + (typeof money == 'number'? money : money.value);
    return this;
  }

  sub(money: number | Money) {
    this.value = this.value - (typeof money == 'number'? money : money.value);
    return this;
  }

  multiply(money: number | Money) {
    this.value = this.value * (typeof money == 'number'? money : money.value);
    return this;
  }

  divide(money: number | Money) {
    this.value = this.value / (typeof money == 'number'? money : money.value);
    return this;
  }

  toString() {
    const v = this.value.toString().padStart(3, '0');
    return v.substring(0, v.length-2)+','+v.substring(v.length-2, v.length)
  }
}

function moneyToString(money?: Money | {value: number} | number) {
  if (!money) return '';
  let v;
  if (typeof money == 'number') {
    v = money.toString();
  } else {
    v = money.value.toString().padStart(3, '0');
  }
  return v.substring(0, v.length-2)+','+v.substring(v.length-2, v.length)
}

function createProdList(json: any[]) {
  let prodList: prodModel[] = []
  for (let i = 0; i < json.length; i++) {
    const item = json[i]
    prodList = [...prodList, createProdItem(item)]
  }
  return prodList
}

function createProdItem(item: any): prodModel {
  return {
    prod_id: item.prod_id,
    name: item.name,
    brand: item.brand,
    weight: item.weight,
    price: money(item.price),
    price_before: item.price_before != null? money(item.price_before) : undefined,
    market_id: item.market_id,
  }
}

function createMercList(json: any[]) {
  let mercList: mercModel[] = []
  for (let i = 0; i < json.length; i++) {
    const item = json[i]
    mercList = [...mercList, createMercItem(item)]
  }
  return mercList
}

function createMercItem(item: any): mercModel {
  return {
    id: item.id,
    name: item.name,
    address: item.address,
    rating: parseInt(item.rating),
    latitude: parseFloat(item.latitude),
    longitude: parseFloat(item.longitude),
    open: parseInt(item.open),
    close: parseInt(item.close),
    open_sat: parseInt(item.open_sat),
    close_sat: parseInt(item.close_sat),
    open_sun: parseInt(item.open_sun),
    close_sun: parseInt(item.close_sun),
    time_min: parseInt(item.time_min),
    time_max: parseInt(item.time_max),
    fee: money(item.fee),
    order_min: money(item.order_min),
    info: item.info
  }
}

function computeDistance([prevLat, prevLong]: [prevLat: number, prevLong: number], [lat, long]: [lat: number, long: number]) {
  const prevLatInRad = toRad(prevLat);
  const prevLongInRad = toRad(prevLong);
  const latInRad = toRad(lat);
  const longInRad = toRad(long);

  return (
    (6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
    )).toFixed(1).replace('.',',')
  );
}

function toRad(angle: number) {
  return (angle * Math.PI) / 180;
}

function isMarketOpen(item: mercModel) {
  const hour = new Date().getHours();
  const weekday = new Date().getDay();
  var isOpen: boolean;
  var openHour: number;
  if (weekday == 6) {
    isOpen = hour >= item.open_sat && hour < item.close_sat;
    openHour = isOpen ? item.close_sat : item.open_sat;
  } else if (weekday == 0) {
    isOpen = hour >= item.open_sun && hour < item.close_sun;
    openHour = isOpen ? item.close_sun : item.open_sun;
  } else {
    isOpen = hour >= item.open && hour < item.close;
    openHour = isOpen ? item.close : item.open;
  }

  return {isOpen, openHour}
}

function removeAccents(text: string) {
  return text?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function getStateCode(region: string) {
  switch (removeAccents(region)) {
    case 'acre':
      return 'AC'
    case 'alagoas':
      return 'AL'
    case 'amapa':
      return 'AP'
    case 'amazonas':
      return 'AM'
    case 'bahia':
      return 'BA'
    case 'ceara':
      return 'CE'
    case 'distrito federal':
      return 'DF'
    case 'espirito santo':
      return 'ES'
    case 'goias':
      return 'GO'
    case 'maranhao':
      return 'MA'
    case 'mato grosso':
      return 'MT'
    case 'mato grosso do sul':
      return 'MS'
    case 'minas gerais':
      return 'MG'
    case 'para':
      return 'PA'
    case 'paraiba':
      return 'PB'
    case 'parana':
      return 'PR'
    case 'pernambuco':
      return 'PE'
    case 'piaui':
      return 'PI'
    case 'rio de janeiro':
      return 'RJ'
    case 'rio grande do norte':
      return 'RN'
    case 'rio grande do sul':
      return 'RS'
    case 'rondonia':
      return 'RO'
    case 'roraima':
      return 'RR'
    case 'santa catarina':
      return 'SC'
    case 'sao paulo':
      return 'SP'
    case 'sergipe':
      return 'SE'
    case 'tocantins':
      return 'TO'
      
    default:
      return region+''
  }
}

export {
  money,
  Money,
  moneyToString,
  createProdList,
  createProdItem,
  createMercList,
  createMercItem,
  computeDistance,
  isMarketOpen,
  removeAccents,
  getStateCode,
}
