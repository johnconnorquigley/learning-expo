import * as React from 'react';
import { useState } from 'react';
import { Image, Animated, StyleSheet, Alert, Text, View, Button, ActivityIndicator, Easing } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


export default function TabThreeScreen() {

  const [state, setState] = useState('Click to Double! ');
  const [font, setFont] = useState(64)

   const newState = () => {
      setState(state.concat(state));
      setFont(font * .75);
      console.log(state)
   }


  const PresentationalComponent = (props) => {
       return (
          <View>
             <Text onPress = {props.newState} style={{fontSize: props.styleProp}}>
                {props.myState}
             </Text>
          </View>
       )
    }

  return (

    <ScrollView>
    <View style={styles.container}>
        <PresentationalComponent myState = {state} newState = {newState} styleProp = {font}/>
        <View style={styles.buttonContainer}>
          <Button
            title="Reset"
            onPress={() => {setFont(64); setState('Click to Double! ')}}
            color="#FFFFFF"
            accessibilityLabel="Doubler Text"
          />
        </View>
    </View>
    </ScrollView>

  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    backgroundColor: "#1a1aff",
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 5,
  }
});
