import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

import styles from './styles';
import logo from '../../assets/logo.png';

import api from '../../services/api';

export default function Main({ navigation }) {
  const [newBox, setNewBox] = useState('');

  useEffect(() => {
    async function gotToBox() {
      const box = await AsyncStorage.getItem('@RocketBox:box');

      if (box)
        navigation.navigate('Box');
    }

    gotToBox();
  }, []);

  async function handleSignIn() {
    const response = await api.post('boxes', { title: newBox });

    await AsyncStorage.setItem('@RocketBox:box', response.data._id);

    navigation.navigate('Box');
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <TextInput
        style={styles.input}
        placeholder="Create a Box"
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        value={newBox}
        onChangeText={text => setNewBox(text)}
      />
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}