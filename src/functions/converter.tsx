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
    prodList = [...prodList, {
      prodKey: item.prodKey,
      image: item.image,
      nome: item.nome,
      mercKey: item.mercKey,
      marca: item.marca,
      quantidade: item.quantidade,
      preco: money(item.preco),
      precoAntes: item.precoAntes != null? money(item.precoAntes) : undefined,
    }]
  }
  return prodList
}

function createMercList(json: any[]) {
  let mercList: mercModel[] = []
  for (let i = 0; i < json.length; i++) {
    const item = json[i]
    mercList = [...mercList, {
      key: item.key,
      nome: item.nome,
      endereco: item.endereco,
      latitude: parseFloat(item.latitude),
      longitude: parseFloat(item.longitude),
      open: parseInt(item.open),
      close: parseInt(item.close),
      openSab: parseInt(item.openSab),
      closeSab: parseInt(item.closeSab),
      openDom: parseInt(item.openDom),
      closeDom: parseInt(item.closeDom),
      minPrazo: parseInt(item.minPrazo),
      maxPrazo: parseInt(item.maxPrazo),
      taxa: money(item.taxa),
      minPedido: money(item.minPedido),
      info: item.info
    }]
  }
  return mercList
}

function createMercItem(item: any): mercModel {
  return {
    key: item.key,
    nome: item.nome,
    endereco: item.endereco,
    latitude: parseFloat(item.latitude),
    longitude: parseFloat(item.longitude),
    open: parseInt(item.open),
    close: parseInt(item.close),
    openSab: parseInt(item.openSab),
    closeSab: parseInt(item.closeSab),
    openDom: parseInt(item.openDom),
    closeDom: parseInt(item.closeDom),
    minPrazo: parseInt(item.minPrazo),
    maxPrazo: parseInt(item.maxPrazo),
    taxa: money(item.taxa),
    minPedido: money(item.minPedido),
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
    isOpen = hour >= item.openSab && hour < item.closeSab;
    openHour = isOpen ? item.closeSab : item.openSab;
  } else if (weekday == 0) {
    isOpen = hour >= item.openDom && hour < item.closeDom;
    openHour = isOpen ? item.closeDom : item.openDom;
  } else {
    isOpen = hour >= item.open && hour < item.close;
    openHour = isOpen ? item.close : item.open;
  }

  return {isOpen, openHour}
}

export {
  money,
  Money,
  moneyToString,
  createProdList,
  createMercList,
  createMercItem,
  computeDistance,
  isMarketOpen,
}
