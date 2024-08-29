import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import MyVerticallyCenteredModal from './UpdateTask';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTask, removeTaskFromList, getTasksFromServer, deleteTaskToServer } from '../slices/tasksSlice';
const TasksList = () => {
  const dispatch = useDispatch();
  const { tasksList } = useSelector((state) => state.tasks);
  const [modalShow, setModalShow] = useState(false);

  const updateTask = (task) => {
    setModalShow(true);
    dispatch(setSelectedTask(task));
  };

  const deleteTask = (task) => {
    dispatch(deleteTaskToServer(task))
      .unwrap()
      .then(() => {
        dispatch(removeTaskFromList(task));
      });

  };

  useEffect(() => {
    dispatch(getTasksFromServer());
  }, [dispatch]);
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasksList && tasksList.map((task, index) => {
            return (
              <tr className="text-center" key={index}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <Button
                    variant="primary"
                    className="mx-3"
                    onClick={() => updateTask(task)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button variant="primary">
                    <i className="bi bi-trash3" onClick={() => deleteTask(task)}></i>
                  </Button>
                </td>
              </tr>
            );
          })}

        </tbody>
      </Table>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default TasksList;
