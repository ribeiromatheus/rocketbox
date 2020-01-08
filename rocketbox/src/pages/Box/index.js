import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import styles from './styles';
// import ImagePicker from 'react-native-image-picker';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';cls

import socket from 'socket.io-client';

import api from '../../services/api';
import BaseUrl from '../../../credentials/baseUrl';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { formatDistanceToNow } from 'date-fns';
import pt from 'date-fns/locale/pt';

export default function Box() {
  const [boxes, setBoxes] = useState([]);

  // openFile = async file => {
  //   try {
  //     const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;

  //     await RNFS.downloadFile({
  //       formUrl: file.url,
  //       toFile: filePath
  //     });

  //     await FileViewer.open(filePath);
  //   } catch (err) {
  //     console.log("Arquivo nao suportado");
  //   }
  // };

  useEffect(() => {
    AsyncStorage.getItem('@RocketBox:box').then(box => {
      const io = socket(BaseUrl.ip);

      io.emit('connectRoom', box);
      io.on('file', data => {
        setBoxes(data)
      });
    });
  }, []);

  useEffect(() => {
    async function loadBoxes() {
      const box = await AsyncStorage.getItem('@RocketBox:box');

      const response = await api.get(`boxes/${box}`);

      setBoxes(response.data);
    }

    loadBoxes();
  }, []);

  useEffect(() => {
    async function getPermissionAsync() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    getPermissionAsync();
  }, []);

  async function handleUpload() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    let localUri = result.uri;
    let filename = localUri.split('/').pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const image = {
      uri: localUri,
      name: filename,
      type
    };

    const data = new FormData();

    data.append('file', image);

    api.post(`/boxes/${boxes._id}/files`, data);
  }

  const { title, files } = boxes;
  return (
    <View style={styles.container}>
      <Text style={styles.boxTitle}>{title}</Text>
      <FlatList
        style={styles.list}
        data={files}
        keyExtractor={file => file._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.file} onPress={() => { }}>
            <View style={styles.fileInfo}>
              <Icon name="insert-drive-file" size={24} color="#a5cfff" />
              <Text style={styles.fileTitle}>{item.title}</Text>
            </View>

            <Text style={styles.fileData}>
              Há {formatDistanceToNow(new Date(item.createdAt), { locale: pt })}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={handleUpload}>
        <Icon name="cloud-upload" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}