import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Linking, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Camera } from 'expo-camera';

export default function App() {

  const [contacts, setContacts] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This app looks terrible!</Text>
        <Camera style={styles.camera} type={type}>
          <View style={styles.view}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={styles.button}> Flip </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      <StatusBar style="auto" />
      <Button onPress={() => console.log('button pressed')} title="Click Here" />
      <FlatList
        style={styles.text}
        data={contacts}
        renderItem={({ item }) => item.name === undefined ? <Button title='no contact' onPress={() => console.log(item.name)} /> : <Button title={item.name} onPress={() => call(item)} />}
        keyExtractor={item => item.id}
      />
    </View>
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
    borderColor: '#0e0',
    borderWidth: 2,
    marginTop: 45,
    padding: 5,
  },
  list: {
    flex: 2,
    borderColor: 'red',
    borderWidth: 2,
  },
  camera: {
    height: '40%',
    width: '100%',
  },
  button: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    height: 40,
    width: 40,
  },
});
