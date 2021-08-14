import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Linking } from 'react-native';
import * as Contacts from 'expo-contacts';
import { NativeBaseProvider } from 'native-base';

export default function App() {

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if(status === 'granted') {
        let contactList = await Contacts.getContactsAsync();
        setContacts(contactList.data);
      }
    }

    getContacts();
  }, []);

  function call(person) {
    const phoneNumber = person.phoneNumbers[0].digits;
    const link = `tel:${phoneNumber}`;

    Linking.canOpenURL(link)
    .then(supported => Linking.openURL(link))
    .catch(console.error);
  }

  return (
    <NativeBaseProvider>
        <View style={styles.container}>
        <Text style={styles.text}>About time this worked</Text>
        <StatusBar style="auto" />
        <Button onPress={() => console.log('button pressed')} title="Click Here"/>
        <FlatList
          style={styles.text}
          data={contacts}
          renderItem={({ item }) => item.name === undefined ? <Button title='no contact' onPress={() => console.log(item.name)} /> : <Button title={item.name} onPress={() => call(item)}/>}
          keyExtractor={item => item.id}
        />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f4f4f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 50,
    borderColor:'#0e0',
    borderWidth: 2,
    marginTop: 45,
  },
  list: {
    flex: 2,
    borderColor: 'red',
    borderWidth: 2,
  }
});
