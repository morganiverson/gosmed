
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';


const App = () => {

  console.log("App Loaded!")
  return (
    <SafeAreaView style = {styles.cont}>
      <Text>Welcome to Your New App!</Text>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cont: {
    alignItems: "center", 
    justifyContent: "center", 
    flex: 1
  }
});

export default App;
