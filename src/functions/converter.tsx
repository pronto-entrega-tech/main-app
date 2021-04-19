import { mercModel } from "../components/MercItem";

export function toMoneyInt(value: string) {
  return Number.parseInt(value.replace('.', ''))
}

export function toMoneyString(value: number) {
  const v = value.toString()
  return v.substring(0, v.length-2)+','+v.substring(v.length-2, v.length)
}

function toPrice(value: number | string) {
  if (typeof value == 'string') return value.replace('.',',')
  if (typeof value == 'undefined') return value
  const price = value.toFixed(2).toString().replace('.',',');
  return (price)
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

export default {
  toPrice,
  computeDistance,
  open: isMarketOpen,
};