import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, SnapshotViewIOS } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import firestore, { firebase } from "@react-native-firebase/firestore";


const Task = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [taskText, setTaskText] = useState('');

  const doEdit = () => {
    setEditMode(true);
    setTaskText(props.item.task);
  };

  const cancelChanges = () => {
    setEditMode(false);
    setTaskText('');
  };

  const completeTask = () => {
    firestore()
      .collection("tasks")
      .doc(props.item.key)
      .update({
        completed: props.item.completed ? false : true,
        completeDate: Date.now(), 
      });
      console.log(props.item.completeDate);
  };
  
  const deleteTask = () => {
    firestore()
      .collection("tasks")
      .doc(props.item.key)
      .delete();
  };
  
  const saveChanges = () => {
    firestore()
      .collection("tasks")
      .doc(props.item.key)
      .update({
        task: taskText,
      })
      .then(() => {
        setEditMode(false);
        setTaskText("");
        Keyboard.dismiss();
      });
  };

/* (new Date(props.item.completeDate["seconds"]+(props.item.completeDate["nanoseconds"]/1000000000))*1000)).toLocaleString("en-US")) */  
  return (
    <TouchableOpacity style={styles.row} onPress={() => completeTask()}>
      <Icon name="done" size={18} color={props.item.completed ? "#FF7700" : "#8B8B8B"} />

      {!editMode ? (
        <>
          <Text style={props.item.completed ? styles.completedTaskText : styles.taskText}>
            {props.item.task}
             {props.item.completed ? (" was completed at "+new Date(props.item.completeDate)) : null}
          </Text>
          <TouchableOpacity style={styles.smallIcon} onPress={() => doEdit()}>
            {props.item.completed ? null : <Icon name="edit" size={18} color="#8B8B8B" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallIcon} onPress={() => deleteTask()}>
            <Icon name="delete-outline" size={18} color="#8B8B8B" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput style={styles.editTaskText} value={taskText} onChangeText={text => setTaskText(text)} autoFocus={true} onSubmitEditing={() => saveChanges() }/>
          <TouchableOpacity style={styles.smallIcon} onPress={() => cancelChanges()}>
            <Icon name="cancel" size={18} color="#4D7EA0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallIcon} onPress={() => saveChanges()}>
            <Icon name="check-circle" size={18} color="#004777" />
          </TouchableOpacity>
        </>
      )}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  taskText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#37474F',
    marginHorizontal: 12,
    textAlign: 'left',
    flexGrow: 1,
    flexShrink: 1,
  },
  editTaskText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color: '#37474F',
    marginHorizontal: 12,
    textAlign: 'left',
    flexGrow: 1,
    flexShrink: 1,
  },
  completedTaskText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#37474F',
    textDecorationLine: 'line-through',
    marginHorizontal: 12,
    textAlign: 'left',
    flexGrow: 1,
    flexShrink: 1,
  },
  smallIcon: {
    height: 44,
    width: 44,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
});

export default Task;
