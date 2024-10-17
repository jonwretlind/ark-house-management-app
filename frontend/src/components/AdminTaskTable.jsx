// src/pages/AdminTaskTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';

const AdminTaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState({});

  // Base API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [API_URL]);

  // Handle drag and drop for priority sorting
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    setTasks(reorderedTasks);
    try {
      await axios.put(`${API_URL}/tasks/${movedTask._id}`, { priority: destination.index + 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  // Handle inline task updates
  const handleEditChange = (id, field, value) => {
    setEditTask((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleUpdateTask = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, editTask[id], {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditTask((prev) => ({ ...prev, [id]: undefined }));  // Reset editing state
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <Table {...provided.droppableProps} ref={provided.innerRef}>
              <TableHead>
                <TableRow>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <TableRow {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <TableCell>
                          <TextField
                            value={editTask[task._id]?.name || task.name}
                            onChange={(e) => handleEditChange(task._id, 'name', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={editTask[task._id]?.description || task.description}
                            onChange={(e) => handleEditChange(task._id, 'description', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={editTask[task._id]?.points || task.points}
                            onChange={(e) => handleEditChange(task._id, 'points', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleUpdateTask(task._id)}>Save</Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default AdminTaskTable;
