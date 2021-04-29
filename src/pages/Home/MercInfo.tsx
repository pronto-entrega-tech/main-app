import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import { Chip } from 'react-native-paper';
import Loading from '../../components/Loading';
import { mercModel } from '../../components/MercItem';
import MyText from '../../components/MyText';
import { device, images, myColors } from '../../constants';
import { createMercItem } from '../../functions/converter';
import requests from '../../services/requests';

function MercInfo({route}: {route: any}) {
  const [mercItem, setMercItem] = React.useState<mercModel>(route.params.item)

  const getHour = (open: number, close: number) => {
    return `${open.toString().padStart(2, '0')}:00 às ${close.toString().padStart(2, '0')}:00`
  }

  const payDelivery = [
    {icon: images.cash, title: 'Dinheiro'},
    {icon: images.mastercard, title: 'Mastercard'},
    {icon: images.mastercard, title: 'Mastercard Débito'},
    {icon: images.visa, title: 'Visa'},
    {icon: images.visa, title: 'Visa Débito'},
    {icon: images.elo, title: 'Elo'},
    {icon: images.elo, title: 'Elo Débito'},
  ]

  React.useEffect(() => {
    if (!device.web) return
    fetch(requests+'mercList.php')
      .then((response) => response.json())
      .then((json) => setMercItem(createMercItem(json[0])))
      .catch((error) => console.error(error));
  }, [])

  if (!mercItem)
  return <Loading />

  const hour = getHour(mercItem.open, mercItem.close)
  const time = [
    {day: 'Domingo', hour: getHour(mercItem.openDom, mercItem.closeDom)},
    {day: 'Segunda', hour: hour},
    {day: 'Terça', hour: hour},
    {day: 'Quarta', hour: hour},
    {day: 'Quinta', hour: hour},
    {day: 'Sexta', hour: hour},
    {day: 'Sábado', hour: getHour(mercItem.openSab, mercItem.closeDom)},
  ]

  return(
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{height: device.height-(device.web? 56:0)}}
      contentContainerStyle={{backgroundColor: myColors.background, paddingBottom: 64, paddingTop: 8}} >
      <MyText style={styles.title} >Horário de entrega</MyText>
      {
        time.map((item) => (
           <View key={item.day} style={{marginHorizontal: 16, marginBottom: 10}} >
             <MyText style={styles.time} >{item.day}</MyText>
             <MyText style={[styles.time, {position: 'absolute', marginLeft: 80}]} >{item.hour}</MyText>
           </View>
        ))
      }
      <Divider style={styles.divider} />
      <MyText style={styles.title} >Pagamento na entrega</MyText>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingBottom: 12}}>
        {
          payDelivery.map((item, i) => {
            return (
              <Chip
                key={i}
                textStyle={{fontFamily: 'Regular'}}
                avatar={<Image source={item.icon}
                containerStyle={{height: 24, width: 24}} />}
                style={{margin: 4, padding: 2}} >{item.title}</Chip>
            )
          })
        }
      </View>
      <Divider style={styles.divider} />
      <MyText style={styles.title} >Outras informações</MyText>
      <MyText style={styles.text} >{mercItem.info}</MyText>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: myColors.divider
  },
  title: {
    marginLeft: 16,
    marginVertical: 12,
    fontSize: 19,
    color: myColors.text4_5,
    fontFamily: 'Medium'
  },
  time: {
    fontSize: 16,
    color: myColors.text4,
  },
  text: {
    fontSize: 16,
    color: myColors.text4,
    marginHorizontal: 16,
  }
})

export default MercInfo