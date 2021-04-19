import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import MyText from '../../components/MyText';
import { myColors } from '../../constants';

function MercInfo() {

  return(
    <View style={{backgroundColor: myColors.background, flex: 1}} >
      <MyText style={styles.title} >Horário de entrega</MyText>
      {
         
      }
      <Divider style={styles.divider} />
      <MyText style={styles.title} >Pagamento aceitos</MyText>
      <Divider style={styles.divider} />
      <MyText style={styles.title} >Outras informações</MyText>
      <MyText style={styles.text} >{}</MyText>
    </View>
  )
}

const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: myColors.divider
  },
  title: {
    marginLeft: 16,
    marginVertical: 8,
    fontSize: 16,
    color: myColors.text6,
  },
  text: {
    marginHorizontal: 16,
    color: myColors.text5,
  }
})

export default MercInfo