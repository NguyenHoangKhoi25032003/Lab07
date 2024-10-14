import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

const App = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const apiUrl = 'https://6703916dab8a8f892730abc4.mockapi.io/HoTen';

  // Lấy dữ liệu từ API khi ứng dụng khởi động
  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  const addItem = () => {
    if (name && age) {
      // Thêm mục mới vào MockAPI
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age }),
      })
        .then(response => response.json())
        .then(newItem => {
          setData(prevData => [...prevData, newItem]);
          setName('');
          setAge('');
        })
        .catch(error => console.error(error));
    } else {
      alert('Vui lòng nhập đủ họ tên và tuổi!');
    }
  };

  const deleteItem = () => {
    if (editingId) {
      // Xóa mục khỏi MockAPI
      fetch(`${apiUrl}/${editingId}`, {
        method: 'DELETE',
      })
        .then(() => {
          setData(prevData => prevData.filter(item => item.id !== editingId));
          setEditingId(null);
          setName('');
          setAge('');
        })
        .catch(error => console.error(error));
    } else {
      alert('Chọn mục để xóa!');
    }
  };

  const editItem = (item) => {
    setName(item.name);
    setAge(item.age);
    setEditingId(item.id);
  };

  const updateItem = () => {
    if (editingId && name && age) {
      // Cập nhật mục trên MockAPI
      fetch(`${apiUrl}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age }),
      })
        .then(response => response.json())
        .then(updatedItem => {
          setData(prevData =>
            prevData.map(item => (item.id === editingId ? updatedItem : item))
          );
          setEditingId(null);
          setName('');
          setAge('');
        })
        .catch(error => console.error(error));
    } else {
      alert('Vui lòng chọn mục để sửa và nhập đủ thông tin!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 30 }}>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ tên"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập tuổi"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Thêm" onPress={addItem} />
        <Button title={editingId ? "Cập nhật" : "Sửa"} onPress={updateItem} />
        <Button title="Xóa" onPress={deleteItem} />
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Họ Tên</Text>
          <Text style={styles.tableHeaderText}>Tuổi</Text>
        </View>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => editItem(item)} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.age}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default App;
