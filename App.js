import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from "./color";
import { KEY_STORAGE } from "dotenv";

const App = () => {
  const [working, setWorking] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [todos, setTodos] = useState({});
  const work = () => {
    setWorking(true);
    setKeyword("");
  };
  const travel = () => {
    setWorking(false);
    setKeyword("");
  };
  const onChangeText = payload => setKeyword(payload);
  const saveTodosToAsyncStorage = async (toSave) => {
    const s = JSON.stringify(toSave);
    await AsyncStorage.setItem(KEY_STORAGE, s);
  };
  const loadTodosFromAsyncStorage = async () => {
    const s = await AsyncStorage.getItem(KEY_STORAGE);
    if (s !== null) {
      setTodos(JSON.parse(s));
    }
  }

  const addTodo = async () => {
    // Validation
    if (keyword === "") {
      return;
    }
    
    // Save todo
    const newTodos = {
      [Date.now()]: {
        id: Date.now(),
        text: keyword,
        work: working,
        done: false,
      }, ...todos
    };
    setTodos(newTodos);
    await saveTodosToAsyncStorage(newTodos);

    // Initialize
    setKeyword("");
  };

  const doneTodo = async (key) => {
    Alert.alert(
      "Done to do",
      "Are you sure ?",
      [
        {text: "Cancel"},
        {
          text: "OK", onPress: async () => {
            const newTodos = { ...todos };
            newTodos[key].done = true;
            
            setTodos(newTodos);
            await saveTodosToAsyncStorage(newTodos);
          }
        },
      ],
    )
  };


  useEffect(() => {
    loadTodosFromAsyncStorage();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Pressable onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? theme.blue : theme.lightGrey }}>Work</Text>
        </Pressable>
        <Pressable onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? theme.blue : theme.lightGrey }}>Travel</Text>
        </Pressable>
      </View>
      <View>
        <TextInput
          value={keyword}
          onChangeText={onChangeText}
          onSubmitEditing={addTodo}
          returnKeyType="done"
          style={styles.input}
          placeholder={working ? `Add Todo` : `Where do you want to go?`}
        >
        </TextInput>
      </View>
      <ScrollView>
        {
          Object.keys(todos)
            .filter((key) => todos[key].work === working && !todos[key].done)
            .map((key) => (
              <Pressable 
                key={todos[key].id} 
                onLongPress={() => doneTodo(key)}
                style={styles.todo}
              >
                <Text style={styles.todoText}>{todos[key].text}</Text>
              </Pressable>
            ))
        }
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.bg,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 30,
    fontWeight: "600",
  },
  input: {
    backgroundColor: theme.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 18,
  },
  todo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 5,
    backgroundColor: theme.green,
    borderRadius: 10,
  },
  todoText: {
    padding: 10,
    // paddingVertical: 5,
    color: theme.bg,
    fontSize: 18,
  },
});



export default App;